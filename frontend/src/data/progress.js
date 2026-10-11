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
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDRTatt_spNlRYeOgfSMyxs-oaJW3S7FYKRP9CC41C1CrJl9wZP6CleN-XoW3sV1QbeA1aV5KSKTXF5hohXFbeR_817YwDejT6GTtTPbg3Aqos3p2mJse0AE6KqV6HNyvr_Pt5qMDMB9qL_gGHej2634lQUZwHW6wscYiBP_mAhGgh17Z7m2uPyNZRxoxGVkGvGgtGQVMeKr5lGyrZdfbyOng-a8MQESDUpqDleycsms-Sg6A_8Uec',
  },
  after: {
    label: 'Day 30 (Today)',
    metricLabel: 'Hydration 82%',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDmrt8J86xirgt3NP5OZKdoeYdQm0b48gThy4_ps48cr7Z1q3f22VF-MMEs6vCNSl85MUi6kpQUWesNPBqNbYoLZsuMhFjLgSKw1tKJxjPkNCtrk97jHolKIAVw7l8qYZzOBBlwcQN7AuJgjZBLF46Je7Ox8OVOJhEgnT9Q7NB7HxR4a4wtt83wap7BmltWLKnWT6yQOGr2MbG4koo31xOKxas_6dUtaZal8D4AlRdcwc6XyBzeYEc',
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
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDnHwzjhY-LuWAlVheEzemQzPX9EnMnAWushnYKJzvn2WWnrqcyJKItPLHhlqPtCDjdu7nkQY8Kn7YUo8M5BFFvSWRGdxu8LsaDQdU4qwE_QHEss-ahMM7_q-99AobBLP4gVXDzTfIlWLAXENwJI3xQhil8yDq6-OMDjL9KeVAE8uXl4arjlCyKd2A33IPHf7xnTENVLVIn3iK125otEddxUbulfaoljSVcwposhbyemTJHvwBINmw',
  },
  {
    id: 'm2',
    date: 'Nov 4, Week 3',
    score: 89,
    note: 'Much less visible flakiness around the mouth area in recent photos.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDjMGBvUi8ZYArR_3Tt5r52dKlth85TbRYX_F05vFdEhna7V-ddgWTtpSOJvSlONx3e93Ha6ID2tY0MdyWjEUN9KQ6DlguqOnXfY8KqvG-joD6rShvKqF6VieZndHfHKi2K1dlW9guKdK8KM2ZgMyjLzJ9KEPDZUx2YmMKZSyaCeVQV_BqM8imQnmgaLt4KEJb5S76w0GEezLlTEZnY4VmCbTttD-Oie1ps7mHqOvkQgwpkUUAtCy8',
  },
  {
    id: 'm3',
    date: 'Oct 28, Week 2',
    score: 81,
    note: 'Centella asiatica soothing mist introduced; tightness reduced post-cleanse.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAcmY1jFbODQQyhFt8w2mH_RmISPTTfdkTQOgnNgr1R41hZMLIH1EQerRVZHlBkKoIgoEkEDIdZqbGJQmdN8iNZdArmwIOCpguIztj94WGoUw7UliI_A5SG7a6UVFqRM053CJGUOjUzcyjFt4jBYJDfpPPTwuui6I7xe_I4fQvMvaZRmAw8ZjFVCxnZ7tUTW9ZNeo3yUrZunylwIovo9JdszZXJfL06vInHe5Bc8YJms8-351NMVOc',
  },
  {
    id: 'm4',
    date: 'Oct 21, Week 1',
    score: 74,
    note: 'Starting point — early photos showed more visible dryness and redness.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBjjZZj7vlEbJnRSRVpFM41y2y8fYVdUHs2cU1SIr8JYysRiPsh2yTmbWhOrLxBcmy0TfNUBfcMBKm5UobIMGcN2R-7wtqnuBG4uBBUT_Fec7zSqAXPOUmI2keQ5vla5ih-g0TlYZKHby9BSV1vhd7Kq5awoNBvPb2oAyIzZBAhrGJx70oZw_azjf39MrJOyeL5nJACrq7v4UtL99Hwms2SsXA1KOLOu6Pu8sbnMqB_MuZAIXGtU-Q',
  },
];
