import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { ObjectId } from 'mongodb';
import Anthropic from '@anthropic-ai/sdk';
import { connectDb, getDb } from './db.js';
import { hashPassword, verifyPassword, signSession, setSessionCookie, clearSessionCookie, requireAuth } from './auth.js';
import { CHAT_SYSTEM_PROMPT, SKIN_ANALYSIS_SYSTEM_PROMPT } from './prompts.js';
import { SKIN_ANALYSIS_JSON_SCHEMA, ZONE_POSITIONS } from './schema.js';

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('Missing ANTHROPIC_API_KEY — copy .env.example to .env and add your key.');
  process.exit(1);
}

const MODEL = 'claude-sonnet-5';
const client = new Anthropic();

const RETENTION_DAYS = Number(process.env.PHOTO_RETENTION_DAYS || 7);
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const app = express();
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '15mb' })); // room for a base64 selfie
app.use('/uploads', express.static(UPLOAD_DIR));

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, acceptedTerms } = req.body ?? {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email and password are required' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }
  if (acceptedTerms !== true) {
    return res.status(400).json({ error: 'You must accept the demo terms & consent to continue' });
  }

  const db = getDb();
  const normalizedEmail = String(email).trim().toLowerCase();
  const existing = await db.collection('users').findOne({ email: normalizedEmail });
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const passwordHash = await hashPassword(password);
  const now = new Date();
  const { insertedId } = await db.collection('users').insertOne({
    name,
    email: normalizedEmail,
    passwordHash,
    createdAt: now,
    termsAcceptedAt: now,
  });

  const user = { _id: insertedId, name, email: normalizedEmail };
  setSessionCookie(res, signSession(user));
  res.status(201).json({ id: insertedId, name, email: normalizedEmail });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

  const db = getDb();
  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await db.collection('users').findOne({ email: normalizedEmail });
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid email or password' });

  setSessionCookie(res, signSession(user));
  res.json({ id: user._id, name: user.name, email: user.email });
});

app.post('/api/auth/logout', (_req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ id: req.user.id, name: req.user.name, email: req.user.email });
});

// ---------------------------------------------------------------------------
// Chat (unchanged — streams plain-text chunks of the assistant reply)
// ---------------------------------------------------------------------------

app.post('/api/chat', async (req, res) => {
  const { message, history = [] } = req.body ?? {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message is required' });
  }

  const messages = [
    ...history
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role, content: String(m.text ?? '') })),
    { role: 'user', content: message },
  ];

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');

  try {
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: 1024,
      system: CHAT_SYSTEM_PROMPT,
      messages,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        res.write(event.delta.text);
      }
    }
    res.end();
  } catch (err) {
    console.error('chat error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'chat_failed', message: err.message });
    } else {
      res.end();
    }
  }
});

// ---------------------------------------------------------------------------
// Skin analysis — requires login. Photo is only written to disk if the user
// explicitly consented (storeConsent) for THIS scan; the score/metrics are
// always saved (for the progress trend chart) but the photo is optional and
// auto-expires — see the retention sweep below.
// ---------------------------------------------------------------------------

app.post('/api/skin-analysis', requireAuth, async (req, res) => {
  const { imageBase64, mediaType = 'image/jpeg', storeConsent = false } = req.body ?? {};
  if (!imageBase64 || typeof imageBase64 !== 'string') {
    return res.status(400).json({ error: 'imageBase64 is required' });
  }
  const data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1200,
      system: SKIN_ANALYSIS_SYSTEM_PROMPT,
      output_config: { format: { type: 'json_schema', schema: SKIN_ANALYSIS_JSON_SCHEMA } },
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data } },
            {
              type: 'text',
              text: 'Give a cosmetic, non-diagnostic read of this selfie: apparent hydration, visible redness, visible texture/pores, and overall impression. Follow the system rules exactly.',
            },
          ],
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === 'text');
    if (!textBlock) throw new Error('No text content in model response');
    const parsed = JSON.parse(textBlock.text);

    const db = getDb();
    const now = new Date();
    let photoPath = null;
    let photoUrl = null;
    let photoExpiresAt = null;

    if (storeConsent) {
      const ext = mediaType.split('/')[1] || 'jpg';
      const filename = `${crypto.randomUUID()}.${ext}`;
      const userDir = path.join(UPLOAD_DIR, req.user.id);
      fs.mkdirSync(userDir, { recursive: true });
      fs.writeFileSync(path.join(userDir, filename), Buffer.from(data, 'base64'));
      photoPath = path.join(req.user.id, filename);
      photoUrl = `/uploads/${req.user.id}/${filename}`;
      photoExpiresAt = new Date(now.getTime() + RETENTION_DAYS * 24 * 60 * 60 * 1000);
    }

    const { insertedId } = await db.collection('scans').insertOne({
      userId: req.user.id,
      createdAt: now,
      overallScore: parsed.overallScore,
      headline: parsed.headline,
      summaryTags: parsed.summaryTags,
      metrics: parsed.metrics,
      photoPath,
      photoUrl,
      photoExpiresAt,
    });

    res.json({
      scanId: insertedId,
      capturedAt: 'Just now',
      photoStored: storeConsent,
      photoRetentionDays: storeConsent ? RETENTION_DAYS : null,
      overallScore: parsed.overallScore,
      headline: parsed.headline,
      summaryTags: parsed.summaryTags,
      zones: ZONE_POSITIONS.map((pos, i) => ({ ...pos, ...parsed.zones[i] })),
      metrics: parsed.metrics,
      recommendedActives: parsed.recommendedActives,
      warning: parsed.warning,
    });
  } catch (err) {
    console.error('skin-analysis error:', err);
    res.status(500).json({ error: 'skin_analysis_failed', message: err.message });
  }
});

