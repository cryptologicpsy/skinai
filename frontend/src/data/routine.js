// Mock routine data. In a real integration this would come from a backend
// that stores the user's AI-generated routine (see services/skinAnalysisService.js).

export const AM_ROUTINE = [
  {
    id: 'am-1',
    order: 1,
    category: 'Cleanse',
    tag: 'pH 5.5 Balanced',
    title: 'Gentle Oat Cleansing Milk',
    description:
      'Dissolves overnight sebum & impurities gently without stripping the vital acid mantle or lipid barrier.',
    meta: { icon: 'verified', label: 'Colloidal Oat • Prebiotics' },
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCJxEip4oPw706U23MQV9RDY1iCKVbBLT4xxUqmAGx9gnupJ9egK8wt6ddaeh-wdEnHa8VVsP4TEZ_FqTKZNHJRuNibklOHmRfT3KwgqnBa1BePtLpepWJdpub-TwHVORzHFgtx7P7tc_H2uwN7bi6_p99lkClp4GUiHYMOvIyHuEFhPMLY5H9fec-0nSiaWYiGszXbg8aWYTCM43YGRcV69waL9zbP1uZ8ZZYyhV4MfJ4BLULERP4',
    completedAt: null,
  },
  {
    id: 'am-2',
    order: 2,
    category: 'Treat',
    tag: '2% HA + Niacinamide',
    title: 'Multi-Molecular Hyaluronic & Polyglutamic Serum',
    description:
      'Draws in deep hydration while helping to visibly calm redness across the cheeks.',
    meta: { icon: 'water_drop', label: 'Deep Hydro-Plump' },
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB5oqpCHFZE5js3NqnbtblBNRTuFh-dh7DH1zG-i_8KhQASBIKvQlm8alf5iWqhVyO2cX9oFAijUzeqzB4nbPikppqZdBg5K9icvXBXwmh5-ksvc18wUzFiWPbR2VBXen0nVjjRFiqtPNaDOPOSukQM4Q0D-tpOelQb6lrXMuhA-5tOxQVgu5zfrflIcb0pWi6f-SZTz-VRBl64TOCzZB5kzvD5pZf0X0XgpxHvo05fTrnnyLY7pyw',
    completedAt: null,
  },
  {
    id: 'am-3',
    order: 3,
    category: 'Moisturize',
    tag: 'Ceramides NP/AP/EOP',
    title: 'Ceramide & Centella Soothing Barrier Cream',
    description:
      'Locks in active serum nutrients, synthesizes skin ceramides, and reinforces an impenetrable lipid moisture shield.',
    meta: { icon: 'shield', label: 'Barrier Defense' },
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBfO_jERVX5PKXC3fAwOwigf2IAyCMqIqUvpguQwWEciVof5TcWJJTvskNaUIaxbGLHytwAJ9YIDCQvbAv_X_40_x_LPYkVlYd4myLYl-zVuunVKb8hG88mJjkdN2bDM0ERNR0VpYwKlc0ngE2QjZeaREADN2J0sJo3DnRLkM_Tx1VZ_h8Lm9lh4GazfQiuuAwGipHmNEW2thb-Ssj0JLpBcnXIVDgWvmvlM-ORSOQ5YBH8Zu0ncvM',
    completedAt: null,
  },
  {
    id: 'am-4',
    order: 4,
    category: 'Protect',
    tag: 'SPF 50+ PA++++',
    title: 'Invisible Fluid Mineral Sunscreen',
    description:
      '100% non-nano zinc oxide shields UVA, UVB, and HEV blue light wavelengths to protect fresh cellular turnover from photo-damage.',
    meta: { icon: 'wb_sunny', label: 'Zinc Oxide + Vit E' },
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBVTRfRkixvEgz5z37l4lIxYf-fdyw_h65pvlpNyde23mbqznhCbo_BpTWVnz1hS69pzU83D9jy0RSc3CDbgA0HVnc4u67CtWr0KhxsvsODHfS9X5WBjYAB2BkMLD3V3PBnjwweuzIG26rU5MUtJTJ_YaFKIA28-aK6aPw_SNscLp-q-wPUdFCe9opstf2qeCeateOZWyCD1cCwlibVpsC-uv4KiRb9wvVUSPt6yGRKgWp3nMb-Xwg',
    completedAt: null,
  },
];

