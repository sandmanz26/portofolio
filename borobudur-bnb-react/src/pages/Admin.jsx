import { useState } from 'react';
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
  const { isEditMode, signIn, signOut, authError, exportJSON, refresh, supabaseConfigured, session, loading } = useContent();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    await signIn(email, password);
    setSubmitting(false);
  }

  if (!supabaseConfigured) {
    return (
      <section className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: 480 }}>
          <p className="label">
            <span className="label__no">( admin )</span> Content editor
          </p>
          <h1 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', marginTop: 16, marginBottom: 20 }}>Supabase belum terhubung</h1>
          <p className="lede">
            <code>VITE_SUPABASE_URL</code> dan <code>VITE_SUPABASE_ANON_KEY</code> belum diset (lihat{' '}
            <code>.env.example</code>). Tanpa itu, editor tidak bisa login atau menyimpan perubahan — situs berjalan
            dengan konten bawaan saja.
          </p>
        </div>
      </section>
    );
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
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email admin"
              autoFocus
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 8,
                border: '1px solid #d1d5db',
                marginBottom: 10,
                font: 'inherit',
              }}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 8,
                border: '1px solid #d1d5db',
                marginBottom: 12,
                font: 'inherit',
              }}
            />
            {authError && <p style={{ color: '#dc2626', marginBottom: 12, fontSize: 14 }}>{authError}</p>}
            <button type="submit" className="btn btn--solid" style={{ width: '100%' }} disabled={submitting}>
              {submitting ? 'Memproses…' : 'Masuk'}
            </button>
          </form>
          <p className="small-note" style={{ marginTop: 18 }}>
            Ini login Supabase Auth beneran — buat akunnya sekali dari Supabase Dashboard &gt; Authentication &gt;
            Users &gt; Add user (matikan "email confirmations" atau confirm manual supaya bisa langsung login).
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
        <p className="lede" style={{ marginBottom: 8 }}>
          Masuk sebagai <strong>{session?.user?.email}</strong>. Buka halaman manapun di situs ini — setiap judul,
          deskripsi, harga, dan gambar yang bisa diedit akan bergaris putus-putus biru. Klik untuk mengubahnya.
        </p>
        <p className="lede" style={{ marginBottom: 28 }}>
          Setiap klik <strong>Simpan</strong> langsung menulis ke database Supabase — tidak ada langkah export/import
          lagi, perubahan langsung permanen dan langsung tampil ke semua pengunjung.
        </p>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 32 }}>
          {QUICK_LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="tlink">
              Edit {l.label} <span aria-hidden>→</span>
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
          <button type="button" className="btn" onClick={refresh} disabled={loading}>
            {loading ? 'Memuat…' : 'Refresh data'}
          </button>
          <button type="button" className="btn" onClick={exportJSON}>
            Download backup JSON
          </button>
          <button type="button" className="btn" onClick={signOut}>
            Keluar
          </button>
        </div>

        <p className="small-note">
          Field yang belum didukung editor ini (salinan narasi halaman, FAQ, tabel kebijakan, galeri foto kuratorial)
          masih perlu diedit langsung lewat Supabase Table Editor atau kode.
        </p>
      </div>
    </section>
  );
}
