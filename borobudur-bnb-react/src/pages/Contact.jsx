import { SITE } from '../data/site';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import ContactForm from '../components/ContactForm';
import Faq from '../components/Faq';
import MobileCta from '../components/MobileCta';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useContent } from '../admin/ContentContext';
import Editable from '../admin/Editable';

const FAQ_ITEMS = [
  { q: 'How quickly will you respond?', a: 'Usually within the hour via WhatsApp, even outside office hours — the host family lives on site. Email replies may take up to a day.' },
  { q: 'What payment methods do you accept?', a: 'Bank transfer (BCA, BRI), QRIS, and major international cards on arrival. A 30% deposit confirms your booking.' },
  { q: 'Can you help arrange transport from the airport?', a: "Yes — send your flight details and we'll arrange a driver from Yogyakarta International Airport (YIA), about 1 hour away." },
  { q: 'Do you take group or multi-room bookings?', a: "Absolutely — email hello@borobudurbnb.id for groups of 3+ rooms and we'll put together a custom itinerary with the sunrise tour." },
  { q: "What's the best time of year to visit?", a: 'April–October (dry season) offers the clearest sunrise views. June–September is peak season, so book 3–4 weeks ahead.' },
];

export default function Contact() {
  useDocumentTitle('Contact Us — Borobudur BnB, Magelang');
  const { overrides } = useContent();
  const phone = overrides['site.phone'] ?? SITE.phone;
  const email = overrides['site.email'] ?? SITE.email;
  const phoneHref = `tel:${phone.replace(/[^\d+]/g, '')}`;

  return (
    <>
      <PageHero
        short
        image="premium_photo-1697730050329-e11a8eb63c69"
        alt="Rice terrace landscape near Borobudur BnB"
        crumb="Contact"
        title="Let's plan your stay"
        sub="Questions about rooms, the sunrise tour, or getting here from Yogyakarta? We usually reply within the hour."
      />

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <Reveal className="contact-grid__info">
              <p className="label">
                <span className="label__no">( 01 )</span> Reach Us Directly
              </p>
              <h2 style={{ margin: '22px 0 40px' }}>Contact details</h2>

              <div className="contact-list">
                <div className="contact-item">
                  <span className="k">Address</span>
                  <span className="v">
                    <Editable path="site.address" fallback={SITE.address} multiline rules={{ label: 'Full address', maxLength: 220 }} />
                  </span>
                </div>
                <div className="contact-item">
                  <span className="k">WhatsApp</span>
                  <span className="v">
                    <a href={`https://wa.me/6281390000123`} target="_blank" rel="noopener">
                      <Editable path="site.phone" fallback={phone} rules={{ label: 'Phone', maxLength: 24 }} />
                    </a>{' '}
                    — fastest way to reach us, day or night
                  </span>
                </div>
                <div className="contact-item">
                  <span className="k">Email</span>
                  <span className="v">
                    <a href={`mailto:${email}`}>
                      <Editable path="site.email" fallback={email} rules={{ label: 'Email', maxLength: 60 }} />
                    </a>{' '}
                    — for group bookings &amp; invoices
                  </span>
                </div>
                <div className="contact-item">
                  <span className="k">Front desk</span>
                  <span className="v">Open 24 hours — the host family lives on site, so someone is always reachable.</span>
                </div>
              </div>

              <div className="map-frame">
                <iframe
                  src={SITE.mapEmbed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Map showing Borobudur BnB near Borobudur Temple, Magelang"
                />
              </div>
              <p className="small-note" style={{ marginTop: 14 }}>
                ~4 minutes' walk from the temple's east gate · ~1 hour from Yogyakarta International Airport (YIA) ·
                ~1.5 hours from Yogyakarta city center
              </p>
            </Reveal>

            <Reveal className="contact-grid__form">
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--band">
        <div className="container">
          <Reveal className="section-head section-head--center">
            <p className="label" style={{ justifyContent: 'center' }}>
              <span className="label__no">( 03 )</span> Before You Reach Out
            </p>
            <h2>Common questions</h2>
          </Reveal>
          <Faq items={FAQ_ITEMS} />
        </div>
      </section>

      <MobileCta
        left={{ label: 'Call', href: phoneHref, external: false }}
        right={{ label: 'Booking form', href: '#contact-form', external: false }}
      />
    </>
  );
}
