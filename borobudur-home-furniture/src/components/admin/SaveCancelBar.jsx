import { useState } from "react";

/**
 * Explicit Save/Cancel controls for a dirty draft, used consistently
 * across the product list (per row), the product editor (whole
 * form), and the content editor (per section) — nothing in the
 * admin panel writes to the backend until one of these is clicked.
 *
 * `onSave` must resolve to `true` on success or `false` on failure
 * (catching its own errors and surfacing them however the page
 * already does, e.g. an admin-banner) — this bar only reacts to the
 * outcome, it doesn't display errors itself.
 */
export default function SaveCancelBar({ dirty, onSave, onCancel, compact = false }) {
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  if (!dirty && !justSaved) return null;

  async function handleSave() {
    setSaving(true);
    const ok = await onSave();
    setSaving(false);
    if (ok) {
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1500);
    }
  }

  return (
    <div className={"save-bar" + (compact ? " save-bar--compact" : "")}>
      {dirty ? (
        <>
          <span className="save-bar__label">Unsaved changes</span>
          <button type="button" className="btn btn--solid" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
          <button type="button" className="btn" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
        </>
      ) : (
        <span className="save-bar__saved">Saved &#10003;</span>
      )}
    </div>
  );
}
