import { Link } from "react-router-dom";
import { CATEGORIES } from "../data/products.js";
import { useContent } from "../context/ContentContext.jsx";

export default function Footer() {
  const content = useContent();
  const branding = content.site_branding;
  const site = content.site_settings;

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            {branding.logoImage ? (
              <img className="brand__logo brand__logo--footer" src={branding.logoImage} alt={branding.brandName} />
            ) : (
              <span className="brand__mark">{branding.brandMark}</span>
            )}
            <p>{site.tagline}</p>
          </div>
          <div>
            <h4>Menu</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/catalog">Catalog</Link></li>
              <li><Link to="/cart">Your Cart</Link></li>
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
              <li>{site.addressStreet}</li>
              <li>{site.addressCity}</li>
            </ul>
          </div>
        </div>
        <div className="site-footer__bottom">
          <p>
            &copy; {new Date().getFullYear()} {branding.brandName}. All rights reserved.
          </p>
          <p>{branding.footerNote}</p>
        </div>
      </div>
    </footer>
  );
}
