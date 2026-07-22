import { Link } from 'react-router-dom';
import { img } from '../utils/img';
import { waBookLink, waLink } from '../utils/whatsapp';
import IndexRow from '../components/IndexRow';
import ExpCard from '../components/ExpCard';
import Reveal from '../components/Reveal';
import Counter from '../components/Counter';
import Testimonials from '../components/Testimonials';
import Gallery from '../components/Gallery';
import MobileCta from '../components/MobileCta';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useContent } from '../admin/ContentContext';
import Editable from '../admin/Editable';

const ROOM_IMAGE_RULES = { aspect: '3:2', minWidth: 1200, minHeight: 800 };
const ACTIVITY_IMAGE_RULES = { aspect: '4:3', minWidth: 1000, minHeight: 750 };

const GALLERY_ITEMS = [
  { id: 'photo-1591674585153-ca78d0339b09', alt: 'Borobudur Temple sunrise', thumbW: 900 },
  { id: 'photo-1584132905271-512c958d674a', alt: 'Bedroom interior', thumbW: 800 },
  { id: 'photo-1759223607861-f0ef3e617739', alt: 'Bathroom detail', thumbW: 700 },
  { id: 'photo-1780283574760-e8d7fd944da5', alt: 'Garden swimming pool', thumbW: 800 },
  { id: 'photo-1754617438035-712ddf5500ef', alt: 'Traditional Indonesian breakfast', thumbW: 1100 },
];

