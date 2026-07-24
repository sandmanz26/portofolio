import { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { ADMIN_PASSPHRASE } from "../../data/adminAuth.js";
import { supabase, isSupabaseConfigured } from "../../lib/supabaseClient.js";
import "../../styles/admin.css";

const SESSION_KEY = "bhf_admin_unlocked";

function AdminShell({ onLogout }) {
  return (
    <div className="admin">
      <header className="admin-topbar">
        <Link to="/admin" className="admin-topbar__brand">BHF Admin</Link>
        <nav className="admin-topbar__section-nav">
          <NavLink to="/admin" end className={({ isActive }) => (isActive ? "is-active" : undefined)}>
            Products
          </NavLink>
          <NavLink to="/admin/content" className={({ isActive }) => (isActive ? "is-active" : undefined)}>
            Site Content
          </NavLink>
        </nav>
        <nav className="admin-topbar__nav">
          <Link to="/" target="_blank" rel="noopener noreferrer">View site &#8599;</Link>
          <button type="button" onClick={onLogout}>Log out</button>
        </nav>
      </header>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

/**
 * TEMPORARY gate used only when Supabase isn't configured. A client-side
 * passphrase check is not real security — see src/data/adminAuth.js.
 */
function PassphraseGate() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (input === ADMIN_PASSPHRASE) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setUnlocked(true);
      setError("");
    } else {
      setError("Incorrect passphrase.");
    }
  }

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    setUnlocked(false);
    setInput("");
  }

  if (!unlocked) {
    return (
      <div className="admin-gate">
        <form className="admin-gate__box" onSubmit={handleSubmit}>
          <p className="admin-gate__eyebrow">BHF Admin</p>
          <h1>Enter passphrase</h1>
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
            placeholder="Passphrase"
          />
          {error && <p className="admin-gate__error">{error}</p>}
          <button type="submit" className="btn btn--inverse">Unlock</button>
          <p className="admin-gate__note">
            Temporary gate for this preview build — connect Supabase (see
            README) to switch this to real email/password sign-in.
          </p>
        </form>
      </div>
    );
  }

  return <AdminShell onLogout={handleLogout} />;
}

/** Real gate used once Supabase is configured — email/password via Supabase Auth. */
function SupabaseGate() {
  const [session, setSession] = useState(undefined); // undefined = still checking
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (signInError) setError(signInError.message);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (session === undefined) {
    return <p className="admin-loading">Loading…</p>;
  }

  if (!session) {
    return (
      <div className="admin-gate">
        <form className="admin-gate__box" onSubmit={handleSubmit}>
          <p className="admin-gate__eyebrow">BHF Admin</p>
          <h1>Sign in</h1>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            placeholder="Email"
            autoComplete="username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
          />
          {error && <p className="admin-gate__error">{error}</p>}
          <button type="submit" className="btn btn--inverse" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
          <p className="admin-gate__note">
            Create this account first in the Supabase Dashboard under
            Authentication &rarr; Users. See README for setup steps.
          </p>
        </form>
      </div>
    );
  }

  return <AdminShell onLogout={handleLogout} />;
}

export default function AdminLayout() {
  useEffect(() => {
    document.title = "Admin — Borobudur Home Furniture";
    // Keep this internal tool out of search results.
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => document.head.removeChild(meta);
  }, []);

  return isSupabaseConfigured ? <SupabaseGate /> : <PassphraseGate />;
}