// Scan history for the Progress page — before/after + weekly milestones both
// read from this same list (oldest vs. newest, and the full chronological list).
app.get('/api/scans', requireAuth, async (req, res) => {
  const db = getDb();
  const scans = await db
    .collection('scans')
    .find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .toArray();

  res.json(
    scans.map((s) => ({
      id: s._id,
      date: s.createdAt,
      score: s.overallScore,
      headline: s.headline,
      note: s.summaryTags?.join(' • ') ?? '',
      photoUrl: s.photoUrl ?? null, // null if never stored, or expired & auto-deleted
      metrics: s.metrics ?? null, // hydration/barrier/redness/smoothness — powers the Progress page's trend charts
    }))
  );
});

// Real account deletion — wipes the user, every scan record, and every
// stored photo file on disk. This is the backend for the existing
// "Purge Biometrics & Delete Account" button in Profile.jsx.
app.delete('/api/account', requireAuth, async (req, res) => {
  const db = getDb();
  const userId = req.user.id;

  const scans = await db.collection('scans').find({ userId }).toArray();
  for (const scan of scans) {
    if (scan.photoPath) {
      const fullPath = path.join(UPLOAD_DIR, scan.photoPath);
      fs.rm(fullPath, { force: true }, () => {});
    }
  }
  fs.rm(path.join(UPLOAD_DIR, userId), { recursive: true, force: true }, () => {});

  await db.collection('scans').deleteMany({ userId });
  await db.collection('users').deleteOne({ _id: new ObjectId(userId) });

  clearSessionCookie(res);
  res.json({ ok: true });
});

app.get('/api/health', (_req, res) => res.json({ ok: true, model: MODEL }));

// ---------------------------------------------------------------------------
// Photo retention sweep — deletes expired photo files + clears the DB
// reference, but keeps the scan's score/metrics so progress trends still work.
// ---------------------------------------------------------------------------

async function sweepExpiredPhotos() {
  const db = getDb();
  const now = new Date();
  const expired = await db
    .collection('scans')
    .find({ photoPath: { $ne: null }, photoExpiresAt: { $lte: now } })
    .toArray();

  for (const scan of expired) {
    const fullPath = path.join(UPLOAD_DIR, scan.photoPath);
    fs.rm(fullPath, { force: true }, () => {});
    await db
      .collection('scans')
      .updateOne({ _id: scan._id }, { $set: { photoPath: null, photoUrl: null, photoDeletedAt: now } });
  }

  if (expired.length > 0) {
    console.log(`Retention sweep: deleted ${expired.length} expired photo(s).`);
  }
}

const RETENTION_SWEEP_INTERVAL_MS = Number(process.env.RETENTION_SWEEP_INTERVAL_MS || 60 * 60 * 1000); // hourly by default

async function seedDemoAccount() {
  const db = getDb();
  const email = 'demo@skinai.app';
  const existing = await db.collection('users').findOne({ email });
  if (existing) return;
  const passwordHash = await hashPassword('demo1234');
  await db.collection('users').insertOne({
    name: 'Demo User',
    email,
    passwordHash,
    createdAt: new Date(),
    termsAcceptedAt: new Date(),
  });
  console.log('Seeded demo account: demo@skinai.app / demo1234');
}

async function start() {
  await connectDb();
  await seedDemoAccount();
  await sweepExpiredPhotos();
  setInterval(sweepExpiredPhotos, RETENTION_SWEEP_INTERVAL_MS);

  const port = process.env.PORT || 8787;
  app.listen(port, () => console.log(`SkinAI backend listening on http://localhost:${port}`));
}

start();
