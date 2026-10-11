# syntax=docker/dockerfile:1
FROM node:22-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

# uploads/ is where scan photos are written at runtime (see index.js) —
# pre-create it and hand ownership to the image's built-in non-root user
# before dropping privileges, so the mounted volume stays writable.
RUN mkdir -p uploads && chown -R node:node /app
USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --spider -q http://127.0.0.1:8787/api/health || exit 1

EXPOSE 8787
CMD ["node", "index.js"]
