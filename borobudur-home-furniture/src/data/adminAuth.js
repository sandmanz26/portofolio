/**
 * TEMPORARY passphrase gate for /admin, used only until Supabase
 * Auth is wired in. This is not real security — anyone who reads
 * the deployed JS bundle can find this string. It exists only to
 * keep the admin panel from being wide open to casual visitors
 * before proper authentication exists. Replace this whole module
 * (and AdminLayout's gate) with a Supabase Auth check before
 * putting real customer/business data behind it.
 */
export const ADMIN_PASSPHRASE = "bhf-admin-2026";
