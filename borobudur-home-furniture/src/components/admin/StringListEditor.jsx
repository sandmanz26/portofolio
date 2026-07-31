/** Same fully-controlled pattern as ArrayFieldEditor, for a flat list of strings. */
export default function StringListEditor({ items, onChange, addLabel = "+ Add line", itemPlaceholder }) {
  function updateAt(i, value) {
    const next = items.slice();
    next[i] = value;
    onChange(next);
  }

  return (
    <div className="string-list-editor">
      {items.map((value, i) => (
        <div className="string-list-editor__row" key={i}>
          <input
            type="text"
            value={value}
            placeholder={itemPlaceholder}
            onChange={(e) => updateAt(i, e.target.value)}
          />
          <button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="btn" onClick={() => onChange([...items, ""])}>
        {addLabel}
      </button>
    </div>
  );
}
