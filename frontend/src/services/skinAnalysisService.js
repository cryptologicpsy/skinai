// Skin-analysis service — calls the real backend (server/), which sends the
// photo to the Claude API (vision + structured output) and holds the
// ANTHROPIC_API_KEY server-side. See server/index.js + server/prompts.js +
// server/schema.js for the non-diagnostic system prompt and response shape.
//
// Falls back to the local mock result if the backend is unreachable, so the
// UI never hard-fails during frontend-only development.

import { MOCK_ANALYSIS_RESULT } from '../data/analysis.js';

// See authService.js for why this defaults to '' (relative / same-origin via proxy).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function toBase64DataUrl(imageSource) {
  const res = await fetch(imageSource);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// imageSource is a blob: URL (user upload / capture) or an https URL (demo placeholder).
// storeConsent: whether the user opted in, for THIS scan, to have the photo
// saved (auto-deleted after a few days) instead of analyzed-and-discarded.
export async function analyzeSkinPhoto(imageSource, storeConsent = false) {
  try {
    const dataUrl = await toBase64DataUrl(imageSource);
    const mediaType = dataUrl.slice(5, dataUrl.indexOf(';')) || 'image/jpeg';

    const res = await fetch(`${API_BASE_URL}/api/skin-analysis`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: dataUrl, mediaType, storeConsent }),
    });
    if (res.status === 401) throw new Error('Please log in to analyze a photo.');
    if (!res.ok) throw new Error(`Analysis backend returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Skin analysis backend unreachable, falling back to a sample result:', err.message);
    return { ...MOCK_ANALYSIS_RESULT, capturedAt: 'Just now' };
  }
}

// Real scan history for the Progress page (newest first). Returns null
// (rather than throwing) when the user isn't logged in or the backend is
// unreachable, so callers can fall back to mock data without extra plumbing.
export async function getScanHistory() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/scans`, { credentials: 'include' });
    if (!res.ok) return null; // not logged in, or backend down
    const scans = await res.json();
    return scans.map((s) => ({
      ...s,
      photoUrl: s.photoUrl ? `${API_BASE_URL}${s.photoUrl}` : null,
    }));
  } catch {
    return null;
  }
}
