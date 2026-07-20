import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useScrollNav } from '../hooks/useScrollNav';
import { NAV_LINKS, SITE } from '../data/site';
import { BrandMark, IconClose, IconMenu } from './Icons';

export default function Nav({ solid = false }) {
  const { isScrolled, isHidden } = useScrollNav();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navClass = [
    'nav',
    solid ? 'nav--solid' : '',
    isScrolled ? 'is-scrolled' : '',
    isHidden ? 'is-hidden' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <header className={navClass} id="site-nav">
        <div className="container">
          <NavLink to="/" className="brand">
            <span className="brand__mark">
              <BrandMark />
            </span>
            <span>
              <strong>{SITE.name}</strong>
              <em>{SITE.tagline}</em>
            </span>
          </NavLink>
          <nav className="nav__links">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => (isActive ? 'is-active' : '')}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="nav__actions">
            <a className="nav__phone" href={SITE.phoneHref}>
              {SITE.phone}
            </a>
            <NavLink to="/room" className="btn">
              Book
            </NavLink>
            <button className="nav__burger" aria-label="Open menu" onClick={() => setDrawerOpen(true)}>
              <IconMenu />
            </button>
          </div>
        </div>
      </header>

      <div className={`drawer${drawerOpen ? ' is-open' : ''}`}>
        <div className="drawer__scrim" onClick={() => setDrawerOpen(false)} />
        <div className="drawer__panel">
          <button className="drawer__close" aria-label="Close menu" onClick={() => setDrawerOpen(false)}>
            <IconClose />
          </button>
          <nav className="drawer__links">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setDrawerOpen(false)}
                className={({ isActive }) => (isActive ? 'is-active' : '')}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="drawer__meta">
            {SITE.addressShort.split(', ').slice(0, 2).join(', ')}
            <br />
            {SITE.addressShort.split(', ').slice(2).join(', ')}
            <br />
            <br />
            <a href={SITE.phoneHref}>{SITE.phone}</a>
            <br />
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </div>
        </div>
      </div>
    </>
  );
}
