import { useEffect } from "react";
import { Link } from "react-router-dom";
import { SITE } from "../data/site.js";

export default function NotFound() {
  useEffect(() => {
    document.title = `Page not found — ${SITE.name}`;
  }, []);

  return (
    <section className="section" style={{ paddingTop: "clamp(7rem,16vh,10rem)" }}>
      <div className="container">
        <div className="catalog-empty">
          <p className="eyebrow">404</p>
          <h1 className="section-title" style={{ margin: "0 auto 1.5rem" }}>
            This page doesn't exist.
          </h1>
          <Link className="link-arrow" to="/">Back to home</Link>
        </div>
      </div>
    </section>
  );
}
