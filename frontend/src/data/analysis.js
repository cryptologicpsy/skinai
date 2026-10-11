// Mock AI skin-analysis payload shape. Replace with the real response
// from services/skinAnalysisService.js once a backend + vision model is wired up.

export const LATEST_SCAN_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAoJTUH1nIWfcOKEhY_-YnbEATcwiVVkl7FI7ZldDATQBHvFukgljtgeZSS0QDsTT_uJmDpRTUToiilaJTV011ePE6AEHJdMrdixg6trw05KsbfJDNMxhwG9PREKsTEredbD6qFHiJBT4aRzm2hTv9TgYg0j0ap1K6iPjERFePqhMxPsk-PRquOgAkOGGhJtQw4TzbjSK3FoiWAyfp39yth_0kkeTXQaAkr2L7a6W4_TpawBU6ypaA';

export const SKIN_SCAN_PLACEHOLDER =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAgkF99Z7ylVgK3ab6ZyOERdYjMKvzMMJ1iyiO3q8ND-YBxraOerZDmlirI_3qkpOZyrQiCdLXg6pd8fSL_bs0B2isNwB5c8IS8bwxHxrYoMiK6rzNpIBWKGvwFPt2Iuyg2GhJPgSnvkSU3v2I0HTHHtE-Bc980ezTgxWqn4GmpssuDwrM2oW8DqyFXVgzx-11rS3fB_ZwBYsMsfSy_eni86YAMtGSe9KKnjUxv5xYiMEmr0UJjp00';

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
