import { useRef } from 'react';
import { useContent } from './ContentContext';

export default function EditToolbar() {
  const { isEditMode, dirtyCount, exportJSON, importJSON, resetAll, lock } = useContent();
  const fileRef = useRef(null);

  if (!isEditMode) return null;

  function handleImportClick() {
    fileRef.current?.click();
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    importJSON(file)
      .then((count) => window.alert(`Berhasil impor ${count} perubahan.`))
      .catch(() => window.alert('Gagal membaca file — pastikan ini file JSON hasil Export dari halaman ini.'));
    e.target.value = '';
  }

  return (
    <div className="admin-toolbar">
      <span className="admin-toolbar__status">
        <span className="admin-toolbar__dot" aria-hidden="true" />
        Mode Edit Aktif · {dirtyCount} perubahan belum di-export
      </span>
      <div className="admin-toolbar__actions">
        <button type="button" className="admin-btn admin-btn--ghost" onClick={resetAll}>
          Reset semua
        </button>
        <button type="button" className="admin-btn admin-btn--ghost" onClick={handleImportClick}>
          Import JSON
        </button>
        <input ref={fileRef} type="file" accept="application/json" hidden onChange={handleFileChange} />
        <button type="button" className="admin-btn admin-btn--solid" onClick={exportJSON}>
          Export JSON
        </button>
        <button type="button" className="admin-btn admin-btn--ghost" onClick={lock}>
          Keluar
        </button>
      </div>
    </div>
  );
}
