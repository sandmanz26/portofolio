import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import useReveal from "../hooks/useReveal.js";
import { fetchFeaturedProducts } from "../data/products.js";
import { SITE, whatsappLink } from "../data/site.js";
import { useContent } from "../context/ContentContext.jsx";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const content = useContent();
  const hero = content.home_hero;
  const about = content.home_about;
  const values = content.home_values;
  const range = content.home_range;
  const featuredHead = content.home_featured;
  const cta = content.home_cta;
  const contactStrip = content.home_contact;
  const site = content.site_settings;

  useEffect(() => {
    document.title = `${SITE.name} — Handcrafted in Yogyakarta`;
    fetchFeaturedProducts().then(setFeatured);
  }, []);

  useReveal([featured, content]);

  return (
    <>
      {/* ===== Hero ===== */}
      <section className="hero">
        <div className="hero__bg" aria-hidden="true">
          <img src={hero.backgroundImage} alt="" />
          <div className="hero__scrim"></div>
        </div>
        <div className="hero__inner">
          <p className="eyebrow" style={{ color: "rgba(250,250,248,0.55)" }}>
            {hero.eyebrow}
          </p>
          <h1 className="hero__title">
            {hero.title} <em>{hero.titleEmphasis}</em>
          </h1>
          <div>
            <Link className="btn btn--inverse" to="/catalog">
              {hero.ctaLabel}
            </Link>
          </div>
          <div className="hero__meta">
            {hero.metaItems.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== About ===== */}
      <section className="section" id="about">
        <div className="container">
          <div className="about-grid">
            <div className="reveal">
              <p className="eyebrow">{about.eyebrow}</p>
              <h2 className="section-title">{about.title}</h2>
              <p className="lead" style={{ marginTop: "1.5rem" }}>
                {about.paragraph1}
              </p>
              <p className="lead" style={{ marginTop: "1rem" }}>
                {about.paragraph2}
              </p>
              <div className="about-facts">
                {about.facts.map((fact) => (
                  <div className="fact reveal" key={fact.label}>
                    <p className="fact__number">{fact.number}</p>
                    <p className="fact__label">{fact.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <figure className="about-grid__figure reveal">
              <img src={about.image} alt="A craftsman's hands working solid wood" />
            </figure>
          </div>
        </div>
      </section>

      {/* ===== Values ===== */}
      <section className="section section--warm" id="values">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">{values.eyebrow}</p>
            <h2 className="section-title">{values.title}</h2>
          </div>
          <div className="values-grid">
            {values.items.map((value, i) => (
              <div className="value-card reveal" key={value.title}>
                <p className="value-card__index">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="value-card__title">{value.title}</h3>
                <p className="value-card__desc">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Product range ===== */}
      <section className="section section--dark" id="range">
        <div className="container">
          <div className="section-head section-head--split">
            <div>
              <p className="eyebrow">{range.eyebrow}</p>
              <h2 className="section-title">{range.title}</h2>
            </div>
            <Link className="link-arrow" to="/catalog">All Products &rarr;</Link>
          </div>
          <ul className="range-list">
            {range.items.map((item, i) => (
              <li key={item.category}>
                <Link className="range-item" to={"/catalog?category=" + item.category}>
                  <span className="range-item__index">{String(i + 1).padStart(2, "0")}</span>
                  <span className="range-item__name">{item.category}</span>
                  <span className="range-item__desc">{item.desc}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== Featured products ===== */}
      <section className="section" id="featured">
        <div className="container">
          <div className="section-head section-head--split">
            <div>
              <p className="eyebrow">{featuredHead.eyebrow}</p>
              <h2 className="section-title">{featuredHead.title}</h2>
            </div>
            <Link className="link-arrow" to="/catalog">View Catalog &rarr;</Link>
          </div>
          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Custom CTA ===== */}
      <section className="section section--warm">
        <div className="container cta-band reveal">
          <p className="eyebrow">{cta.eyebrow}</p>
          <h2 className="section-title">{cta.title}</h2>
          <p className="lead">{cta.paragraph}</p>
          <Link className="btn btn--solid" to="/contact">{cta.buttonLabel}</Link>
        </div>
      </section>

      {/* ===== Contact strip ===== */}
      <section className="section section--dark" id="contact">
        <div className="container">
          <div className="about-grid">
            <div className="reveal">
              <p className="eyebrow">{contactStrip.eyebrow}</p>
              <h2 className="section-title">{contactStrip.title}</h2>
              <p className="lead" style={{ marginTop: "1.5rem" }}>
                {contactStrip.paragraph}
              </p>
              <div style={{ marginTop: "2.5rem" }}>
                <Link className="btn btn--inverse" to="/contact">
                  {contactStrip.buttonLabel}
                </Link>
              </div>
            </div>
            <div
              className="reveal"
              style={{
                borderLeft: "1px solid var(--line-inverse)",
                paddingLeft: "clamp(1.5rem,4vw,3rem)",
              }}
            >
              <div className="contact-block">
                <h3 style={{ color: "rgba(250,250,248,0.45)" }}>Showroom</h3>
                <p>
                  {site.addressStreet},<br />
                  {site.addressCity}
                </p>
              </div>
              <div className="contact-block" style={{ borderTopColor: "var(--line-inverse)" }}>
                <h3 style={{ color: "rgba(250,250,248,0.45)" }}>Opening Hours</h3>
                <p>
                  {site.hours[0]}<br />
                  {site.hours[1]}
                </p>
              </div>
              <div className="contact-block" style={{ borderTopColor: "var(--line-inverse)" }}>
                <h3 style={{ color: "rgba(250,250,248,0.45)" }}>Get in Touch</h3>
                <p>
                  <a href={whatsappLink(undefined, site.whatsappNumber)} target="_blank" rel="noopener noreferrer">
                    {site.whatsappDisplay} (WhatsApp)
                  </a>
                  <br />
                  <a href={"mailto:" + site.email}>{site.email}</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
