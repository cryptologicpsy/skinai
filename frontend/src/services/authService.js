// Real auth service — calls the backend (server/), which hashes passwords
// with bcrypt and issues an httpOnly JWT session cookie. No password or
// token ever touches localStorage/sessionStorage from this file.

// Empty string = relative requests (e.g. "/api/auth/login"), which Vite's
// dev-server proxy (see vite.config.js) and the production reverse proxy
// both route to the backend while keeping the browser on one origin — this
// is required for the session cookie to actually be sent. Only set
// VITE_API_BASE_URL if you deliberately host the API on a different origin
// (then also set JWT cookie sameSite to 'none' + secure on the backend).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function handle(res) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || 'Request failed');
  return body;
}

export function login({ email, password }) {
  return fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }).then(handle);
}

export function signup({ name, email, password, acceptedTerms }) {
  return fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, acceptedTerms }),
  }).then(handle);
}

export function logout() {
  return fetch(`${API_BASE_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' }).then(handle);
}

export function getCurrentUser() {
  return fetch(`${API_BASE_URL}/api/auth/me`, { credentials: 'include' }).then(handle);
}

export function deleteAccount() {
  return fetch(`${API_BASE_URL}/api/account`, { method: 'DELETE', credentials: 'include' }).then(handle);
}