export default function Home() {
  useDocumentTitle('Borobudur BnB — Boutique Stay Steps From Borobudur Temple, Magelang');
  const { overrides, rows } = useContent();
  const { rooms, activities, testimonials } = rows;
  const teaserRooms = rooms.slice(0, 3);
  const teaserActivities = [activities[0], activities[2], activities[4]].filter(Boolean); // horse riding, VW tour, rafting

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero__media">
          <img src={img('photo-1591674585153-ca78d0339b09', 2400)} alt="Sunrise silhouette over Borobudur Temple stupas" />
        </div>
        <div className="container hero__content">
          <p className="hero__kicker">A homestay, 700 metres from Borobudur</p>
          <Reveal as="h1">
            The sunrise is <em>older</em> than any of us
          </Reveal>
          <Reveal as="div" className="hero__foot">
            <p className="hero__sub">
              Eight heritage rooms in the village beside the temple. Reclaimed teak, a quiet garden pool, and
              mornings that begin with mist over ancient stone.
            </p>
            <div className="hero__cta">
              <Link to="/room" className="btn btn--solid-light">
                Check availability
              </Link>
              <a
                href={waLink('Halo Borobudur BnB, saya ingin tanya ketersediaan kamar.')}
                target="_blank"
                rel="noopener"
                className="tlink tlink--light"
              >
                WhatsApp us <span aria-hidden>→</span>
              </a>
            </div>
          </Reveal>
        </div>
        <div className="scroll-cue">
          <span className="scroll-cue__line" />
          Scroll
        </div>
      </section>

      {/* ===== FACT STRIP ===== */}
      <div className="factstrip">
        <div className="container">
          <Reveal group className="factstrip__grid">
            <div className="factstrip__item">
              <strong><Counter value={4.9} decimals={1} /> / 5</strong>
              <span>380+ guest reviews</span>
            </div>
            <div className="factstrip__item">
              <strong><Counter value={700} suffix=" m" /></strong>
              <span>To the temple's east gate</span>
            </div>
            <div className="factstrip__item">
              <strong>04:15</strong>
              <span>Sunrise walk, daily &amp; free</span>
            </div>
            <div className="factstrip__item">
              <strong><Counter value={8} /></strong>
              <span>Rooms only — book ahead</span>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ===== STATEMENT ===== */}
      <section className="section">
        <div className="container">
          <Reveal className="statement">
            <p className="label">
              <span className="label__no">( 01 )</span> Our Story
            </p>
            <p>
              Since 2016, our family has opened its home in Dusun Ngaran to travelers —{' '}
              <em>three joglo rooms</em> behind the kitchen have become eight, but the breakfast is still cooked by
              Ibu Sri, and the temple is still a short walk through the mist.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===== STORY SPLIT ===== */}
      <section className="section section--flush-top">
        <div className="container">
          <Reveal className="split">
            <div className="split__media">
              <img src={img('photo-1584132905271-512c958d674a', 1400)} alt="Sunlit heritage bedroom at Borobudur BnB" loading="lazy" />
              <div className="split__caption"><span>The Joglo Suite</span><span>Ngaran II</span></div>
            </div>
            <div className="split__body">
              <p className="label">
                <span className="label__no">( 02 )</span> The House
              </p>
              <h2>A family home in the shadow of a wonder</h2>
              <p className="lede">
                Built with reclaimed teak joglo timber and local volcanic stone, the house sits where our family has
                lived for four generations. Every stay funds our village guide and batik-weaving cooperative.
              </p>
              <ul className="split__list">
                <li data-i="i.">Family-run since 2016, four generations in Borobudur village</li>
                <li data-i="ii.">Reclaimed teak joglo frames, some over eighty years old</li>
                <li data-i="iii.">Home-cooked breakfast &amp; Magelang-grown coffee, included</li>
              </ul>
              <Link to="/facility" className="tlink">
                Discover the facilities <span aria-hidden>→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== ROOMS INDEX ===== */}
      <section className="section section--band" id="rooms">
        <div className="container">
          <Reveal className="section-head section-head--split">
            <div>
              <p className="label">
                <span className="label__no">( 03 )</span> Where You'll Sleep
              </p>
              <h2>Rooms built for slow mornings</h2>
            </div>
            <Link to="/room" className="tlink">
              All rooms &amp; rates <span aria-hidden>→</span>
            </Link>
          </Reveal>

          <div className="room-index">
            {teaserRooms.map((r) => (
              <IndexRow
                key={r.slug}
                no={r.no}
                title={<Editable path={`rooms.${r.slug}.name`} fallback={r.name} rules={{ label: 'Room name', maxLength: 60 }} />}
                meta={r.listMeta}
                desc={<Editable path={`rooms.${r.slug}.listDesc`} fallback={r.listDesc} multiline rules={{ label: 'Short description', maxLength: 220 }} />}
                price={<Editable path={`rooms.${r.slug}.listPrice`} fallback={r.listPrice} rules={{ label: 'Price', maxLength: 24 }} />}
                pricePer={<Editable path={`rooms.${r.slug}.listPricePer`} fallback={r.listPricePer} rules={{ label: 'Price unit', maxLength: 20 }} />}
                detailHref={`/room/${r.slug}`}
                bookHref={waBookLink(overrides[`rooms.${r.slug}.name`] ?? r.name)}
                image={r.hero.image}
                imageAlt={r.hero.alt}
                editImagePath={`rooms.${r.slug}.hero.image`}
                imageRules={ROOM_IMAGE_RULES}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== EXPERIENCES ===== */}
      <section className="section">
        <div className="container">
          <Reveal className="section-head section-head--split">
            <div>
              <p className="label">
                <span className="label__no">( 04 )</span> Beyond the Temple
              </p>
              <h2>Days worth waking up for</h2>
            </div>
            <Link to="/activity" className="tlink">
              All activities <span aria-hidden>→</span>
            </Link>
          </Reveal>
          <Reveal group className="exp-grid">
            {teaserActivities.map((a) => (
              <ExpCard
                key={a.slug}
                to={`/activity/${a.slug}`}
                media={a.hero}
                meta={[a.listMeta[0], a.listMeta[1]]}
                title={<Editable path={`activities.${a.slug}.name`} fallback={a.name} rules={{ label: 'Activity name', maxLength: 60 }} />}
                text={<Editable path={`activities.${a.slug}.listDesc`} fallback={a.listDesc} multiline rules={{ label: 'Short description', maxLength: 220 }} />}
                editImagePath={`activities.${a.slug}.hero.image`}
                imageRules={ACTIVITY_IMAGE_RULES}
                footer={
                  <span className="tlink">
                    From <Editable path={`activities.${a.slug}.listPrice`} fallback={a.listPrice} rules={{ label: 'Price', maxLength: 24 }} />{' '}
                    <span aria-hidden>→</span>
                  </span>
                }
              />
            ))}
          </Reveal>
        </div>
      </section>

      {/* ===== SUNRISE FEATURE ===== */}
      <section className="feature">
        <div className="feature__media">
          <img src={img('photo-1566559532224-6d65e9fc0f37', 2200)} alt="Borobudur Temple stupas in soft morning light" loading="lazy" />
        </div>
        <div className="container feature__content">
          <div className="feature__grid">
            <Reveal className="feature__title">
              <p className="label">
                <span className="label__no">( 05 )</span> Signature Experience
              </p>
              <h2>The sunrise that started it all</h2>
            </Reveal>
            <Reveal className="feature__aside">
              <p>We wake you at 04:15, walk you through the misty village lanes, and get you inside the gate before the tour buses arrive. Included free with every stay.</p>
              <ul className="feature__steps">
                <li><b>04:15</b> Wake-up call, hot ginger tea &amp; a torch</li>
                <li><b>04:30</b> Walk through the village to the east gate</li>
                <li><b>05:45</b> First light clears the volcanoes</li>
              </ul>
              <Link to="/facility#sunrise-tour" className="tlink tlink--light">
                How it works <span aria-hidden>→</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== BOOK DIRECT ===== */}
      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <p className="label">
              <span className="label__no">( 06 )</span> Book Direct
            </p>
            <h2>No middlemen, better mornings</h2>
          </Reveal>
          <Reveal className="fac-list">
            <div className="fac-item">
              <span className="fac-item__no">i.</span>
              <h3>10% lower than the booking sites</h3>
              <p>No commission means we pass the saving straight to you — guaranteed on every direct booking.</p>
            </div>
            <div className="fac-item">
              <span className="fac-item__no">ii.</span>
              <h3>Free early check-in</h3>
              <p>Arriving on the overnight bus from Jakarta? Drop your bags from 6 am, no charge, coffee included.</p>
            </div>
            <div className="fac-item">
              <span className="fac-item__no">iii.</span>
              <h3>Free cancellation, 48 hours</h3>
              <p>Plans change. Cancel up to 48 hours before check-in for a full refund — no questions asked.</p>
            </div>
          </Reveal>
          <Reveal className="mt-lg">
            <p className="note-line">Only 8 rooms — June to September books out weeks ahead</p>
          </Reveal>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section section--dark">
        <div className="container">
          <Testimonials items={testimonials} />
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      <section className="section">
        <div className="container">
          <Reveal className="section-head section-head--split">
            <div>
              <p className="label">
                <span className="label__no">( 07 )</span> A Small Taste
              </p>
              <h2>Life at the house</h2>
            </div>
            <Link to="/room" className="tlink">
              Full room gallery <span aria-hidden>→</span>
            </Link>
          </Reveal>
          <Gallery items={GALLERY_ITEMS} />
        </div>
      </section>

      {/* ===== CTA BAND ===== */}
      <section className="cta-band">
        <img src={img('photo-1620549146396-9024d914cd99', 1800)} alt="Golden hour at Borobudur Temple" loading="lazy" />
        <Reveal as="div" className="container">
          <p className="label">Ready when you are</p>
          <h2>Your sunrise is waiting</h2>
          <p>Eight rooms, one unforgettable view. Message us directly and we'll hold your dates while you plan the rest of your Java trip.</p>
          <div className="cta-band__row">
            <Link to="/room" className="btn btn--solid-light">Check availability</Link>
            <Link to="/contact" className="btn btn--light">Contact us</Link>
          </div>
        </Reveal>
      </section>

      <MobileCta
        left={{ label: 'WhatsApp', href: waLink('Halo Borobudur BnB, saya ingin tanya ketersediaan kamar.') }}
        right={{ label: 'Check availability', to: '/room' }}
      />
    </>
  );
}
