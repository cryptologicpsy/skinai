// Raw MongoDB driver connection — no Mongoose, no ORM. Collections are
// accessed directly (db.collection('users'), etc.) and documents are plain
// objects; callers are responsible for shaping their own queries/updates.

import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.MONGODB_DB || 'skinai';

const client = new MongoClient(uri);
let db = null;

export async function connectDb() {
  if (db) return db;
  await client.connect();
  db = client.db(dbName);

  // Indexes — created once at startup, idempotent on restart.
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('scans').createIndex({ userId: 1, createdAt: -1 });
  await db.collection('scans').createIndex({ photoExpiresAt: 1 });

  console.log(`MongoDB connected: ${uri} / db "${dbName}"`);
  return db;
}

export function getDb() {
  if (!db) throw new Error('Database not connected yet — call connectDb() first');
  return db;
}
