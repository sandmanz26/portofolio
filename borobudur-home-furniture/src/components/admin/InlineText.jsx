import { useEffect, useRef, useState } from "react";

/**
 * A text/number/textarea field that looks like plain text until
 * focused, and saves on blur (or Enter, for single-line inputs)
 * only if the value actually changed — the "inline edit" pattern
 * used throughout the admin panel.
 */
export default function InlineText({
  value,
  onSave,
  placeholder,
  type = "text",
  textarea = false,
  rows = 3,
  big = false,
}) {
  const [draft, setDraft] = useState(value ?? "");
  const [saved, setSaved] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setDraft(value ?? "");
  }, [value]);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  function commit() {
    if (String(draft) !== String(value ?? "")) {
      onSave(draft);
      setSaved(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setSaved(false), 1200);
    }
  }

  const className = "inline-field" + (big ? " inline-field--big" : "") + (saved ? " inline-field--saved" : "");

  if (textarea) {
    return (
      <textarea
        className={className}
        rows={rows}
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
      />
    );
  }

  return (
    <input
      className={className}
      type={type}
      value={draft}
      placeholder={placeholder}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
      }}
    />
  );
}
