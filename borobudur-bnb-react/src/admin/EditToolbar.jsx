import { useState } from 'react';
import { useContent } from './ContentContext';

export default function EditToolbar() {
  const { isEditMode, session, loading, exportJSON, refresh, signOut } = useContent();
  const [refreshing, setRefreshing] = useState(false);

  if (!isEditMode) return null;

  async function handleRefresh() {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }

  return (
    <div className="admin-toolbar">
      <span className="admin-toolbar__status">
        <span className="admin-toolbar__dot" aria-hidden="true" />
        Mode Edit Aktif · {session?.user?.email} {loading ? '· memuat…' : ''}
      </span>
      <div className="admin-toolbar__actions">
        <button type="button" className="admin-btn admin-btn--ghost" onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? 'Memuat…' : 'Refresh data'}
        </button>
        <button type="button" className="admin-btn admin-btn--ghost" onClick={exportJSON}>
          Download backup
        </button>
        <button type="button" className="admin-btn admin-btn--ghost" onClick={signOut}>
          Keluar
        </button>
      </div>
    </div>
  );
}
