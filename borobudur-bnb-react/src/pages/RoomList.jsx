import { Link } from 'react-router-dom';
import { img } from '../utils/img';
import { waBookLink, waLink } from '../utils/whatsapp';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import Faq from '../components/Faq';
import MobileCta from '../components/MobileCta';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useContent } from '../admin/ContentContext';
import Editable from '../admin/Editable';
import EditableImage from '../admin/EditableImage';
import EditListButton from '../admin/EditListButton';
import { encodeSpecs, decodeSpecs } from '../admin/textCodec';

const HERO_IMAGE_RULES = { aspect: '3:2', minWidth: 1400, minHeight: 933 };
const THUMB_IMAGE_RULES = { aspect: '1:1', minWidth: 500, minHeight: 500 };

const FAQ_ITEMS = [
  {
    q: 'Which room is closest to the temple gate?',
    a: "All rooms are within the same 700 m walk to Borobudur's east gate — but the Rooftop Sunrise Room is the only one with a direct temple view from your own terrace.",
  },
  {
    q: 'Do all rooms have private bathrooms?',
    a: 'Yes, every room type listed above has its own ensuite bathroom with hot water — there are no shared bathrooms at Borobudur BnB.',
  },
  {
    q: "What's the best room for a family with young kids?",
    a: 'The Family Cottage — two bedrooms, a private terrace away from other guests, and a kitchenette for warming baby food or snacks.',
  },
  {
    q: 'Can I request a late check-out?',
    a: "Often, yes — message us the morning of check-out and we'll confirm based on same-day arrivals. Late check-out until 3 pm is complimentary when available.",
  },
  {
    q: 'How far in advance should I book?',
    a: 'For June–September or around Waisak (Vesak) day, we recommend booking 3–4 weeks ahead — the Rooftop Sunrise Room sells out earliest.',
  },
];

const POLICY_ROWS = [
  ['Check-in / out', '2:00 PM / 12:00 PM — early check-in free, subject to availability'],
  ['Deposit', '30% via bank transfer or QRIS to confirm; balance paid in cash or transfer on arrival'],
  ['Cancellation', 'Free cancellation up to 48 hours before check-in; 50% refund within 48 hours'],
  ['Minimum stay', '1 night (low season) · 2 nights (Jun–Sep high season & public holidays)'],
  ['Children', 'Under 5 stay free sharing existing beds; extra bed Rp 150.000/night'],
  ['Pets', 'Not permitted, to respect other guests and our own house cats'],
];