export const PM_ROUTINE = [
  {
    id: 'pm-1',
    order: 1,
    category: 'Double Cleanse',
    tag: 'Oil → Milk',
    title: 'Botanical Oil Makeup Dissolver',
    description:
      'Breaks down SPF, sebum and airborne pollutants before the water-based cleanse, preventing barrier-stripping over-scrubbing.',
    meta: { icon: 'water_drop', label: 'Squalane + Jojoba' },
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCJxEip4oPw706U23MQV9RDY1iCKVbBLT4xxUqmAGx9gnupJ9egK8wt6ddaeh-wdEnHa8VVsP4TEZ_FqTKZNHJRuNibklOHmRfT3KwgqnBa1BePtLpepWJdpub-TwHVORzHFgtx7P7tc_H2uwN7bi6_p99lkClp4GUiHYMOvIyHuEFhPMLY5H9fec-0nSiaWYiGszXbg8aWYTCM43YGRcV69waL9zbP1uZ8ZZYyhV4MfJ4BLULERP4',
    completedAt: null,
  },
  {
    id: 'pm-2',
    order: 2,
    category: 'Treat',
    tag: 'Encapsulated Retinol 0.3%',
    title: 'Slow-Release Overnight Renewal Serum',
    description:
      'Time-released retinal complex supports cellular turnover while buffered with soothing botanicals to minimize nighttime irritation.',
    meta: { icon: 'bedtime', label: 'Buffered Retinal' },
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB5oqpCHFZE5js3NqnbtblBNRTuFh-dh7DH1zG-i_8KhQASBIKvQlm8alf5iWqhVyO2cX9oFAijUzeqzB4nbPikppqZdBg5K9icvXBXwmh5-ksvc18wUzFiWPbR2VBXen0nVjjRFiqtPNaDOPOSukQM4Q0D-tpOelQb6lrXMuhA-5tOxQVgu5zfrflIcb0pWi6f-SZTz-VRBl64TOCzZB5kzvD5pZf0X0XgpxHvo05fTrnnyLY7pyw',
    completedAt: null,
  },
  {
    id: 'pm-3',
    order: 3,
    category: 'Moisturize',
    tag: 'Ceramides NP/AP/EOP',
    title: 'Ceramide & Centella Soothing Barrier Cream',
    description:
      'Seals in overnight actives and reinforces the lipid matrix while cellular repair processes peak during sleep.',
    meta: { icon: 'shield', label: 'Barrier Defense' },
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBfO_jERVX5PKXC3fAwOwigf2IAyCMqIqUvpguQwWEciVof5TcWJJTvskNaUIaxbGLHytwAJ9YIDCQvbAv_X_40_x_LPYkVlYd4myLYl-zVuunVKb8hG88mJjkdN2bDM0ERNR0VpYwKlc0ngE2QjZeaREADN2J0sJo3DnRLkM_Tx1VZ_h8Lm9lh4GazfQiuuAwGipHmNEW2thb-Ssj0JLpBcnXIVDgWvmvlM-ORSOQ5YBH8Zu0ncvM',
    completedAt: null,
  },
  {
    id: 'pm-4',
    order: 4,
    category: 'Seal',
    tag: 'Occlusive Balm',
    title: 'Overnight Recovery Sleep Mask',
    description:
      'A final occlusive layer over dry patches locks in every prior step for maximum overnight transepidermal water retention.',
    meta: { icon: 'nightlight', label: 'Shea + Ceramide NP' },
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBVTRfRkixvEgz5z37l4lIxYf-fdyw_h65pvlpNyde23mbqznhCbo_BpTWVnz1hS69pzU83D9jy0RSc3CDbgA0HVnc4u67CtWr0KhxsvsODHfS9X5WBjYAB2BkMLD3V3PBnjwweuzIG26rU5MUtJTJ_YaFKIA28-aK6aPw_SNscLp-q-wPUdFCe9opstf2qeCeateOZWyCD1cCwlibVpsC-uv4KiRb9wvVUSPt6yGRKgWp3nMb-Xwg',
    completedAt: null,
  },
];
