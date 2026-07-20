import { Link } from 'react-router-dom';
import { img } from '../utils/img';
import { waBookLink } from '../utils/whatsapp';
import { useLightbox } from '../hooks/useLightbox.jsx';
import Reveal from './Reveal';

// Shared body for room and activity detail pages — gallery + booking
// aside, story section, and a prev/next pager. `item` follows the shape
// defined in src/data/rooms.js / activities.js.
export default function DetailPage({ item, parentLabel, parentHref, prev, next }) {
  const { open } = useLightbox();
  const bookHref = waBookLink(item.name);

  const galleryImages = [item.hero, ...item.thumbs].map((t) => ({
    src: img(t.id, 1800),
    alt: t.alt,
  }));

  return (
    <>
      <section className="detail-head">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>—</span>
            <Link to={parentHref}>{parentLabel}</Link>
            <span>—</span>
            <span>{item.name}</span>
          </div>
          <p className="label">
            <span className="label__no">( {item.no} )</span> {item.kicker}
          </p>
          <Reveal as="h1" style={{ marginTop: 20 }}>
            {item.name}
          </Reveal>
          <Reveal as="p" className="lede" style={{ marginTop: 22 }}>
            {item.lede}
          </Reveal>
        </div>
      </section>

      <section className="section section--flush-top">
        <div className="container">
          <div className="detail-grid">
            <Reveal className="detail-grid__gallery">
              <div className="detail-hero" onClick={() => open(galleryImages, 0)}>
                <img src={img(item.hero.id, 1400)} alt={item.hero.alt} loading="lazy" />
              </div>
              <div className={`detail-thumbs${item.thumbs.length === 3 ? ' detail-thumbs--tri' : ''}`}>
                {item.thumbs.map((t, i) => (
                  <img
                    key={t.id}
                    src={img(t.id, 700)}
                    alt={t.alt}
                    loading="lazy"
                    onClick={() => open(galleryImages, i + 1)}
                  />
                ))}
              </div>
              <div className="split__caption" style={{ marginTop: 16 }}>
                <span>{item.capLeft}</span>
                <span>{item.capRight}</span>
              </div>
            </Reveal>

            <Reveal as="aside" className="detail-grid__aside">
              <div className="detail-aside__card">
                <p className="label">
                  <span className="label__no">—</span> At a glance
                </p>
                <ul className="room-detail__specs">
                  {item.specs.map(([k, v]) => (
                    <li key={k}>
                      <span className="k">{k}</span>
                      <span className="v">{v}</span>
                    </li>
                  ))}
                </ul>
                <div className="room-detail__priceline">
                  <span className="price">{item.price}</span>
                  <span className="per">{item.per}</span>
                </div>
                <div className="room-detail__cta-row">
                  <a className="btn btn--solid btn--block" href={bookHref} target="_blank" rel="noopener">
                    Book via WhatsApp
                  </a>
                  <Link className="btn btn--block" to="/contact">
                    Ask a question
                  </Link>
                </div>
                <p className="room-detail__note">{item.note}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section--tight" style={{ paddingBottom: 'clamp(60px, 8vw, 110px)' }}>
        <div className="container">
          <div className="split">
            <Reveal className="split__body" style={{ gridColumn: '1 / 8' }}>
              <p className="label">
                <span className="label__no">—</span> {item.storyLabel}
              </p>
              <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.5rem)', maxWidth: 'none', marginTop: 18, marginBottom: 24 }}>
                {item.storyTitle}
              </h2>
              {item.paragraphs.map((p, i) => (
                <p className="lede" style={{ marginBottom: 18 }} key={i}>
                  {p}
                </p>
              ))}
              <ul className="split__list">
                {item.highlights.map((h, i) => (
                  <li data-i={`${['i', 'ii', 'iii', 'iv', 'v'][i] || i + 1}.`} key={h}>
                    {h}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section--tight" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal className="pager">
            <Link to={prev.href}>
              <span className="label">← Previous</span>
              <strong>{prev.label}</strong>
            </Link>
            <Link to={next.href}>
              <span className="label">Next →</span>
              <strong>{next.label}</strong>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
