import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { ADMIN_PASSPHRASE } from "../../data/adminAuth.js";
import "../../styles/admin.css";

const SESSION_KEY = "bhf_admin_unlocked";

export default function AdminLayout() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Admin — Borobudur Home Furniture";
    // Keep this internal tool out of search results.
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => document.head.removeChild(meta);
  }, []);

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
            Temporary gate for this preview build — replace with Supabase Auth
            before this goes live.
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="admin">
      <header className="admin-topbar">
        <Link to="/admin" className="admin-topbar__brand">BHF Admin</Link>
        <nav className="admin-topbar__nav">
          <Link to="/" target="_blank" rel="noopener noreferrer">View site &#8599;</Link>
          <button type="button" onClick={handleLogout}>Log out</button>
        </nav>
      </header>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
