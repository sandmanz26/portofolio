import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import useReveal from "../hooks/useReveal.js";
import { CATEGORIES, fetchProducts } from "../data/products.js";
import { SITE } from "../data/site.js";

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);

  const categoryParam = searchParams.get("category");
  const category = CATEGORIES.includes(categoryParam) ? categoryParam : "All";

  useEffect(() => {
    document.title = `Catalog — ${SITE.name}`;
  }, []);

  useEffect(() => {
    fetchProducts(category).then(setProducts);
  }, [category]);

  useReveal([products]);

  function selectCategory(cat) {
    setSearchParams(cat === "All" ? {} : { category: cat });
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Catalog</p>
          <h1 className="page-hero__title">The collection.</h1>
          <p className="lead">
            Every piece is made in our Yogyakarta workshop from selected solid
            wood. In-stock pieces can leave the showroom with you today; the rest
            are made to order.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="filter-bar" role="group" aria-label="Category filter">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={"filter-btn" + (cat === category ? " is-active" : "")}
                onClick={() => selectCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <p className="catalog-count">
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </p>
          {products.length ? (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="catalog-empty">No products in this category yet.</p>
          )}
        </div>
      </section>

      <section className="section section--dark">
        <div className="container cta-band reveal">
          <p className="eyebrow">Can't find the right fit?</p>
          <h2 className="section-title">We also build custom furniture.</h2>
          <p className="lead">
            Dimensions, timber and finish — every detail tailored to your space.
          </p>
          <Link className="btn btn--inverse" to="/contact">Custom Consultation</Link>
        </div>
      </section>
    </>
  );
}