export default function RoomList() {
  useDocumentTitle('Rooms & Rates — Borobudur BnB, Magelang');
  const { overrides, rows } = useContent();
  const { rooms } = rows;

  return (
    <>
      <PageHero
        image="photo-1584132905271-512c958d674a"
        alt="Warm heritage-style bedroom at Borobudur BnB"
        crumb="Room"
        title="Four rooms, facing the story"
        sub="From a solo garden room to a two-bedroom family cottage — each built by hand with reclaimed teak, each a short walk from the temple gate."
      />

      <section className="section section--tight" style={{ paddingBlock: 36 }}>
        <div className="container">
          <Reveal className="section-head section-head--split" style={{ marginBottom: 0 }}>
            <div>
              <p className="lede">All rates include home-cooked breakfast, the daily sunrise temple walk and free Wi-Fi. Prices shown are per night, low season.</p>
            </div>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {rooms.map((r) => (
                <a key={r.slug} className="tlink" href={`#${r.slug}`}>
                  {r.no} — {r.shortLabel}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {rooms.map((room, i) => {
        const p = (field) => `rooms.${room.slug}.${field}`;
        const name = overrides[p('name')] ?? room.name;
        const specs = decodeSpecs(overrides[p('specs')] ?? encodeSpecs(room.specs));
        return (
          <section className={`section${i % 2 === 1 ? ' section--band' : ''}`} id={room.slug} key={room.slug}>
            <div className="container">
              <Reveal className={`room-detail${i % 2 === 1 ? ' room-detail--rev' : ''}`}>
                <div className="room-detail__gallery">
                  <div className="room-detail__hero">
                    <EditableImage path={p('hero.image')} fallbackSrc={room.hero.image} alt={room.hero.alt} rules={HERO_IMAGE_RULES} />
                  </div>
                  <div className="room-detail__thumbs">
                    {room.thumbs.map((t, ti) => (
                      <EditableImage
                        key={t.image || ti}
                        path={p(`thumbs.${ti}.image`)}
                        fallbackSrc={t.image}
                        alt={t.alt}
                        rules={THUMB_IMAGE_RULES}
                      />
                    ))}
                  </div>
                </div>
                <div className="room-detail__body">
                  <p className="label">
                    <span className="label__no">( {room.no} )</span> {room.kicker}
                  </p>
                  <h2>
                    <Editable path={p('name')} fallback={room.name} rules={{ label: 'Room name', maxLength: 60 }} />
                  </h2>
                  <p className="lede">
                    <Editable path={p('lede')} fallback={room.lede} multiline rules={{ label: 'Lede', maxLength: 260 }} />
                  </p>
                  <ul className="room-detail__specs">
                    {specs.map(([k, v]) => (
                      <li key={k}>
                        <span className="k">{k}</span>
                        <span className="v">{v}</span>
                      </li>
                    ))}
                  </ul>
                  <EditListButton path={p('specs')} value={overrides[p('specs')] ?? encodeSpecs(room.specs)} label="specs (Key: Value per line)" />
                  <div className="room-detail__priceline">
                    <span className="price">
                      <Editable path={p('price')} fallback={room.price} rules={{ label: 'Price', maxLength: 24 }} />
                    </span>
                    <span className="per">
                      <Editable path={p('per')} fallback={room.per} rules={{ label: 'Price unit', maxLength: 20 }} />
                    </span>
                  </div>
                  <div className="room-detail__cta-row">
                    <a className="btn btn--solid" href={waBookLink(name)} target="_blank" rel="noopener">
                      Book this room
                    </a>
                    <Link className="btn" to={`/room/${room.slug}`}>
                      Details &amp; gallery
                    </Link>
                    <Link className="btn" to="/contact">
                      Ask a question
                    </Link>
                  </div>
                  <p className="room-detail__note">
                    <Editable path={p('note')} fallback={room.note} multiline rules={{ label: 'Note', maxLength: 140 }} />
                  </p>
                </div>
              </Reveal>
            </div>
          </section>
        );
      })}

      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <p className="label">
              <span className="label__no">( 05 )</span> Before You Book
            </p>
            <h2>Stay policies</h2>
          </Reveal>
          <Reveal className="table-wrap">
            <table className="policy-table">
              <tbody>
                {POLICY_ROWS.map(([k, v]) => (
                  <tr key={k}>
                    <td>{k}</td>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      <section className="section section--band">
        <div className="container">
          <Reveal className="section-head section-head--center">
            <p className="label" style={{ justifyContent: 'center' }}>
              <span className="label__no">( 06 )</span> Room FAQ
            </p>
            <h2>Still deciding?</h2>
          </Reveal>
          <Faq items={FAQ_ITEMS} />
        </div>
      </section>

      <section className="cta-band">
        <img src={img('photo-1566559532224-6d65e9fc0f37', 1800)} alt="Borobudur Temple morning light" loading="lazy" />
        <Reveal as="div" className="container">
          <p className="label" style={{ justifyContent: 'center' }}>
            Not sure which room?
          </p>
          <h2>Tell us your trip, we'll recommend a room</h2>
          <p>Message us on WhatsApp with your dates and group size — we reply within the hour, most days.</p>
          <div className="cta-band__row">
            <a
              href={waLink('Halo Borobudur BnB, saya butuh rekomendasi kamar.')}
              target="_blank"
              rel="noopener"
              className="btn btn--wa"
            >
              Chat on WhatsApp
            </a>
            <Link to="/contact" className="btn btn--light">
              Contact form
            </Link>
          </div>
        </Reveal>
      </section>

      <MobileCta
        left={{ label: 'WhatsApp', href: waLink('Halo Borobudur BnB, saya ingin booking kamar.') }}
        right={{ label: 'Jump to rooms', href: `#${rooms[0].slug}`, external: false }}
      />
    </>
  );
}
