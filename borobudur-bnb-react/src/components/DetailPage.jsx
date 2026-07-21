import { Link } from 'react-router-dom';
import { img } from '../utils/img';
import { waBookLink } from '../utils/whatsapp';
import { useLightbox } from '../hooks/useLightbox.jsx';
import Reveal from './Reveal';
import { useContent } from '../admin/ContentContext';
import Editable from '../admin/Editable';
import EditableImage from '../admin/EditableImage';
import EditListButton from '../admin/EditListButton';
import { encodeSpecs, decodeSpecs, encodeParagraphs, decodeParagraphs, encodeLines, decodeLines } from '../admin/textCodec';

const HERO_IMAGE_RULES = { aspect: '3:2', minWidth: 1400, minHeight: 933 };
const THUMB_IMAGE_RULES = { aspect: '1:1', minWidth: 700, minHeight: 700 };

// Shared body for room and activity detail pages — gallery + booking
// aside, story section, and a prev/next pager. `item` follows the shape
// defined in src/data/rooms.js / activities.js. `pathPrefix` (e.g.
// "rooms.joglo") namespaces every editable field on this item.
export default function DetailPage({ item, parentLabel, parentHref, prev, next, pathPrefix }) {
  const { open } = useLightbox();
  const { overrides } = useContent();

  const p = (field) => `${pathPrefix}.${field}`;
  const name = overrides[p('name')] ?? item.name;
  const heroSrc = overrides[p('hero.image')] || img(item.hero.id, 1400);
  const heroFullSrc = overrides[p('hero.image')] || img(item.hero.id, 1800);
  const thumbSrcs = item.thumbs.map((t, i) => overrides[p(`thumbs.${i}.image`)] || img(t.id, 700));
  const thumbFullSrcs = item.thumbs.map((t, i) => overrides[p(`thumbs.${i}.image`)] || img(t.id, 1800));

  const specs = decodeSpecs(overrides[p('specs')] ?? encodeSpecs(item.specs));
  const paragraphs = decodeParagraphs(overrides[p('paragraphs')] ?? encodeParagraphs(item.paragraphs));
  const highlights = decodeLines(overrides[p('highlights')] ?? encodeLines(item.highlights));

  const bookHref = waBookLink(name);

  const galleryImages = [
    { src: heroFullSrc, alt: item.hero.alt },
    ...item.thumbs.map((t, i) => ({ src: thumbFullSrcs[i], alt: t.alt })),
  ];

  return (
    <>
      <section className="detail-head">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>—</span>
            <Link to={parentHref}>{parentLabel}</Link>
            <span>—</span>
            <span>{name}</span>
          </div>
          <p className="label">
            <span className="label__no">( {item.no} )</span> {item.kicker}
          </p>
          <Reveal as="h1" style={{ marginTop: 20 }}>
            <Editable path={p('name')} fallback={item.name} rules={{ label: 'Name', maxLength: 60 }} />
          </Reveal>
          <Reveal as="p" className="lede" style={{ marginTop: 22 }}>
            <Editable path={p('lede')} fallback={item.lede} multiline rules={{ label: 'Lede', maxLength: 260 }} />
          </Reveal>
        </div>
      </section>

      <section className="section section--flush-top">
        <div className="container">
          <div className="detail-grid">
            <Reveal className="detail-grid__gallery">
              <div className="detail-hero" onClick={() => open(galleryImages, 0)}>
                <EditableImage path={p('hero.image')} fallbackSrc={heroSrc} alt={item.hero.alt} rules={HERO_IMAGE_RULES} />
              </div>
              <div className={`detail-thumbs${item.thumbs.length === 3 ? ' detail-thumbs--tri' : ''}`}>
                {item.thumbs.map((t, i) => (
                  <div key={t.id} onClick={() => open(galleryImages, i + 1)}>
                    <EditableImage
                      path={p(`thumbs.${i}.image`)}
                      fallbackSrc={thumbSrcs[i]}
                      alt={t.alt}
                      rules={THUMB_IMAGE_RULES}
                    />
                  </div>
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
                  {specs.map(([k, v]) => (
                    <li key={k}>
                      <span className="k">{k}</span>
                      <span className="v">{v}</span>
                    </li>
                  ))}
                </ul>
                <EditListButton path={p('specs')} value={overrides[p('specs')] ?? encodeSpecs(item.specs)} label="specs (Key: Value per line)" />
                <div className="room-detail__priceline">
                  <span className="price">
                    <Editable path={p('price')} fallback={item.price} rules={{ label: 'Price', maxLength: 24 }} />
                  </span>
                  <span className="per">
                    <Editable path={p('per')} fallback={item.per} rules={{ label: 'Price unit', maxLength: 20 }} />
                  </span>
                </div>
                <div className="room-detail__cta-row">
                  <a className="btn btn--solid btn--block" href={bookHref} target="_blank" rel="noopener">
                    Book via WhatsApp
                  </a>
                  <Link className="btn btn--block" to="/contact">
                    Ask a question
                  </Link>
                </div>
                <p className="room-detail__note">
                  <Editable path={p('note')} fallback={item.note} multiline rules={{ label: 'Note', maxLength: 140 }} />
                </p>
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
                <Editable path={p('storyTitle')} fallback={item.storyTitle} rules={{ label: 'Story title', maxLength: 80 }} />
              </h2>
              {paragraphs.map((par, i) => (
                <p className="lede" style={{ marginBottom: 18 }} key={i}>
                  {par}
                </p>
              ))}
              <EditListButton
                path={p('paragraphs')}
                value={overrides[p('paragraphs')] ?? encodeParagraphs(item.paragraphs)}
                label="story paragraphs (baris kosong = paragraf baru)"
              />
              <ul className="split__list">
                {highlights.map((h, i) => (
                  <li data-i={`${['i', 'ii', 'iii', 'iv', 'v'][i] || i + 1}.`} key={h}>
                    {h}
                  </li>
                ))}
              </ul>
              <EditListButton path={p('highlights')} value={overrides[p('highlights')] ?? encodeLines(item.highlights)} label="highlights (satu per baris)" />
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
