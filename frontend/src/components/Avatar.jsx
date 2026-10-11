const PALETTE = [
  'bg-primary-container text-on-primary-container',
  'bg-secondary-container text-on-secondary-container',
  'bg-tertiary-container text-on-tertiary-container',
  'bg-primary-fixed text-on-primary-fixed-variant',
  'bg-secondary-fixed text-on-secondary-fixed',
];

function getInitials(name) {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

function colorFor(name) {
  const key = name ?? '';
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

// Generated initials avatar for the real signed-in user — there is no real
// profile photo in this app, so we never show a stock/demo photo as if it
// belonged to whoever is actually logged in.
export default function Avatar({ name, size = 'w-10 h-10', textClass = 'font-label-lg text-label-lg' }) {
  return (
    <div
      className={`${size} rounded-full flex items-center justify-center font-bold shrink-0 ${textClass} ${colorFor(name)}`}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  );
}
