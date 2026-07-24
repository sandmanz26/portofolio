import { Link } from 'react-router-dom';
import { SITE } from '../data/site';
import { waLink } from '../utils/whatsapp';
import { IconFacebook, IconInstagram, IconWhatsApp } from './Icons';
import Reveal from './Reveal';
import { useContent } from '../admin/ContentContext';
import Editable from '../admin/Editable';
import EditListButton from '../admin/EditListButton';

export default function Footer() {
  const year = new Date().getFullYear();
  const { overrides, rows } = useContent();
  const { rooms } = rows;
  const instagram = overrides['site.instagram'] || SITE.instagram;
  const facebook = overrides['site.facebook'] || SITE.facebook;
  const phone = overrides['site.phone'] ?? SITE.phone;
  const email = overrides['site.email'] ?? SITE.email;
  const addressShort = overrides['site.addressShort'] ?? SITE.addressShort;
  const phoneHref = `tel:${phone.replace(/[^\d+]/g, '')}`;
  const footerDescription = overrides['site.footerDescription'] ?? SITE.footerDescription;
  const footerTagline = overrides['site.footerTagline'] ?? SITE.footerTagline;
  return (
    <footer className="footer">
      <div className="container">
        <Reveal className="footer__word">
          Borobudur <em>BnB</em>
        </Reveal>
        <div className="footer__top">
          <div className="footer__brand">
            <p>
              <Editable
                path="site.footerDescription"
                fallback={footerDescription}
                multiline
                rules={{ label: 'Footer description', maxLength: 220 }}
              />
            </p>
            <div className="footer__social">
              <a href={instagram} target="_blank" rel="noopener" aria-label="Instagram">
                <IconInstagram />
              </a>
              <a href={facebook} target="_blank" rel="noopener" aria-label="Facebook">
                <IconFacebook />
              </a>
              <a href={waLink('Halo Borobudur BnB')} target="_blank" rel="noopener" aria-label="WhatsApp">
                <IconWhatsApp />
              </a>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
              <EditListButton path="site.instagram" value={instagram} label="Instagram URL" type="text" />
              <EditListButton path="site.facebook" value={facebook} label="Facebook URL" type="text" />
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
              <li>
                <address>
                  <Editable path="site.addressShort" fallback={addressShort} rules={{ label: 'Address (short)', maxLength: 120 }} />
                </address>
              </li>
              <li>
                <a href={phoneHref}>
                  <Editable path="site.phone" fallback={phone} rules={{ label: 'Phone', maxLength: 24 }} />
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`}>
                  <Editable path="site.email" fallback={email} rules={{ label: 'Email', maxLength: 60 }} />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>
            © {year} <Editable path="site.name" fallback={SITE.name} rules={{ label: 'Site name', maxLength: 40 }} /> — All rights reserved
          </span>
          <span>
            <Editable path="site.footerTagline" fallback={footerTagline} rules={{ label: 'Footer tagline', maxLength: 60 }} />
          </span>
        </div>
      </div>
    </footer>
  );
}
