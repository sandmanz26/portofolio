import { useContent } from './ContentContext';

// A small trigger button for editing fields that aren't plain inline
// text — list-shaped blocks (paragraphs, highlights, spec rows edited as
// one text block, one item per line) or a single field like a social
// link where the value doubles as an href and can't be wrapped in
// clickable display text.
export default function EditListButton({ path, value, label, rules = {}, type = 'textarea' }) {
  const { isEditMode, openEditor } = useContent();
  if (!isEditMode) return null;
  return (
    <button
      type="button"
      className="admin-editlist-btn"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openEditor({
          path,
          value,
          rules: { label: rules.label || label, perLine: type === 'textarea', ...rules },
          type,
        });
      }}
    >
      ✎ Edit {label}
    </button>
  );
}
