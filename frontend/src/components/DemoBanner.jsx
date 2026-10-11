import Icon from './Icon.jsx';

// Explicit, always-visible demo disclosure. Required reading before this
// prototype goes anywhere near real (non-developer) users.
export default function DemoBanner() {
  return (
    <div className="w-full bg-tertiary-fixed text-on-tertiary-fixed-variant px-margin py-1 flex items-center gap-1.5">
      <Icon name="science" className="text-[13px] shrink-0" />
      <span className="font-label-sm text-[10px] leading-tight">
        DEMO — test build, not a real medical product. Photos are analyzed by AI and only stored if you say yes, auto-deleted after {import.meta.env.VITE_PHOTO_RETENTION_DAYS || 7} days.
      </span>
    </div>
  );
}
