import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useContent } from "../context/ContentContext.jsx";
import { fetchProduct, formatPrice, coverImage } from "../data/products.js";
import { SITE, whatsappLink } from "../data/site.js";
import useReveal from "../hooks/useReveal.js";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();
  const site = useContent().site_settings;
  const [lines, setLines] = useState(null); // [{ product, quantity }]
  const [status, setStatus] = useState("");

  useEffect(() => {
    document.title = `Your Cart — ${SITE.name}`;
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all(
      items.map((item) => fetchProduct(item.productId).then((product) => ({ product, quantity: item.quantity })))
    ).then((resolved) => {
      if (active) setLines(resolved.filter((l) => l.product));
    });
    return () => {
      active = false;
    };
  }, [items]);

  useReveal([lines]);

  const total = (lines || []).reduce((sum, l) => sum + l.product.price * l.quantity, 0);

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const itemLines = lines.map(
      (l, i) => `${i + 1}. ${l.product.name} x${l.quantity} — ${formatPrice(l.product.price * l.quantity)}`
    );

    const messageLines = [
      `Hello ${SITE.brand}, my name is ${data.get("name")}.`,
      "I'd like to request pricing and an invoice for:",
      "",
      ...itemLines,
      "",
      `Estimated total: ${formatPrice(total)}`,
      "",
      data.get("notes") ? `Notes: ${data.get("notes")}` : null,
      data.get("notes") ? "" : null,
      `Contact: ${data.get("email")}${data.get("phone") ? " / " + data.get("phone") : ""}`,
    ].filter((line) => line !== null);

    window.open(whatsappLink(messageLines.join("\n"), site.whatsappNumber), "_blank", "noopener");
    setStatus(
      `Thank you, ${data.get("name")}. Your invoice request is opening in WhatsApp — ` +
        "our team usually replies within one working day."
    );
  }

  if (lines === null) {
    return <section className="section" style={{ paddingTop: "clamp(7rem,16vh,10rem)" }} />;
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Your Cart</p>
          <h1 className="page-hero__title">Ready when you are.</h1>
          <p className="lead">
            Review your selection, then request pricing and an invoice — our
            team follows up over WhatsApp with a formal quote.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {lines.length === 0 ? (
            <div className="catalog-empty">
              <p>Your cart is empty.</p>
              <p style={{ marginTop: "1.5rem" }}>
                <Link className="link-arrow" to="/catalog">Browse the Catalog &rarr;</Link>
              </p>
            </div>
          ) : (
            <div className="cart-layout">
              <div className="cart-items reveal">
                {lines.map(({ product, quantity }) => (
                  <div className="cart-item" key={product.id}>
                    <Link to={`/product/${product.id}`} className="cart-item__media">
                      {coverImage(product) ? (
                        <img src={coverImage(product)} alt={product.name} />
                      ) : (
                        <div className="product-card__media-empty">No photo</div>
                      )}
                    </Link>
                    <div className="cart-item__body">
                      <Link to={`/product/${product.id}`} className="cart-item__name">
                        {product.name}
                      </Link>
                      <p className="cart-item__cat">{product.category}</p>
                      <p className="cart-item__unit-price">{formatPrice(product.price)} each</p>
                    </div>
                    <div className="qty-stepper">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        &minus;
                      </button>
                      <span>{quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        &#43;
                      </button>
                    </div>
                    <p className="cart-item__subtotal">{formatPrice(product.price * quantity)}</p>
                    <button
                      type="button"
                      className="cart-item__remove"
                      onClick={() => removeFromCart(product.id)}
                      aria-label={`Remove ${product.name}`}
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <div className="cart-summary">
                  <button type="button" className="link-arrow" onClick={clearCart}>
                    Clear Cart
                  </button>
                  <p className="cart-summary__total">
                    Estimated total <span>{formatPrice(total)}</span>
                  </p>
                </div>
              </div>

              <div className="cart-request reveal">
                <h2 className="section-title" style={{ fontSize: "1.5rem" }}>Request Invoice</h2>
                <p className="lead" style={{ fontSize: "0.9375rem", marginTop: "0.75rem" }}>
                  Send us your details — we'll open WhatsApp with your cart
                  already written out, and follow up with a formal price
                  and invoice.
                </p>
                <form className="contact-form" style={{ marginTop: "1.5rem" }} onSubmit={handleSubmit}>
                  <div className="form-field">
                    <label htmlFor="cart-name">Name</label>
                    <input id="cart-name" name="name" type="text" required autoComplete="name" />
                  </div>
                  <div className="form-field">
                    <label htmlFor="cart-email">Email</label>
                    <input id="cart-email" name="email" type="email" required autoComplete="email" />
                  </div>
                  <div className="form-field">
                    <label htmlFor="cart-phone">Phone / WhatsApp (optional)</label>
                    <input id="cart-phone" name="phone" type="tel" autoComplete="tel" />
                  </div>
                  <div className="form-field">
                    <label htmlFor="cart-notes">Notes (optional)</label>
                    <textarea id="cart-notes" name="notes" placeholder="Delivery address, timeline, custom requests..."></textarea>
                  </div>
                  {status && (
                    <p className="form-status is-visible" role="status">{status}</p>
                  )}
                  <div>
                    <button className="btn btn--solid" type="submit">Request Invoice via WhatsApp</button>
                  </div>
                  <p className="product-detail__note">
                    This opens WhatsApp with your cart and details already
                    written — nothing is stored on this website.
                  </p>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
