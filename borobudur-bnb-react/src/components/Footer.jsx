import { Link } from 'react-router-dom';
import { SITE } from '../data/site';
import { rooms } from '../data/rooms';
import { waLink } from '../utils/whatsapp';
import { IconFacebook, IconInstagram, IconWhatsApp } from './Icons';
import Reveal from './Reveal';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <Reveal className="footer__word">
          Borobudur <em>BnB</em>
        </Reveal>
        <div className="footer__top">
          <div className="footer__brand">
            <p>
              A family-run heritage homestay 700 metres from Borobudur Temple, Magelang, Central Java — hosting
              travelers since 2016.
            </p>
            <div className="footer__social">
              <a href={SITE.instagram} target="_blank" rel="noopener" aria-label="Instagram">
                <IconInstagram />
              </a>
              <a href={SITE.facebook} target="_blank" rel="noopener" aria-label="Facebook">
                <IconFacebook />
              </a>
              <a href={waLink('Halo Borobudur BnB')} target="_blank" rel="noopener" aria-label="WhatsApp">
                <IconWhatsApp />
              </a>
            </div>
          </div>
          <div className="footer__col">
            <h4>Explore</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/facility">Facility</Link></li>
              <li><Link to="/room">Room</Link></li>
              <li><Link to="/activity">Activity</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer__col">
            <h4>Rooms</h4>
            <ul>
              {rooms.map((r) => (
                <li key={r.slug}>
                  <Link to={`/room/${r.slug}`}>{r.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer__col">
            <h4>Contact</h4>
            <ul>
              <li><address>{SITE.addressShort}</address></li>
              <li><a href={SITE.phoneHref}>{SITE.phone}</a></li>
              <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© {year} {SITE.name} — All rights reserved</span>
          <span>Slow mornings in Magelang</span>
        </div>
      </div>
    </footer>
  );
}
