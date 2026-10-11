// Demo login — this account is seeded for real in MongoDB at backend
// startup (see server/index.js) so the "Use demo" button on the Login
// screen logs in against a real, working account out of the box.
export const DEMO_CREDENTIALS = {
  email: 'demo@skinai.app',
  password: 'demo1234',
};

// Mock signed-in user. A real backend would hydrate this from /api/me after login.
export const CURRENT_USER = {
  firstName: 'Elena',
  fullName: 'Elena Rostova',
  skinType: 'Combination / Sensitive',
  memberSince: 'Oct 2024',
  cellularId: '#8841',
  avatar:
    '/images/img-d3ef7d81b6.webp',
  avatarSmall:
    '/images/img-6a02bc13d0.webp',
  barrierScore: 87,
  scansCompleted: 24,
  plan: 'free',
};

export const SKINAI_LOGO =
  '/images/img-222e6ee534.webp';
