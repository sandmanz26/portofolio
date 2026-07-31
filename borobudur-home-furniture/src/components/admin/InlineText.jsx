/**
 * A text/number/textarea input styled to match the admin's inline
 * fields. Fully controlled (value + onChange fire on every
 * keystroke) — the parent page holds the draft and decides when to
 * persist it via its own Save/Cancel bar. This component has no
 * saving logic of its own.
 */
export default function InlineText({
  value,
  onChange,
  placeholder,
  type = "text",
  textarea = false,
  rows = 3,
  big = false,
}) {
  const className = "inline-field" + (big ? " inline-field--big" : "");

  if (textarea) {
    return (
      <textarea
        className={className}
        rows={rows}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  return (
    <input
      className={className}
      type={type}
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
