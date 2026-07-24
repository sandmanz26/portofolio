import { useEffect, useState } from "react";

/**
 * Editor for an array of small objects (e.g. { title, desc } value
 * cards, { number, label } facts). Typing updates local state
 * immediately for a responsive feel; the array is only committed
 * (passed to onChange, which persists it) on blur or on a
 * structural change (add/remove/reorder) — the same "inline, no
 * Save button" pattern as InlineText, just at the array level.
 */
export default function ArrayFieldEditor({ items, onChange, itemFields, addLabel = "+ Add item", emptyItem = {} }) {
  const [draft, setDraft] = useState(items || []);

  useEffect(() => {
    setDraft(items || []);
  }, [items]);

  function updateField(index, key, value) {
    const next = draft.slice();
    next[index] = { ...next[index], [key]: value };
    setDraft(next);
  }

  function commit(next) {
    setDraft(next);
    onChange(next);
  }

  function blurCommit() {
    onChange(draft);
  }

  return (
    <div className="array-editor">
      {draft.map((item, i) => (
        <div className="array-editor__item" key={i}>
          <div className="array-editor__fields">
            {itemFields.map((f) =>
              f.textarea ? (
                <label key={f.key} className="array-editor__field">
                  {f.label}
                  <textarea
                    rows={2}
                    value={item[f.key] || ""}
                    onChange={(e) => updateField(i, f.key, e.target.value)}
                    onBlur={blurCommit}
                  />
                </label>
              ) : (
                <label key={f.key} className="array-editor__field">
                  {f.label}
                  <input
                    type="text"
                    value={item[f.key] || ""}
                    onChange={(e) => updateField(i, f.key, e.target.value)}
                    onBlur={blurCommit}
                  />
                </label>
              )
            )}
          </div>
          <div className="array-editor__actions">
            <button
              type="button"
              onClick={() => commit(swap(draft, i, i - 1))}
              disabled={i === 0}
              aria-label="Move earlier"
            >
              &larr;
            </button>
            <button
              type="button"
              onClick={() => commit(swap(draft, i, i + 1))}
              disabled={i === draft.length - 1}
              aria-label="Move later"
            >
              &rarr;
            </button>
            <button
              type="button"
              className="array-editor__remove"
              onClick={() => commit(draft.filter((_, idx) => idx !== i))}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <button type="button" className="btn" onClick={() => commit([...draft, { ...emptyItem }])}>
        {addLabel}
      </button>
    </div>
  );
}

function swap(list, i, j) {
  if (j < 0 || j >= list.length) return list;
  const next = list.slice();
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}
