/**
 * Editor for an array of small objects (e.g. { title, desc } value
 * cards, { number, label } facts). Fully controlled — every change
 * (typing, reorder, add, remove) calls onChange immediately with
 * the next array. The parent page holds this as part of its draft
 * and decides when to persist it via its own Save/Cancel bar.
 */
export default function ArrayFieldEditor({ items, onChange, itemFields, addLabel = "+ Add item", emptyItem = {} }) {
  function updateField(index, key, value) {
    const next = items.slice();
    next[index] = { ...next[index], [key]: value };
    onChange(next);
  }

  function swap(i, j) {
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="array-editor">
      {items.map((item, i) => (
        <div className="array-editor__item" key={i}>
          <div className="array-editor__fields">
            {itemFields.map((f) =>
              f.textarea ? (
                <label key={f.key} className="array-editor__field">
                  {f.label}
                  <textarea rows={2} value={item[f.key] || ""} onChange={(e) => updateField(i, f.key, e.target.value)} />
                </label>
              ) : (
                <label key={f.key} className="array-editor__field">
                  {f.label}
                  <input type="text" value={item[f.key] || ""} onChange={(e) => updateField(i, f.key, e.target.value)} />
                </label>
              )
            )}
          </div>
          <div className="array-editor__actions">
            <button type="button" onClick={() => swap(i, i - 1)} disabled={i === 0} aria-label="Move earlier">
              &larr;
            </button>
            <button type="button" onClick={() => swap(i, i + 1)} disabled={i === items.length - 1} aria-label="Move later">
              &rarr;
            </button>
            <button
              type="button"
              className="array-editor__remove"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <button type="button" className="btn" onClick={() => onChange([...items, { ...emptyItem }])}>
        {addLabel}
      </button>
    </div>
  );
}
