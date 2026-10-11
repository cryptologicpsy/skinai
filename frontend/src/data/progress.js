// Mock longitudinal progress data for the Skin Progress Tracking screen.

export const SCORECARD = {
  barrierRecovery: '+18%',
  rednessDelta: '-24%',
  routineLogDone: 24,
  routineLogTotal: 28,
};

export const BEFORE_AFTER = {
  before: {
    label: 'Day 1 (Oct 12)',
    metricLabel: 'Redness 28%',
    image:
      '/images/img-e1313795ad.webp',
  },
  after: {
    label: 'Day 30 (Today)',
    metricLabel: 'Hydration 82%',
    image:
      '/images/img-96a31c45c9.webp',
  },
};

export const HYDRATION_TREND = {
  current: '82%',
  delta: '+18% vs Oct 12',
  path: 'M 0 65 Q 50 62 100 50 T 200 32 T 300 12',
  points: [
    { x: 0, y: 65 },
    { x: 100, y: 50 },
    { x: 200, y: 32 },
    { x: 300, y: 12, final: true },
  ],
  color: '#486551',
  labels: ['Wk 1 (64%)', 'Wk 2 (69%)', 'Wk 3 (75%)', 'Wk 4 (82%)'],
};

export const REDNESS_TREND = {
  current: '12%',
  delta: '-16% calming',
  path: 'M 0 15 Q 60 20 100 38 T 200 55 T 300 70',
  points: [
    { x: 0, y: 15 },
    { x: 100, y: 38 },
    { x: 200, y: 55 },
    { x: 300, y: 70, final: true },
  ],
  color: '#df7a7a',
  finalColor: '#994345',
  labels: ['Wk 1 (28%)', 'Wk 2 (22%)', 'Wk 3 (17%)', 'Wk 4 (12%)'],
};

export const BARRIER_SCORE = {
  percent: 84,
  current: 'Looking strong',
  baseline: 'Week 1: looked drier',
};

export const WEEKLY_MILESTONES = [
  {
    id: 'm1',
    date: 'Nov 11, Today',
    score: 94,
    note: 'Texture smoothed significantly after adding peptide cream formulation.',
    latest: true,
    image:
      '/images/img-8e5545955a.webp',
  },
  {
    id: 'm2',
    date: 'Nov 4, Week 3',
    score: 89,
    note: 'Much less visible flakiness around the mouth area in recent photos.',
    image:
      '/images/img-aa6fa1596e.webp',
  },
  {
    id: 'm3',
    date: 'Oct 28, Week 2',
    score: 81,
    note: 'Centella asiatica soothing mist introduced; tightness reduced post-cleanse.',
    image:
      '/images/img-702682298b.webp',
  },
  {
    id: 'm4',
    date: 'Oct 21, Week 1',
    score: 74,
    note: 'Starting point — early photos showed more visible dryness and redness.',
    image:
      '/images/img-0bddf03521.webp',
  },
];
