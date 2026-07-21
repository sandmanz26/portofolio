import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../admin/ContentContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const QUICK_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/facility', label: 'Facility' },
  { to: '/room', label: 'Room' },
  { to: '/activity', label: 'Activity' },
  { to: '/contact', label: 'Contact' },
];

export default function Admin() {
  useDocumentTitle('Admin — Borobudur BnB');
  const { isEditMode, unlock, lock, dirtyCount, exportJSON, importJSON, resetAll } = useContent();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (unlock(password)) {
      setError('');
      setPassword('');
    } else {
      setError('Password salah.');
    }
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    importJSON(file)
      .then((count) => window.alert(`Berhasil impor ${count} perubahan.`))
      .catch(() => window.alert('Gagal membaca file — pastikan ini file JSON hasil Export dari halaman ini.'));
    e.target.value = '';
  }

  if (!isEditMode) {
    return (
      <section className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: 420 }}>
          <p className="label">
            <span className="label__no">( admin )</span> Content editor
          </p>
          <h1 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', marginTop: 16, marginBottom: 20 }}>Masuk untuk mengedit</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password admin"
              autoFocus
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 8,
                border: '1px solid #d1d5db',
                marginBottom: 12,
                font: 'inherit',
              }}
            />
            {error && <p style={{ color: '#dc2626', marginBottom: 12, fontSize: 14 }}>{error}</p>}
            <button type="submit" className="btn btn--solid" style={{ width: '100%' }}>
              Masuk
            </button>
          </form>
          <p className="small-note" style={{ marginTop: 18 }}>
            Password ini hanya proteksi ringan di sisi browser (bukan autentikasi backend sungguhan) — cukup untuk
            mencegah pengunjung biasa iseng mengedit. Ganti nilainya di{' '}
            <code>src/admin/config.js</code> sebelum membagikan link ini.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section" style={{ minHeight: '60vh' }}>
      <div className="container" style={{ maxWidth: 640 }}>
        <p className="label">
          <span className="label__no">( admin )</span> Content editor
        </p>
        <h1 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', marginTop: 16, marginBottom: 12 }}>Mode edit aktif</h1>
        <p className="lede" style={{ marginBottom: 28 }}>
          Buka halaman manapun di situs ini — setiap judul, deskripsi, harga, dan gambar yang bisa diedit akan
          bergaris putus-putus biru. Klik untuk mengubahnya. Perubahan tersimpan otomatis di browser ini
          ({dirtyCount} perubahan belum di-export), tapi untuk membuatnya permanen kamu perlu <strong>Export JSON</strong>{' '}
          lalu meneruskannya ke developer untuk dimasukkan ke build berikutnya.
        </p>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 32 }}>
          {QUICK_LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="tlink">
              Edit {l.label} <span aria-hidden>→</span>
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
          <button type="button" className="btn btn--solid" onClick={exportJSON}>
            Export JSON ({dirtyCount})
          </button>
          <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
            Import JSON
          </button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={handleFileChange} />
          <button type="button" className="btn" onClick={resetAll}>
            Reset semua
          </button>
          <button type="button" className="btn" onClick={lock}>
            Keluar dari mode edit
          </button>
        </div>

        <p className="small-note">
          Field yang belum didukung editor ini (salinan narasi halaman, FAQ, tabel kebijakan) masih perlu diedit
          langsung di kode untuk saat ini.
        </p>
      </div>
    </section>
  );
}
