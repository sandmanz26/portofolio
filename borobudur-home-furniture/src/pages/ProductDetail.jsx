import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import useReveal from "../hooks/useReveal.js";
import {
  fetchProduct,
  fetchRelatedProducts,
  formatPrice,
} from "../data/products.js";
import { SITE, whatsappLink } from "../data/site.js";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(undefined); // undefined = loading, null = not found
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    let active = true;
    fetchProduct(id).then((p) => {
      if (!active) return;
      setProduct(p);
      setActiveImage(0);
      if (p) {
        document.title = `${p.name} — ${SITE.name}`;
        fetchRelatedProducts(p).then((r) => active && setRelated(r));
      } else {
        document.title = `Product not found — ${SITE.name}`;
        setRelated([]);
      }
    });
    return () => {
      active = false;
    };
  }, [id]);

  useReveal([product, related]);

  if (product === undefined) {
    return <section className="section" style={{ paddingTop: "clamp(7rem,16vh,10rem)" }} />;
  }

  if (product === null) {
    return (
      <section className="section" style={{ paddingTop: "clamp(7rem,16vh,10rem)" }}>
        <div className="container">
          <div className="catalog-empty">
            <p>Product not found.</p>
            <p style={{ marginTop: "1.5rem" }}>
              <Link className="link-arrow" to="/catalog">Back to catalog</Link>
            </p>
          </div>
        </div>
      </section>
    );
  }

  const waMessage = `Hello ${SITE.brand}, I'm interested in the ${product.name} (${formatPrice(
    product.price
  )}). Could you tell me about its availability?`;

  const images = product.images || [];
  const mainImage = images[activeImage] || images[0];

  return (
    <>
      <section className="section" style={{ paddingTop: "clamp(7rem,16vh,10rem)" }}>
        <div className="container">
          <div className="product-detail">
            <div className="product-detail__media reveal">
              <div className="product-detail__media-frame">
                {mainImage ? (
                  <img src={mainImage} alt={product.name} />
                ) : (
                  <div className="product-detail__media-empty">No photo yet</div>
                )}
              </div>
              {images.length > 1 && (
                <div className="product-detail__thumbs">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      type="button"
                      className={"product-detail__thumb" + (i === activeImage ? " is-active" : "")}
                      onClick={() => setActiveImage(i)}
                      aria-label={`Show photo ${i + 1}`}
                    >
                      <img src={src} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="reveal">
              <nav className="breadcrumb" aria-label="Breadcrumb">
                <Link to="/">Home</Link>
                <span aria-hidden="true">/</span>
                <Link to="/catalog">Catalog</Link>
                <span aria-hidden="true">/</span>
                <Link to={"/catalog?category=" + product.category}>
                  {product.category}
                </Link>
              </nav>
              <h1 className="product-detail__title">{product.name}</h1>
              <p className="product-detail__price">{formatPrice(product.price)}</p>
              <div className="product-detail__desc" dangerouslySetInnerHTML={{ __html: product.description }} />
              <dl className="spec-list">
                <div><dt>Dimensions</dt><dd>{product.dimensions}</dd></div>
                <div><dt>Material</dt><dd>{product.material}</dd></div>
                <div><dt>Finish</dt><dd>{product.finish}</dd></div>
                <div><dt>Availability</dt><dd>{product.leadTime}</dd></div>
              </dl>
              <div className="product-detail__actions">
                <a
                  className="btn btn--solid"
                  href={whatsappLink(waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ask via WhatsApp
                </a>
                <Link className="btn" to="/contact">Request Custom</Link>
              </div>
              <p className="product-detail__note">
                Every piece is built from selected, kiln-dried solid wood. Colour
                and grain may differ slightly from the photos — that is the
                natural character of real timber.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--warm">
        <div className="container">
          <div className="section-head section-head--split">
            <div>
              <p className="eyebrow">Related</p>
              <h2 className="section-title">You may also like.</h2>
            </div>
            <Link className="link-arrow" to="/catalog">All Products &rarr;</Link>
          </div>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
