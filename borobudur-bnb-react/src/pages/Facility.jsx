import { Link } from 'react-router-dom';
import { waLink } from '../utils/whatsapp';
import { img } from '../utils/img';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import Gallery from '../components/Gallery';
import Faq from '../components/Faq';
import MobileCta from '../components/MobileCta';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Editable from '../admin/Editable';
import { useContent } from '../admin/ContentContext';

const MEETING_ROWS = [
  ['Full board meeting', 'Rp 450.000/pax — room, 3 meals, 2× coffee break, projector, sound, Wi-Fi. Min. 10 guests.'],
  ['Full day meeting', 'Rp 150.000/pax — lunch or dinner, 2× coffee break, projector, sound, Wi-Fi. Min. 10 guests.'],
  ['Half day meeting', 'Rp 125.000/pax — lunch, 1× coffee break, projector, sound, Wi-Fi. Min. 10 guests.'],
  ['Add-ons', 'Extra projector Rp 300.000 · extra sound system Rp 150.000 · extra power/generator Rp 200.000'],
];

const GALLERY_ITEMS = [
  { id: 'photo-1780283574760-e8d7fd944da5', alt: 'Garden pool', thumbW: 900 },
  { id: 'photo-1754617438035-712ddf5500ef', alt: 'Home-cooked breakfast tray', thumbW: 800 },
  { id: 'photo-1571456803038-80efbf5c9d6b', alt: 'Kolam Kungkum wooden soaking tub', thumbW: 700 },
  { id: 'photo-1591674585153-ca78d0339b09', alt: 'Sunrise temple tour', thumbW: 800 },
  { id: 'photo-1566559532224-6d65e9fc0f37', alt: 'Borobudur Temple morning light', thumbW: 1100 },
];

const FAQ_ITEMS = [
  { q: 'Is the sunrise tour really free?', a: "Yes — the guided walk and our guide's time are included with every room. You only pay the official Borobudur Temple entry ticket at the gate." },
  { q: 'What time is breakfast served?', a: "6:30 am – 10 am at the joglo pavilion. If you're on the 04:15 sunrise tour, we keep a plate warm for when you return around 7 am." },
  { q: 'Is the pool suitable for children?', a: 'Yes, it’s a shallow garden pool (max depth 1.2 m) and children are welcome with adult supervision at all times.' },
  { q: 'Do you offer halal or vegetarian meals?', a: 'All our home-cooked meals are halal by default, and we happily prepare vegetarian or vegan versions — just let us know when you book.' },
  { q: 'Can I rent a scooter without an Indonesian license?', a: "We require an international driving permit for scooter rental. Without one, we're glad to arrange a driver instead." },
  { q: 'Is the Kolam Kungkum included in the room rate?', a: 'Yes — one soak session is included per stay. Additional sessions or larger groups can be arranged at the front desk, subject to availability.' },
];

