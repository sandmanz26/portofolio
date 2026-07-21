import { useContent } from './ContentContext';

// Wraps an <img> with an "Edit image" button shown only in edit mode.
// `fallbackSrc` is the normal (non-overridden) resolved URL — usually
// img(photo.id, w) — and `path` is the flat override key for this slot.
export default function EditableImage({ path, fallbackSrc, alt, rules = {}, className, imgClassName, loading = 'lazy' }) {
  const { overrides, isEditMode, openEditor } = useContent();
  const src = overrides[path] || fallbackSrc;

  if (!isEditMode) {
    return <img src={src} alt={alt} loading={loading} className={imgClassName} />;
  }

  return (
    <div className={`admin-editable-image${className ? ' ' + className : ''}`}>
      <img src={src} alt={alt} loading={loading} className={imgClassName} />
      <button
        type="button"
        className="admin-editable-image__btn"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          openEditor({
            path,
            value: overrides[path] || '',
            fallback: fallbackSrc,
            rules: { label: rules.label || path, ...rules },
            type: 'image',
          });
        }}
      >
        ✎ Edit gambar
      </button>
    </div>
  );
}
