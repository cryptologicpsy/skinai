# SkinAI Backend

Express + raw MongoDB driver (no ORM/Mongoose) + Claude Sonnet 5.

## Local development

```bash
# 1. Start MongoDB (from the repo root, not here)
cd ..
docker compose up -d mongo

# 2. Install deps
cd backend
npm install

# 3. Configure
cp .env.example .env
# edit .env: set ANTHROPIC_API_KEY and JWT_SECRET (a long random string)

# 4. Run
npm run dev
```

Or run the whole stack (frontend + backend + mongo) in Docker at once — see
the root `README.md`.

Health check: `curl http://localhost:8787/api/health`

A demo account (`demo@skinai.app` / `demo1234`) is seeded automatically on
first startup, matching the "Use demo" button on the frontend's Login screen.

## Deploying

See [`../docs/deployment.md`](../docs/deployment.md) for the real path: GitHub
Actions builds Docker images, pushes them to GHCR, and SSH-deploys to a VPS
via `docker-compose.prod.yml` — nothing here needs to be built by hand on the
server.

## What's real vs. mock here

- **Real**: user accounts (bcrypt + MongoDB), sessions (JWT in an httpOnly
  cookie), chat replies and skin-photo analysis (Claude Sonnet 5), photo
  storage + auto-deletion, account deletion, the routine-sync and avatar
  shown around the app (both now reflect the actual logged-in user/scan,
  not a hardcoded demo persona).
- **Still mock / not wired to this backend**: subscription billing (no
  payment processor), most of the Profile screen's settings rows.

## Data retention

Photos are only written to disk if the user explicitly opts in at the time
of a scan (`storeConsent: true` in the request — the frontend's toggle on
the Skin Analysis screen is off by default). Stored photos are deleted
automatically after `PHOTO_RETENTION_DAYS` (default 7) by an hourly sweep —
the scan's score/metrics are kept for the progress trend chart, only the
photo file and its URL are removed.

Deleting an account (`DELETE /api/account`) immediately removes the user,
every scan record, and every stored photo file — no retention delay.

See [`../docs/deployment.md`](../docs/deployment.md) for backup/restore
commands for the production MongoDB volume.
