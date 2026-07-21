import { createContext, useContext, useEffect, useState } from 'react';
import { ADMIN_PASSWORD, STORAGE_KEY, SESSION_KEY } from './config';

const ContentContext = createContext(null);

function loadOverrides() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function loadUnlocked() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

// Overrides are a flat { "rooms.joglo.name": "New name" } map — every
// editable field on the site resolves as `overrides[path] ?? fallback`.
// Kept flat and path-keyed (rather than mirroring the nested data shape)
// so any component can read/write a field without plumbing structural
// changes through src/data/*.js.
export function ContentProvider({ children }) {
  const [overrides, setOverrides] = useState(loadOverrides);
  const [isEditMode, setIsEditMode] = useState(loadUnlocked);
  const [activeEditor, setActiveEditor] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    } catch {
      // storage full/unavailable — draft simply won't survive a reload
    }
  }, [overrides]);

  useEffect(() => {
    // Site's own mobile CTA bar also pins to bottom:0 — hide it while
    // editing so it doesn't stack under the admin toolbar.
    document.body.classList.toggle('admin-edit-mode', isEditMode);
  }, [isEditMode]);

  function setOverride(path, value) {
    setOverrides((prev) => {
      const next = { ...prev };
      if (value === '' || value === null || value === undefined) {
        delete next[path];
      } else {
        next[path] = value;
      }
      return next;
    });
  }

  function resetPath(path) {
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[path];
      return next;
    });
  }

  function resetAll() {
    if (window.confirm('Hapus semua perubahan yang belum di-export? Tindakan ini tidak bisa dibatalkan.')) {
      setOverrides({});
    }
  }

  function unlock(password) {
    if (password === ADMIN_PASSWORD) {
      setIsEditMode(true);
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        /* ignore */
      }
      return true;
    }
    return false;
  }

  function lock() {
    setIsEditMode(false);
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  }

  function openEditor(descriptor) {
    setActiveEditor(descriptor);
  }

  function closeEditor() {
    setActiveEditor(null);
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(overrides, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `borobudur-bnb-content-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function importJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result);
          setOverrides((prev) => ({ ...prev, ...parsed }));
          resolve(Object.keys(parsed).length);
        } catch (e) {
          reject(e);
        }
      };
      reader.onerror = () => reject(new Error('Gagal membaca file'));
      reader.readAsText(file);
    });
  }

  const value = {
    overrides,
    setOverride,
    resetPath,
    resetAll,
    isEditMode,
    unlock,
    lock,
    activeEditor,
    openEditor,
    closeEditor,
    exportJSON,
    importJSON,
    dirtyCount: Object.keys(overrides).length,
  };

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within a ContentProvider');
  return ctx;
}
