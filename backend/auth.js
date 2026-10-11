import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { getDb } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('Missing JWT_SECRET in server/.env — set it to a long random string.');
  process.exit(1);
}

const COOKIE_NAME = 'skinai_session';
const TOKEN_TTL = '30d';

export function hashPassword(plain) {
  return bcrypt.hash(plain, 12);
}

export function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

export function signSession(user) {
  return jwt.sign({ sub: String(user._id), email: user.email, name: user.name }, JWT_SECRET, {
    expiresIn: TOKEN_TTL,
  });
}

export function setSessionCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}

export function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME);
}

// Attaches req.user = { id, email, name } when a valid session cookie is
// present AND the user still exists (so a JWT outlasting an account
// deletion — stateless tokens don't know about that on their own — is
// rejected rather than treated as a live session).
export async function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: 'not_authenticated' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const db = getDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(payload.sub) });
    if (!user) {
      clearSessionCookie(res);
      return res.status(401).json({ error: 'account_no_longer_exists' });
    }
    req.user = { id: payload.sub, email: payload.email, name: payload.name };
    next();
  } catch {
    return res.status(401).json({ error: 'invalid_session' });
  }
}
