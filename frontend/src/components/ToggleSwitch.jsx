export default function ToggleSwitch({ enabled, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={() => onChange(!enabled)}
      className={`w-11 h-6 rounded-full relative p-0.5 transition-colors focus:outline-none ${
        enabled ? 'bg-secondary' : 'bg-surface-container-highest'
      }`}
    >
      <span
        className={`w-5 h-5 rounded-full bg-surface-container-lowest block transform transition-transform shadow-sm ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
