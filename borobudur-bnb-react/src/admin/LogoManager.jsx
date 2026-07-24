import { useContent } from './ContentContext';

const LOGO_RULES = { label: 'Logo', minWidth: 80, minHeight: 80 };

// Single-slot logo image (site.logo.image) — replace with a URL/upload, or
// reset back to the bundled SVG mark passed as `fallback`.
export default function LogoManager({ fallback }) {
  const { overrides, isEditMode, openEditor, setOverride } = useContent();
  const logoUrl = overrides['site.logo.image'];

  if (!isEditMode) {
    return logoUrl ? <img src={logoUrl} alt="Logo" /> : fallback;
  }

  return (
    <div className="admin-editable-image admin-editable-image--logo">
      {logoUrl ? <img src={logoUrl} alt="Logo" /> : fallback}
      <div className="admin-editable-image__controls">
        <button
          type="button"
          className="admin-editable-image__btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openEditor({
              type: 'image',
              value: logoUrl || '',
              rules: LOGO_RULES,
              label: 'Logo',
              onSave: (url) => setOverride('site.logo.image', url),
            });
          }}
        >
          ✎ Ganti
        </button>
        {logoUrl && (
          <button
            type="button"
            className="admin-editable-image__btn admin-editable-image__btn--danger"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (window.confirm('Kembalikan ke logo bawaan?')) setOverride('site.logo.image', '');
            }}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
