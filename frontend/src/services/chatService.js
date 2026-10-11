// Chat service — calls the real backend (server/) which proxies to the
// Claude API. The backend holds the ANTHROPIC_API_KEY; it is never present
// in this frontend bundle. See server/index.js + server/prompts.js for the
// system prompt that keeps replies non-diagnostic (no "detected", no
// accuracy-percentage claims, no therapeutic language).
//
// Falls back to a canned local reply if the backend is unreachable (e.g.
// during frontend-only development), so the UI never hard-fails.

import { CANNED_REPLIES } from '../data/chat.js';

// See authService.js for why this defaults to '' (relative / same-origin via proxy).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

function mockReply() {
  const reply = CANNED_REPLIES[Math.floor(Math.random() * CANNED_REPLIES.length)];
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: `m-${Date.now()}`, role: 'assistant', time: 'Just now', text: reply });
    }, 900);
  });
}

// onChunk(text) is called with each streamed text delta, for live-typing UI.
export async function sendMessage(message, history = [], onChunk) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history: history.map((m) => ({ role: m.role, text: m.text })),
      }),
    });
    if (!res.ok || !res.body) throw new Error(`Chat backend returned ${res.status}`);

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;
      onChunk?.(chunk);
    }

    return { id: `m-${Date.now()}`, role: 'assistant', time: 'Just now', text: fullText };
  } catch (err) {
    console.warn('Chat backend unreachable, falling back to a sample reply:', err.message);
    return mockReply();
  }
}
