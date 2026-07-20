import { Link } from "react-router-dom";
import { SITE } from "../data/site.js";
import { CATEGORIES } from "../data/products.js";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <span className="brand__mark">{SITE.brand}</span>
            <p>{SITE.tagline}</p>
          </div>
          <div>
            <h4>Menu</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/catalog">Catalog</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4>Collections</h4>
            <ul>
              {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                <li key={cat}>
                  <Link to={"/catalog?category=" + cat}>{cat}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Showroom</h4>
            <ul>
              <li>{SITE.address.street}</li>
              <li>{SITE.address.city}</li>
            </ul>
          </div>
        </div>
        <div className="site-footer__bottom">
          <p>
            &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p>Handcrafted in Yogyakarta.</p>
        </div>
      </div>
    </footer>
  );
}
