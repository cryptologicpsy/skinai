#!/usr/bin/env bash
# Runs ON THE VPS (invoked over SSH by .github/workflows/deploy.yml), inside
# this repo's own clone at the deploy path (see docs/deployment.md).
#
# Scoped entirely to the "skinai" Compose project (docker-compose.prod.yml's
# top-level `name: skinai`) via -f/-p — it never runs `docker compose down`
# and never touches volumes, so it can't affect this app's existing data or
# any other app's containers on the same VPS.
set -euo pipefail

IMAGE_TAG="${1:?Usage: deploy-remote.sh <git-sha>}"
GHCR_OWNER="${GHCR_OWNER:?GHCR_OWNER env var is required}"

cd "$(dirname "$0")/.."

git fetch origin main
git checkout "$IMAGE_TAG"

export IMAGE_TAG
export GHCR_OWNER
# Persisted so plain `docker compose ...` commands run by hand on the VPS
# between deploys (e.g. `docker compose logs`) keep working without needing
# to remember the current SHA.
{
  echo "IMAGE_TAG=$IMAGE_TAG"
  echo "GHCR_OWNER=$GHCR_OWNER"
} > .env

docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d --remove-orphans

echo "Waiting for services to become healthy..."
sleep 5

if ! curl -sf http://127.0.0.1:5001/api/health > /dev/null; then
  echo "FAILED health check: backend (127.0.0.1:5001/api/health)" >&2
  exit 1
fi

if ! curl -sf http://127.0.0.1:8081/ > /dev/null; then
  echo "FAILED health check: frontend (127.0.0.1:8081/)" >&2
  exit 1
fi

# Only prunes dangling/unused images older than 3 days — never touches
# volumes, so Mongo data and uploaded photos are untouched.
docker image prune -f --filter "until=72h" || true

echo "Deployed $IMAGE_TAG successfully."
