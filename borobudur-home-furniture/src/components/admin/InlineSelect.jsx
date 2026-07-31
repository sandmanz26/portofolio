export default function InlineSelect({ value, options, onChange }) {
  return (
    <select
      className="inline-field inline-field--select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
