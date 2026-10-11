// Structured-output schema for /api/skin-analysis. Shape mirrors
// MOCK_ANALYSIS_RESULT in the frontend's src/data/analysis.js so the React
// UI needs no changes to consume a real response.
//
// Face-zone x/y overlay positions are NOT requested from the model — asking
// an LLM for pixel-accurate facial-landmark coordinates on an arbitrary
// photo is unreliable. We keep fixed, reasonable default positions here and
// only ask the model for the qualitative score/detail text per zone.
//
// Note: Claude's structured-outputs JSON Schema support does not include
// numerical (minimum/maximum) or array-length (minItems/maxItems) keywords —
// those constraints are expressed in the field descriptions instead.

export const ZONE_POSITIONS = [
  { id: 'tzone', label: 'T-Zone', x: 18, y: 10, color: 'bg-secondary' },
  { id: 'malar', label: 'Malar', x: 24, y: 48, color: 'bg-primary' },
  { id: 'perioral', label: 'Perioral', x: 50, y: 70, color: 'bg-secondary' },
];

export const SKIN_ANALYSIS_JSON_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['overallScore', 'headline', 'summaryTags', 'zones', 'metrics', 'recommendedActives', 'warning'],
  properties: {
    overallScore: { type: 'integer', description: 'Subjective visual impression score, 0-100' },
    headline: { type: 'string', description: 'Short 2-4 word upbeat summary, e.g. "Radiance & Balanced"' },
    summaryTags: {
      type: 'array',
      items: { type: 'string' },
      description: 'Exactly 3 short plain-language observations, e.g. "Looks Well-Hydrated"',
    },
    zones: {
      type: 'array',
      description: 'Exactly 3 items, in this order: T-Zone, Malar (cheeks), Perioral (mouth area)',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['score', 'detail'],
        properties: {
          score: { type: 'string', description: 'A percentage string like "88%", 0-100' },
          detail: { type: 'string', description: 'One sentence, plain language, "looks/appears" phrasing' },
        },
      },
    },
    metrics: {
      type: 'object',
      additionalProperties: false,
      required: ['hydration', 'barrier', 'redness', 'smoothness'],
      properties: {
        hydration: {
          type: 'object', additionalProperties: false, required: ['value', 'delta', 'note'],
          properties: {
            value: { type: 'integer', description: '0-100' },
            delta: { type: 'string', description: 'e.g. "Looks similar to last scan" (no fabricated % unless comparing actual prior data)' },
            note: { type: 'string' },
          },
        },
        barrier: {
          type: 'object', additionalProperties: false, required: ['value', 'status', 'note'],
          properties: {
            value: { type: 'integer', description: '0-100' },
            status: { type: 'string', description: 'e.g. "Looking Good", "Could Use Care"' },
            note: { type: 'string' },
          },
        },
        redness: {
          type: 'object', additionalProperties: false, required: ['value', 'status', 'note'],
          properties: {
            value: { type: 'integer', description: '0-100' },
            status: { type: 'string', description: 'e.g. "Calm", "Slightly Flushed"' },
            note: { type: 'string' },
          },
        },
        smoothness: {
          type: 'object', additionalProperties: false, required: ['value', 'status', 'note'],
          properties: {
            value: { type: 'integer', description: '0-100' },
            status: { type: 'string', description: 'e.g. "Smooth", "Some Texture"' },
            note: { type: 'string' },
          },
        },
      },
    },
    recommendedActives: {
      type: 'array',
      description: 'Exactly 3 common cosmetic ingredients',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'note', 'badge', 'icon'],
        properties: {
          name: { type: 'string', description: 'Common cosmetic ingredient name' },
          note: { type: 'string', description: 'One short plain-language benefit, no therapeutic claims' },
          badge: { type: 'string', description: 'e.g. "Daily", "PM", "Priority"' },
          icon: { type: 'string', enum: ['psychiatry', 'biotech', 'opacity', 'water_drop', 'spa', 'science'] },
        },
      },
    },
    warning: {
      type: 'object',
      additionalProperties: false,
      required: ['title', 'detail'],
      properties: {
        title: { type: 'string', description: 'Short gentle caution, or "All Clear" if nothing to flag' },
        detail: { type: 'string', description: 'Plain-language caution with a suggestion to consult a dermatologist if relevant; no diagnostic language' },
      },
    },
  },
};
