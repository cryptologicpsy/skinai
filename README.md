# SkinAI

An AI-powered skincare assistant: React/Vite frontend + Express/MongoDB
backend, with real accounts, Claude-powered chat and skin-photo analysis,
consent-gated photo storage with automatic retention, and a clear in-app demo
disclosure. See [`backend/README.md`](backend/README.md) for what's real vs.
still-mock, and [`docs/deployment.md`](docs/deployment.md) for production
deployment.

## Stack

- **Frontend** (`frontend/`): React 18 + Vite + React Router + Tailwind CSS
- **Backend** (`backend/`): Express + raw `mongodb` driver (no ORM) + the
  Claude API (chat + vision/structured output for skin analysis)
- **Database**: MongoDB

## Project structure

```
frontend/   React app — see frontend/src/{components,context,data,layouts,pages,services}
backend/    Express API — see backend/{index.js,db.js,auth.js,prompts.js,schema.js}
docs/       deployment.md — VPS setup, Nginx config, CI/CD, backups
scripts/    deploy-remote.sh — runs on the VPS during a CD deploy
.github/    CI (lint/build/docker-build-test on every push/PR) and
            CD (build+push GHCR images, SSH-deploy to the VPS on main)
```

## Local development

Two options — pick whichever fits:

### Option A — plain Node (fastest iteration)

```bash
# Terminal 1 — database (Docker, just for Mongo)
docker compose up -d mongo

# Terminal 2 — backend
cd backend
npm install
cp .env.example .env   # fill in ANTHROPIC_API_KEY + JWT_SECRET
npm run dev             # http://localhost:8787

# Terminal 3 — frontend
cd frontend
npm install
npm run dev             # http://localhost:5173
```

### Option B — everything in Docker

```bash
cp backend/.env.example backend/.env   # fill in ANTHROPIC_API_KEY + JWT_SECRET
docker compose up
```

Brings up Mongo + backend (hot-reload) + frontend (Vite dev server) at
`http://localhost:8081`, with no local Node install required.

A demo account (`demo@skinai.app` / `demo1234`) is seeded automatically on
first backend startup.

## Production

Not run locally — GitHub Actions builds Docker images, pushes them to GHCR,
and deploys to the VPS via `docker-compose.prod.yml`. Full walkthrough
(ports, host Nginx config, one-time VPS setup, required GitHub secrets,
MongoDB backup/restore) in [`docs/deployment.md`](docs/deployment.md).

## Other scripts

```bash
cd frontend && npm run build && npm run preview   # production build + local preview
cd frontend && npm run lint
```
