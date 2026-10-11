# syntax=docker/dockerfile:1

# --- deps stage ----------------------------------------------------------
# Kept separate from "build" so local dev (docker-compose.yml) can target
# this stage directly and run the Vite dev server without paying for a full
# production build on every container start.
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# --- build stage -------------------------------------------------------
FROM deps AS build
RUN npm run build

# --- runtime stage -------------------------------------------------------
# Serves the static build only. In production, the VPS's existing host
# Nginx (not this container) is what terminates HTTPS and routes
# skinai.vriva.gr here — see docs/deployment.md.
FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --spider -q http://127.0.0.1/ || exit 1

EXPOSE 80
