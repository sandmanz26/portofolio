// Soft client-side gate for the inline content editor — NOT real
// authentication (the password ships inside the JS bundle). It only
// exists to keep casual visitors from opening /admin and poking at
// content, per the site having no backend/auth yet. Change this before
// sharing the /admin link with anyone.
export const ADMIN_PASSWORD = 'borobudur-admin-2026';

export const STORAGE_KEY = 'bnb_admin_overrides_v1';
export const SESSION_KEY = 'bnb_admin_unlocked_v1';
