import { useEffect, useRef, useState } from 'react';
import { useContent } from './ContentContext';
import { probeImage } from './imageRules';

export default function EditPanel() {
  const { activeEditor, closeEditor, setOverride, uploadImage } = useContent();
  const [draft, setDraft] = useState('');
  const [imgStatus, setImgStatus] = useState(null);
  const [checking, setChecking] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    if (activeEditor) {
      setDraft(activeEditor.value ?? '');
      setImgStatus(null);
      setSaveError('');
      if (activeEditor.type === 'image' && activeEditor.value) {
        checkImage(activeEditor.value, activeEditor.rules);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeEditor]);

  if (!activeEditor) return null;
  const { label, rules = {}, type, path, onSave: customOnSave } = activeEditor;

  function checkImage(url, imgRules) {
    if (!url) {
      setImgStatus(null);
      return;
    }
    setChecking(true);
    probeImage(url, imgRules).then((res) => {
      setChecking(false);
      setImgStatus(res);
    });
  }

  function checkImageFile(file, imgRules) {
    return new Promise((resolve) => {
      const objectUrl = URL.createObjectURL(file);
      probeImage(objectUrl, imgRules).then((res) => {
        URL.revokeObjectURL(objectUrl);
        resolve(res);
      });
    });
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setSaveError('');
    const result = await checkImageFile(file, rules);
    setImgStatus(result);
    if (!result.ok && !window.confirm(`Gambar ini belum memenuhi aturan ukuran:\n${result.message}\n\nTetap upload?`)) {
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setDraft(url);
      checkImage(url, rules);
    } catch (err) {
      setSaveError(err.message || 'Upload gagal.');
    } finally {
      setUploading(false);
    }
  }

  const overLimit = rules.maxLength && draft.length > rules.maxLength;

  async function handleSave() {
    if (type === 'image' && draft && imgStatus && !imgStatus.ok) {
      if (!window.confirm(`Gambar ini belum memenuhi aturan ukuran:\n${imgStatus.message}\n\nTetap simpan?`)) return;
    }
    if (overLimit) {
      if (!window.confirm(`Teks melebihi batas ${rules.maxLength} karakter. Tetap simpan?`)) return;
    }
    setSaving(true);
    setSaveError('');
    try {
      if (customOnSave) {
        await customOnSave(draft);
      } else {
        await setOverride(path, draft);
      }
      closeEditor();
    } catch (err) {
      setSaveError(err.message || 'Gagal menyimpan ke database.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-editpanel">
      <div className="admin-editpanel__scrim" onClick={closeEditor} />
      <div className="admin-editpanel__panel">
        <div className="admin-editpanel__head">
          <span>Edit {label}</span>
          <button type="button" onClick={closeEditor} aria-label="Tutup" className="admin-editpanel__x">
            ×
          </button>
        </div>
        <div className="admin-editpanel__body">
          {type === 'image' ? (
            <>
              <label className="admin-editpanel__fieldlabel">URL gambar</label>
              <input
                type="text"
                value={draft}
                placeholder="https://…jpg / .png / .webp"
                onChange={(e) => {
                  setDraft(e.target.value);
                  checkImage(e.target.value, rules);
                }}
              />
              <div style={{ margin: '10px 0' }}>
                <button
                  type="button"
                  className="admin-btn admin-btn--ghost"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? 'Mengunggah…' : 'atau upload file dari perangkat'}
                </button>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFileChange} />
              </div>
              {(rules.aspect || rules.minWidth) && (
                <p className="admin-editpanel__rule">
                  Aturan ukuran: {rules.aspect ? `rasio ${rules.aspect}` : ''}
                  {rules.aspect && rules.minWidth ? ', ' : ''}
                  {rules.minWidth ? `minimal ${rules.minWidth}×${rules.minHeight || '?'}px` : ''}
                </p>
              )}
              {checking && <p className="admin-editpanel__status">Mengecek gambar…</p>}
              {imgStatus && (
                <p className={`admin-editpanel__status ${imgStatus.ok ? 'is-ok' : 'is-warn'}`}>{imgStatus.message}</p>
              )}
              {draft && (
                <div className="admin-editpanel__preview">
                  <img
                    src={draft}
                    alt=""
                    onError={() => setImgStatus({ ok: false, message: 'Gambar gagal dimuat — cek URL-nya.' })}
                  />
                </div>
              )}
            </>
          ) : type === 'textarea' ? (
            <>
              <label className="admin-editpanel__fieldlabel">
                {label}
                {rules.perLine ? ' — satu baris = satu item' : ''}
              </label>
              <textarea rows={9} value={draft} onChange={(e) => setDraft(e.target.value)} />
            </>
          ) : (
            <>
              <label className="admin-editpanel__fieldlabel">{label}</label>
              <input type="text" value={draft} onChange={(e) => setDraft(e.target.value)} />
            </>
          )}

          {rules.maxLength && type !== 'image' && (
            <p className={`admin-editpanel__counter${overLimit ? ' is-over' : ''}`}>
              {draft.length} / {rules.maxLength} karakter
            </p>
          )}
          {rules.required && !draft && <p className="admin-editpanel__status is-warn">Field ini wajib diisi.</p>}
          {saveError && <p className="admin-editpanel__status is-warn">{saveError}</p>}
        </div>
        <div className="admin-editpanel__foot">
          <button type="button" className="admin-btn admin-btn--ghost" onClick={closeEditor} disabled={saving}>
            Batal
          </button>
          <div style={{ flex: 1 }} />
          <button type="button" className="admin-btn admin-btn--solid" onClick={handleSave} disabled={saving || uploading}>
            {saving ? 'Menyimpan…' : 'Simpan ke database'}
          </button>
        </div>
      </div>
    </div>
  );
}
