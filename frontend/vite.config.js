import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const BACKEND_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8787';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    // Proxy API calls to the backend so the browser sees everything as
    // same-origin — required for the session cookie (SameSite=Lax) to be
    // sent on fetch() calls; a direct cross-port fetch would silently drop it.
    proxy: {
      '/api': { target: BACKEND_URL, changeOrigin: true },
      '/uploads': { target: BACKEND_URL, changeOrigin: true },
    },
  },
});
