// Mock AI skin-analysis payload shape. Replace with the real response
// from services/skinAnalysisService.js once a backend + vision model is wired up.

export const LATEST_SCAN_IMAGE =
  '/images/img-602b98d62e.webp';

export const SKIN_SCAN_PLACEHOLDER =
  '/images/img-67c084b052.webp';

export const MOCK_ANALYSIS_RESULT = {
  capturedAt: 'Yesterday, 8:15 PM',
  overallScore: 84,
  headline: 'Radiance & Balanced',
  summaryTags: ['Looks Well-Hydrated', 'Minimal Visible Redness', 'Even Texture'],
  zones: [
    { id: 'tzone', label: 'T-Zone', score: '92%', x: 18, y: 10, color: 'bg-secondary', detail: 'T-Zone: looks balanced, minimal shine in this photo.' },
    { id: 'malar', label: 'Malar', score: '78%', x: 24, y: 48, color: 'bg-primary', detail: 'Cheeks: slightly more redness visible here than other areas.' },
    { id: 'perioral', label: 'Perioral', score: '89%', x: 50, y: 70, color: 'bg-secondary', detail: 'Mouth area: skin looks smooth, no visible flaking.' },
  ],
  metrics: {
    hydration: { value: 82, delta: '+6% vs last week', note: 'Skin looks plump and dewy in this photo, consistent with good hydration — keep up the routine that is working.' },
    barrier: { value: 90, status: 'Looking Good', note: 'No visible flaking or dryness in this photo' },
    redness: { value: 12, status: 'Calm', note: '-8% vs your average over recent scans' },
    smoothness: { value: 91, status: 'Smooth', note: 'Pores and texture look refined and even in this photo.' },
  },
  recommendedActives: [
    { name: 'Centella Asiatica (Cica)', note: 'Popular pick for soothing the look of redness', badge: 'Priority', icon: 'psychiatry' },
    { name: 'Niacinamide 2%', note: 'Gentle, widely-used for supporting a balanced look', badge: 'Daily', icon: 'biotech' },
    { name: 'Plant-Derived Squalane', note: 'Lightweight oil to help seal in moisture overnight', badge: 'PM', icon: 'opacity' },
  ],
  warning: {
    title: 'Consider Easing Up on Strong Exfoliants',
    detail: 'Your cheeks look a little more flushed in recent photos than usual. You might try pausing glycolic acid above 7% for about a week and see if things look calmer — and check with a dermatologist if redness persists.',
  },
};
