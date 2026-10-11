# Deployment — skinai.vriva.gr

This covers the one-time VPS setup and how CI/CD deploys work. Nothing here
is applied automatically — every step below is something you run by hand,
once, on your VPS.

## Ports

| Service  | Bind address      | Reachable from        |
|----------|--------------------|------------------------|
| frontend | `127.0.0.1:8081`   | only the host Nginx (reverse proxy) |
| backend  | `127.0.0.1:5001`   | only the host Nginx, under `/api` and `/uploads` |
| mongo    | not published      | only other containers on the `skinai` Docker network |

Nothing is bound to `0.0.0.0`. MongoDB has no host port at all — it's only
reachable from the `backend` container via the internal Docker network
hostname `mongo`.

## Host Nginx — example config (add this yourself, not applied by us)

Your VPS already runs Nginx for other apps — this project does **not**
install a second one, and this file does **not** touch your existing Nginx
config. Add a new server block for this domain, e.g.
`/etc/nginx/sites-available/skinai.vriva.gr`:

```nginx
server {
    listen 80;
    server_name skinai.vriva.gr;

    location /api/ {
        proxy_pass http://127.0.0.1:5001/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads/ {
        proxy_pass http://127.0.0.1:5001/uploads/;
    }

    location / {
        proxy_pass http://127.0.0.1:8081/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Then:

```bash
sudo ln -s /etc/nginx/sites-available/skinai.vriva.gr /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d skinai.vriva.gr   # issues + wires up HTTPS; not assumed to exist already
```

We deliberately don't assume a certificate already exists — `certbot` needs
to be run once by hand.

## One-time VPS setup

1. Confirm Docker + the Compose plugin are already installed (they should
   be, since other apps on this VPS already use Docker):
   `docker --version && docker compose version`.
2. Clone the repo to the deploy path (default assumed by `deploy.yml`:
   `/opt/skinai` — change `vars.VPS_DEPLOY_PATH` if you use a different one):
   ```bash
   sudo mkdir -p /opt/skinai && sudo chown $USER:$USER /opt/skinai
   git clone <your-repo-url> /opt/skinai
   cd /opt/skinai
   chmod +x scripts/deploy-remote.sh
   ```
3. Create `backend/.env` by hand from `backend/.env.example`, filled in with
   real values (this file is gitignored — it never comes from the repo):
   ```bash
   cp backend/.env.example backend/.env
   nano backend/.env   # set ANTHROPIC_API_KEY, JWT_SECRET, etc.
   ```
4. **GHCR read access** — the VPS needs to be able to `docker pull` the
   images this workflow pushes. The workflow pushes using the GitHub-provided
   `GITHUB_TOKEN`, which only exists inside that CI run — **it is not
   available on the VPS**, so the VPS needs its own way in. Pick one:
   - **Easiest: make the GHCR packages public.** After the first successful
     push, go to the package's GitHub page → Package settings → Change
     visibility → Public. Nothing else to configure; `docker pull` works
     unauthenticated. Reasonable here since this is a non-sensitive demo app.
   - **Or keep them private:** create a GitHub [Personal Access Token][pat]
     with `read:packages` scope, then on the VPS, once:
     ```bash
     echo <token> | docker login ghcr.io -u <your-github-username> --password-stdin
     ```
     Docker caches this login in `~/.docker/config.json`, so it's a one-time
     step, not something CI needs to repeat.

   [pat]: https://github.com/settings/tokens?type=beta

5. **Don't deploy yet.** `deploy.yml`'s deploy job only runs when the GitHub
   Actions repository **variable** `VPS_DEPLOY_ENABLED` is set to `true`
   (Settings → Secrets and variables → Actions → Variables). Leave it unset
   until steps 1-4 above are done and you're ready — `build-and-push` will
   still run and validate on every push to `main` regardless, it just won't
   touch the VPS.

## Required GitHub configuration

**Secrets** (Settings → Secrets and variables → Actions → Secrets):

| Name | Value |
|---|---|
| `VPS_HOST` | VPS IP or hostname |
| `VPS_SSH_USER` | SSH username on the VPS |
| `VPS_SSH_KEY` | Private key (PEM) whose matching public key is in that user's `~/.ssh/authorized_keys` on the VPS |
| `VPS_SSH_PORT` | *(optional)* defaults to 22 |

**Variables** (same screen, "Variables" tab):

| Name | Value |
|---|---|
| `VPS_DEPLOY_ENABLED` | `true` — only once you're ready (see step 5 above) |
| `VPS_DEPLOY_PATH` | *(optional)* defaults to `/opt/skinai` |

No GHCR secret is needed for *pushing* — that uses the automatic
`GITHUB_TOKEN`. GHCR *pulling* on the VPS is handled by step 4 above, not by
anything in GitHub.

## How a deploy actually runs

1. Push to `main` → `build-and-push` builds both images, tags each
   `ghcr.io/<owner>/skinai-{frontend,backend}:<commit-sha>` (never `:latest`).
2. If `VPS_DEPLOY_ENABLED=true`, the `deploy` job SSHes in and runs
   `scripts/deploy-remote.sh <sha>`, which: `git checkout`s that same commit,
   `docker compose -f docker-compose.prod.yml pull && ... up -d
   --remove-orphans`, then curls both services' health endpoints and fails
   the job if either doesn't respond.
3. **No `docker compose down` is ever run**, and the script only operates on
   the `skinai` Compose project — it cannot stop or remove another app's
   containers even by mistake.

## MongoDB backup / restore

Data lives in the named volume `mongo_data`, untouched by deploys.

**Backup:**
```bash
cd /opt/skinai
docker compose -f docker-compose.prod.yml exec mongo \
  mongodump --archive=/tmp/skinai-backup.archive --gzip
docker compose -f docker-compose.prod.yml cp mongo:/tmp/skinai-backup.archive ./skinai-backup-$(date +%F).archive
```

**Restore:**
```bash
docker compose -f docker-compose.prod.yml cp ./skinai-backup-2026-01-01.archive mongo:/tmp/restore.archive
docker compose -f docker-compose.prod.yml exec mongo \
  mongorestore --archive=/tmp/restore.archive --gzip --drop
```
(`--drop` replaces existing collections with the backup's contents — omit it
if you want to merge instead of replace.)

Consider a cron job running the backup block nightly and copying the
resulting `.archive` file off the VPS.

## Troubleshooting

- `docker compose -f docker-compose.prod.yml logs -f backend` /
  `... logs -f frontend` / `... logs -f mongo`.
- `docker compose -f docker-compose.prod.yml ps` — healthcheck status shows
  up in the `STATUS` column.
- Backend health directly: `curl http://127.0.0.1:5001/api/health`.
- If `deploy-remote.sh` fails on `docker compose pull` with an auth error,
  re-check step 4 (GHCR read access) above.
