import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useScrollNav } from '../hooks/useScrollNav';
import { NAV_LINKS, SITE } from '../data/site';
import { BrandMark, IconClose, IconMenu } from './Icons';
import { useContent } from '../admin/ContentContext';
import Editable from '../admin/Editable';

export default function Nav({ solid = false }) {
  const { isScrolled, isHidden } = useScrollNav();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { overrides } = useContent();
  const phone = overrides['site.phone'] ?? SITE.phone;
  const email = overrides['site.email'] ?? SITE.email;
  const phoneHref = `tel:${phone.replace(/[^\d+]/g, '')}`;

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
          <NavLink to="/" className="brand" aria-label={SITE.name}>
            <span className="brand__mark">
              <BrandMark />
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
            <a className="nav__phone" href={phoneHref}>
              <Editable path="site.phone" fallback={SITE.phone} rules={{ label: 'Phone', maxLength: 24 }} />
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
            <Editable
              as="span"
              path="site.addressShort"
              fallback={SITE.addressShort}
              rules={{ label: 'Address (short)', maxLength: 120 }}
            />
            <br />
            <br />
            <a href={phoneHref}>{phone}</a>
            <br />
            <a href={`mailto:${email}`}>{email}</a>
          </div>
        </div>
      </div>
    </>
  );
}
