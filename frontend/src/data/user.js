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
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBxfTbYEvSL81qVn5rdFHshwPz13EaiFQIPhpTc23WvSHvemG0NwkXK2Z8tQMXpvZsGGqH9U9gbOZYFxGBVi-BwyFlB8SC78SMHMl3lTmZYsMORbft4HD3v2WDe_og9V4aKFN1PzzDA_8nuJQyFVwpq14CwZ7yAsh8Jcs_cbfW_rmfzIiOcU9p57u-ME_xoI7Ir7Av5qKN_YVyptdCqOrBLeeeU1o9ZtDlyNjlxIN25dYTRC_tQKAk',
  avatarSmall:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCiwOGV1-cxEewhurx_DWq7PzeHovnKhySy4L5snHmTdN0wULeoYmZGr84sleV55op_NzLQ7RFcRb4eLhXbJrrupQ8ptwqeSizYaPuuW-9JOSkcot0aG8sG7iT30KYF-4Ej0ZmiGQAvvoId2YiB-jahIVMYYjfHIGB6LctBCBPvt-gOEQKaH8ByTKuxZQH_Fmaj_h1vAJg-SWuwj1cYVkRJY9PKP63ISsdO5HphzyYtGC4M1t54jRo',
  barrierScore: 87,
  scansCompleted: 24,
  plan: 'free',
};

export const SKINAI_LOGO =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCewYr5eDmsFBg6Hgn4PrP9VqbcI2SWjuuUc0_CpEzAprvONeNCLdR3vujcAsngMU5xd2eXnGoHr8aDTJKFnlHWHLGmnzc5o1UtegKwgMyy7GbdbAfLX29Y2llat0UrTdFvEf0LX7ll8FZZ5C4ja87I_uS7BxQExWZUCgvBeYk6emSc16mzv_TlBvcEekSLLbXiP4lacwjdxF2vkKpm2Lm362MzPEA3od5m0WNUxTz-gEg0MUSJ5Yc';
