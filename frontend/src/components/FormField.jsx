export default function FormField({ label, error, children, id }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-label-lg text-label-lg text-on-surface">
        {label}
      </label>
      {children}
      {error && (
        <span role="alert" className="font-label-sm text-label-sm text-error px-1">
          {error}
        </span>
      )}
    </div>
  );
}
