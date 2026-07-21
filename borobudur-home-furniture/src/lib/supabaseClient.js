import { createClient } from "@supabase/supabase-js";

/**
 * Reads VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY from the environment
 * (a .env file locally, or the host's env var settings when deployed —
 * see README's "Moving to Supabase" section). When they are not set,
 * `supabase` is null and `isSupabaseConfigured` is false, and the rest
 * of the app falls back to its no-backend (localStorage / passphrase)
 * behaviour instead of crashing.
 */
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null;
