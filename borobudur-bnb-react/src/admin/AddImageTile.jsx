import { useContent } from './ContentContext';

// A dashed-border "+" tile at the end of a multi-slot gallery that opens
// the edit panel in create mode — saving calls onAdd(url) to insert a new
// row instead of replacing an existing one. Renders nothing outside edit
// mode or once maxItems is reached.
export default function AddImageTile({ onAdd, rules = {}, className, label = 'Tambah foto', currentCount, maxItems }) {
  const { isEditMode, openEditor } = useContent();
  if (!isEditMode) return null;
  if (maxItems && currentCount >= maxItems) return null;

  return (
    <button
      type="button"
      className={`admin-add-image-tile${className ? ' ' + className : ''}`}
      onClick={() =>
        openEditor({
          type: 'image',
          value: '',
          rules: { label, ...rules },
          label,
          onSave: (url) => onAdd(url),
        })
      }
    >
      + {label}
    </button>
  );
}
