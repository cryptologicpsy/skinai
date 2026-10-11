export default function TrendChart({ trend, gradientId }) {
  const finalColor = trend.finalColor ?? trend.color;
  return (
    <div className="w-full h-24 pt-2">
      <svg className="w-full h-full overflow-visible" fill="none" preserveAspectRatio="none" viewBox="0 0 300 80">
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={trend.color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={trend.color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${trend.path} L 300 80 L 0 80 Z`} fill={`url(#${gradientId})`} />
        <path d={trend.path} stroke={trend.color} strokeLinecap="round" strokeWidth="2.5" />
        {trend.points.map((p) =>
          p.final ? (
            <circle key={`${p.x}-${p.y}`} cx={p.x} cy={p.y} fill={finalColor} r="4.5" stroke="#fbf8ff" strokeWidth="2" />
          ) : (
            <circle key={`${p.x}-${p.y}`} cx={p.x} cy={p.y} fill="#fbf8ff" r="3.5" stroke={trend.color} strokeWidth="2" />
          )
        )}
      </svg>
    </div>
  );
}
