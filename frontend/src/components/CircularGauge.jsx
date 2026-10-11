const ARC = 'M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831';

export default function CircularGauge({
  percent,
  size = 'w-16 h-16',
  strokeWidth = 3.5,
  trackClassName = 'text-surface-container-high',
  progressClassName = 'text-secondary',
  children,
}) {
  return (
    <div className={`relative ${size} flex items-center justify-center shrink-0`}>
      <svg className={`${size} -rotate-90`} viewBox="0 0 36 36">
        <path className={trackClassName} d={ARC} fill="none" stroke="currentColor" strokeWidth={strokeWidth} />
        <path
          className={`${progressClassName} transition-all duration-500`}
          d={ARC}
          fill="none"
          stroke="currentColor"
          strokeDasharray={`${percent}, 100`}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}
