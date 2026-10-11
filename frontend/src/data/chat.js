// Suggested prompts + canned fallback replies for the mock chat path. Real
// replies come from services/chatService.js, which calls the backend.

export const SUGGESTED_PROMPTS = [
  'How can I improve my hydration?',
  'Which ingredients should I look for?',
  'Adjust routine for dry weather',
  'Review sunscreen compatibility',
];

export const CANNED_REPLIES = [
  "I've logged this question! For enhanced hydration synergy without irritating your cheek flush, consider combining a low-molecular weight hyaluronic serum with squalane oil to lock in ambient humidity.",
  'Great question — based on your latest telemetry, your barrier is recovering well. Keep active acids to 2-3x weekly and prioritize ceramide repair in between.',
  'Your recent scan shows improving radiance. I would hold off introducing new actives for 5-7 days so we can isolate what is driving the improvement.',
  "I've flagged that for your dermatologist review. In the meantime, patch-test any new product on your inner forearm for 48 hours first.",
];
