import { useEffect, useState } from "react";

/** Same commit-on-blur pattern as ArrayFieldEditor, for a flat list of strings. */
export default function StringListEditor({ items, onChange, addLabel = "+ Add line", itemPlaceholder }) {
  const [draft, setDraft] = useState(items || []);

  useEffect(() => {
    setDraft(items || []);
  }, [items]);

  function updateAt(i, value) {
    const next = draft.slice();
    next[i] = value;
    setDraft(next);
  }

  function commit(next) {
    setDraft(next);
    onChange(next);
  }

  return (
    <div className="string-list-editor">
      {draft.map((value, i) => (
        <div className="string-list-editor__row" key={i}>
          <input
            type="text"
            value={value}
            placeholder={itemPlaceholder}
            onChange={(e) => updateAt(i, e.target.value)}
            onBlur={() => onChange(draft)}
          />
          <button type="button" onClick={() => commit(draft.filter((_, idx) => idx !== i))}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="btn" onClick={() => commit([...draft, ""])}>
        {addLabel}
      </button>
    </div>
  );
}
