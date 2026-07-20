import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { SITE } from "../data/site.js";

const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/catalog", label: "Catalog" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("nav-locked", open);
    return () => document.body.classList.remove("nav-locked");
  }, [open]);

  const darkHero = pathname === "/";
  const headerClass = [
    "site-header",
    darkHero ? "site-header--dark" : "",
    scrolled ? "is-scrolled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClass}>
      <div className="container site-header__inner">
        <Link className="brand" to="/">
          <span className="brand__mark">{SITE.brand}</span>
          <span className="brand__name">{SITE.name}</span>
        </Link>
        <button
          className="nav-toggle"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span></span>
          <span></span>
        </button>
        <nav className={"site-nav" + (open ? " is-open" : "")} aria-label="Main">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => (isActive ? "is-active" : undefined)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
