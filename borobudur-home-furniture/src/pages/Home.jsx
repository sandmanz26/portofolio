import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import useReveal from "../hooks/useReveal.js";
import { fetchFeaturedProducts } from "../data/products.js";
import { SITE, whatsappLink } from "../data/site.js";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1549497538-303791108f95?q=80&w=2000&auto=format&fit=crop";
const ABOUT_IMAGE =
  "https://images.unsplash.com/photo-1611021061285-16c871740efa?q=80&w=1200&auto=format&fit=crop";

const RANGES = [
  { category: "Seating", desc: "Lounge chairs, dining chairs, sofas and stools on solid teak frames." },
  { category: "Tables", desc: "Dining and coffee tables cut from single teak boards." },
  { category: "Bedroom", desc: "Beds, nightstands and wardrobes with calm, quiet lines." },
  { category: "Storage", desc: "Sideboards, consoles and shelving that keep things in order." },
];

const VALUES = [
  {
    title: "Solid Wood, No Shortcuts",
    desc: "Grade-A Javanese teak and mahogany, kiln-dried in-house to below 12% moisture so every piece stays true for decades.",
  },
  {
    title: "Honest Joinery",
    desc: "Mortise-and-tenon joints cut by hand, the way Javanese carpenters have built for generations. Screws are a last resort, never the structure.",
  },
  {
    title: "Responsibly Sourced",
    desc: "Timber from legal, plantation-grown Javanese forests — traceable from the log yard to your living room.",
  },
  {
    title: "Built Beyond Trends",
    desc: "Quiet designs and a 10-year structural guarantee. Furniture you keep, repair, and hand down — not replace.",
  },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    document.title = `${SITE.name} — Handcrafted in Yogyakarta`;
    fetchFeaturedProducts().then(setFeatured);
  }, []);

  useReveal([featured]);

  return (
    <>
      {/* ===== Hero ===== */}
      <section className="hero">
        <div className="hero__bg" aria-hidden="true">
          <img src={HERO_IMAGE} alt="" />
          <div className="hero__scrim"></div>
        </div>
        <div className="hero__inner">
          <p className="eyebrow" style={{ color: "rgba(250,250,248,0.55)" }}>
            Est. 2016 — Yogyakarta
          </p>
          <h1 className="hero__title">
            Solid wood, <em>made to last.</em>
          </h1>
          <div>
            <Link className="btn btn--inverse" to="/catalog">
              Explore the Collection
            </Link>
          </div>
          <div className="hero__meta">
            <span>Grade-A Teak</span>
            <span>Ready Stock &amp; Custom</span>
            <span>Showroom in Yogyakarta</span>
          </div>
        </div>
      </section>

      {/* ===== About ===== */}
      <section className="section" id="about">
        <div className="container">
          <div className="about-grid">
            <div className="reveal">
              <p className="eyebrow">About Us</p>
              <h2 className="section-title">A decade of working wood, patiently.</h2>
              <p className="lead" style={{ marginTop: "1.5rem" }}>
                Founded in 2016 in Yogyakarta, Borobudur Home Furniture grew from a
                small workshop into a manufacturer with its own showroom. Wood is
                where we are strongest: we select, dry, cut and join every board
                ourselves.
              </p>
              <p className="lead" style={{ marginTop: "1rem" }}>
                Visit the showroom and take a ready-made piece home the same day —
                or sit down with our team and have something custom built precisely
                for your space.
              </p>
              <div className="about-facts">
                <div className="fact reveal">
                  <p className="fact__number">10</p>
                  <p className="fact__label">Years of Craft</p>
                </div>
                <div className="fact reveal">
                  <p className="fact__number">500+</p>
                  <p className="fact__label">Custom Projects</p>
                </div>
                <div className="fact reveal">
                  <p className="fact__number">1</p>
                  <p className="fact__label">Showroom in Jogja</p>
                </div>
              </div>
            </div>
            <figure className="about-grid__figure reveal">
              <img src={ABOUT_IMAGE} alt="A craftsman's hands working solid wood" />
            </figure>
          </div>
        </div>
      </section>

      {/* ===== Values ===== */}
      <section className="section section--warm" id="values">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">What We Stand On</p>
            <h2 className="section-title">Wood first. Everything else follows.</h2>
          </div>
          <div className="values-grid">
            {VALUES.map((value, i) => (
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
              <p className="eyebrow">Product Range</p>
              <h2 className="section-title">Four lines, one design language.</h2>
            </div>
            <Link className="link-arrow" to="/catalog">All Products &rarr;</Link>
          </div>
          <ul className="range-list">
            {RANGES.map((range, i) => (
              <li key={range.category}>
                <Link className="range-item" to={"/catalog?category=" + range.category}>
                  <span className="range-item__index">{String(i + 1).padStart(2, "0")}</span>
                  <span className="range-item__name">{range.category}</span>
                  <span className="range-item__desc">{range.desc}</span>
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
              <p className="eyebrow">Featured</p>
              <h2 className="section-title">Selected pieces from the showroom.</h2>
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
          <p className="eyebrow">Custom Furniture</p>
          <h2 className="section-title">Have your own size or design? We build it.</h2>
          <p className="lead">
            From a single chair to furnishing an entire home — tell us what you
            need and our team will walk with you from sketch to installation.
          </p>
          <Link className="btn btn--solid" to="/contact">Start a Consultation</Link>
        </div>
      </section>

      {/* ===== Contact strip ===== */}
      <section className="section section--dark" id="contact">
        <div className="container">
          <div className="about-grid">
            <div className="reveal">
              <p className="eyebrow">Contact Us</p>
              <h2 className="section-title">Visit our showroom in Yogyakarta.</h2>
              <p className="lead" style={{ marginTop: "1.5rem" }}>
                Feel the grain and the weight of the joinery for yourself. The
                showroom is open every day, and our team is happy to help you
                choose.
              </p>
              <div style={{ marginTop: "2.5rem" }}>
                <Link className="btn btn--inverse" to="/contact">
                  Contact &amp; Directions
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
                  {SITE.address.street},<br />
                  {SITE.address.city}
                </p>
              </div>
              <div className="contact-block" style={{ borderTopColor: "var(--line-inverse)" }}>
                <h3 style={{ color: "rgba(250,250,248,0.45)" }}>Opening Hours</h3>
                <p>
                  {SITE.hours[0]}<br />
                  {SITE.hours[1]}
                </p>
              </div>
              <div className="contact-block" style={{ borderTopColor: "var(--line-inverse)" }}>
                <h3 style={{ color: "rgba(250,250,248,0.45)" }}>Get in Touch</h3>
                <p>
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                    {SITE.whatsappDisplay} (WhatsApp)
                  </a>
                  <br />
                  <a href={"mailto:" + SITE.email}>{SITE.email}</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
