export const PLANS = [
  {
    id: 'free',
    name: 'Free Tier',
    price: '€0',
    period: '',
    note: '1 selfie scan/week • Basic diary',
    badge: 'Active',
  },
  {
    id: 'basic',
    name: 'Basic Plan',
    price: '€9.99',
    period: '/month',
    note: 'Unlimited routine scans • Standard AI chat',
  },
  {
    id: 'pro',
    name: 'Premium Pro',
    price: '€14.99',
    period: '/mo',
    note: 'Deeper AI Analysis + 1-on-1 Chemist',
    billedNote: 'Billed €179.88/yr',
    highlight: 'Best Value • Save 25%',
  },
];

export const PRO_FEATURES = [
  {
    icon: 'sensors',
    title: 'Multi-Angle Skin Mapping',
    note: 'Combine several selfie angles for a fuller picture',
  },
  {
    icon: 'barcode_scanner',
    title: 'Safety Barcode Scanner',
    note: 'EWG score breakdown & comedogenic rating instant lookup',
  },
  {
    icon: 'forum',
    title: 'Unlimited AI Chat Advisor + Chemist Review',
    note: '1-on-1 human cosmetic chemist formulation validation',
  },
];

export const PRIMARY_CONCERNS = [
  { name: 'Redness reduction', active: true },
  { name: 'Barrier repair', active: true },
  { name: 'Hydration retention', active: true },
  { name: 'Collagen density', active: false },
  { name: 'Sebum balance', active: false },
];

export const EXCLUSIONS = [
  { icon: 'eco', label: 'Fragrance-free' },
  { icon: 'spa', label: 'Essential oil-free' },
  { icon: 'cruelty_free', label: 'Vegan only' },
];
