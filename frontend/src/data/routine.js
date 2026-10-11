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
      '/images/img-f39ff53f7b.webp',
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
      '/images/img-80a5004398.webp',
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
      '/images/img-a121658d24.webp',
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
      '/images/img-1bbb9b6df0.webp',
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
      '/images/img-f39ff53f7b.webp',
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
      '/images/img-80a5004398.webp',
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
      '/images/img-a121658d24.webp',
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
      '/images/img-1bbb9b6df0.webp',
    completedAt: null,
  },
];
