import { useContent } from './ContentContext';

// One existing photo in a multi-slot gallery (room/activity thumbs, the
// Home/Facility curated galleries): shows the image plus "Ganti" (replace)
// and "Hapus" (delete) controls in edit mode. `onImageClick` is used to
// open the lightbox — it only fires when the image itself is clicked, not
// the edit/delete buttons.
export default function ImageManagerItem({ image, alt, rules = {}, onReplace, onDelete, onImageClick, imgClassName }) {
  const { isEditMode, openEditor } = useContent();

  if (!isEditMode) {
    return <img src={image} alt={alt} loading="lazy" className={imgClassName} onClick={onImageClick} />;
  }

  return (
    <div className="admin-editable-image">
      <img src={image} alt={alt} loading="lazy" className={imgClassName} onClick={onImageClick} />
      <div className="admin-editable-image__controls">
        <button
          type="button"
          className="admin-editable-image__btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openEditor({
              type: 'image',
              value: image,
              rules: { label: rules.label || 'Foto', ...rules },
              label: rules.label || 'Foto',
              onSave: (url) => onReplace(url),
            });
          }}
        >
          ✎ Ganti
        </button>
        <button
          type="button"
          className="admin-editable-image__btn admin-editable-image__btn--danger"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (window.confirm('Hapus foto ini?')) onDelete();
          }}
        >
          🗑 Hapus
        </button>
      </div>
    </div>
  );
}
