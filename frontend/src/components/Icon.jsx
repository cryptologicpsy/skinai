export default function Icon({ name, className = '', filled = false, style, ...rest }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontVariationSettings: filled ? "'FILL' 1" : undefined, ...style }}
      aria-hidden="true"
      {...rest}
    >
      {name}
    </span>
  );
}