export default function Facility() {
  useDocumentTitle('Facilities — Borobudur BnB, Magelang');
  const { rows } = useContent();
  const { facilities } = rows;

  return (
    <>
      <PageHero
        image="photo-1780283574760-e8d7fd944da5"
        alt="Garden swimming pool at Borobudur BnB"
        crumb="Facility"
        title="Built around one sunrise"
        sub="Every amenity here exists for a reason: to get you rested, fed, and standing in front of Borobudur before the world wakes up."
      />

      <section className="section section--tight">
        <div className="container">
          <Reveal className="statement">
            <p className="label">
              <span className="label__no">( 01 )</span> What's Included
            </p>
            <p>
              No paywalled amenities, no resort-fee surprises — <em>every room rate</em> already includes the
              essentials below.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section section--flush-top">
        <div className="container">
          <Reveal className="fac-grid">
            {facilities.map((f, i) => (
              <div className="fac-item" key={f.no}>
                <span className="fac-item__no">{f.no}</span>
                <h3>
                  <Editable path={`facilities.${i}.title`} fallback={f.title} rules={{ label: 'Title', maxLength: 50 }} />
                </h3>
                <p>
                  <Editable path={`facilities.${i}.text`} fallback={f.text} multiline rules={{ label: 'Description', maxLength: 180 }} />
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="feature" id="sunrise-tour">
        <div className="feature__media">
          <img src={img('photo-1631340729644-8b8aad1e9dba', 2200)} alt="Stupas of Borobudur Temple at dawn" loading="lazy" />
        </div>
        <div className="container feature__content">
          <div className="feature__grid">
            <Reveal className="feature__title">
              <p className="label">
                <span className="label__no">( 02 )</span> The Sunrise Tour
              </p>
              <h2>Four steps to first light</h2>
            </Reveal>
            <Reveal className="feature__aside">
              <ul className="feature__steps">
                <li><b>04:15</b> Wake-up call with hot ginger tea &amp; a torch</li>
                <li><b>04:30</b> Short walk through the village to the east gate</li>
                <li><b>05:00</b> Climb to the upper terraces before the crowds</li>
                <li><b>05:45</b> Sun clears the volcanoes; our guide shares the temple's history</li>
              </ul>
              <p>Entry ticket (~Rp 470.000 foreign / Rp 75.000 domestic) is paid at the gate and not included — everything else is on us.</p>
              <Link to="/contact" className="tlink tlink--light">
                Ask about tomorrow's tour <span aria-hidden>→</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="feature" id="kolam-kungkum">
        <div className="feature__media">
          <img src={img('photo-1571456803038-80efbf5c9d6b', 2200)} alt="Wooden soaking tub in a garden setting" loading="lazy" />
        </div>
        <div className="container feature__content">
          <div className="feature__grid">
            <Reveal className="feature__title">
              <p className="label">
                <span className="label__no">( 03 )</span> Kolam Kungkum
              </p>
              <h2>Soak it in, literally</h2>
            </Reveal>
            <Reveal className="feature__aside">
              <p>Long before onsen culture crossed the ocean, villages here had their own version — a deep cedar tub, warmed water, and nowhere to be. Ours sits behind a bamboo screen at the garden's edge, big enough for the whole group after a day on the trail.</p>
              <ul className="feature__steps">
                <li><b>Capacity</b> 4–6 adults per session</li>
                <li><b>Best after</b> horseback rides, ATV runs or river rafting</li>
                <li><b>Book</b> at the front desk, at least 2 hours ahead</li>
              </ul>
              <Link to="/contact" className="tlink tlink--light">
                Reserve your soak <span aria-hidden>→</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="split split--rev">
            <div className="split__media split__media--wide">
              <img src={img('photo-1780283574760-e8d7fd944da5', 1400)} alt="Garden pool surrounded by tropical plants" loading="lazy" />
              <div className="split__caption"><span>The Garden Pool</span><span>7 am – 9 pm</span></div>
            </div>
            <div className="split__body">
              <p className="label">
                <span className="label__no">( 04 )</span> Rest &amp; Recover
              </p>
              <h2>Cool off after a day of temples</h2>
              <p className="lede">Magelang afternoons run warm. Our garden pool — small, quiet, and never crowded with more than eight rooms of guests — is the easiest way to recover before an evening walk through the village.</p>
              <ul className="split__list">
                <li data-i="i.">Poolside loungers &amp; shaded cabana seating</li>
                <li data-i="ii.">Towels provided, refreshed daily</li>
                <li data-i="iii.">Fresh coconut &amp; juice service by the water</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--band">
        <div className="container">
          <Reveal className="section-head">
            <p className="label">
              <span className="label__no">( 05 )</span> Meetings &amp; Events
            </p>
            <h2>The joglo pavilion, put to work</h2>
            <p className="lede" style={{ marginTop: 14 }}>
              Our teak pavilion doubles as a meeting space for up to 20 guests — full-board retreats, day meetings,
              or a garden reception. Ask us to tailor a package.
            </p>
          </Reveal>
          <Reveal className="table-wrap">
            <table className="policy-table">
              <tbody>
                {MEETING_ROWS.map(([k, v]) => (
                  <tr key={k}>
                    <td>{k}</td>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
          <p className="small-note" style={{ marginTop: 14 }}>
            Prices are indicative and may change — confirm current rates with our team. Garden weddings and reunions
            are quoted separately based on guest count.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <p className="label">
              <span className="label__no">( 06 )</span> In Pictures
            </p>
            <h2>A look around the property</h2>
          </Reveal>
          <Gallery items={GALLERY_ITEMS} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="section-head section-head--center">
            <p className="label" style={{ justifyContent: 'center' }}>
              <span className="label__no">( 07 )</span> Good to Know
            </p>
            <h2>Facility questions</h2>
          </Reveal>
          <Faq items={FAQ_ITEMS} />
        </div>
      </section>

      <section className="cta-band">
        <img src={img('photo-1620549146396-9024d914cd99', 1800)} alt="Borobudur Temple golden hour" loading="lazy" />
        <Reveal as="div" className="container">
          <p className="label" style={{ justifyContent: 'center' }}>See the rooms</p>
          <h2>Pick your room, we'll handle the rest</h2>
          <p>Every facility above comes standard — now choose the room that fits your trip.</p>
          <div className="cta-band__row">
            <Link to="/room" className="btn btn--solid-light">View rooms &amp; rates</Link>
            <Link to="/contact" className="btn btn--light">Contact us</Link>
          </div>
        </Reveal>
      </section>

      <MobileCta
        left={{ label: 'WhatsApp', href: waLink('Halo Borobudur BnB, saya ingin tanya fasilitas.') }}
        right={{ label: 'Check availability', to: '/room' }}
      />
    </>
  );
}
