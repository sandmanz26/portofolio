import { useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice, coverImage } from "../data/products.js";
import { useCart } from "../context/CartContext.jsx";

/** Set interactive={false} for read-only previews (e.g. the admin editor's live preview) — hides Add to Cart. */
export default function ProductCard({ product, interactive = true }) {
  const cover = coverImage(product);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAddToCart(event) {
    event.preventDefault();
    event.stopPropagation();
    addToCart(product.id, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Link className="product-card reveal" to={"/product/" + product.id}>
      <div className="product-card__media">
        {product.tag && <span className="product-card__tag">{product.tag}</span>}
        {cover ? (
          <img src={cover} alt={product.name} />
        ) : (
          <div className="product-card__media-empty">No photo yet</div>
        )}
        {interactive && (
          <button
            type="button"
            className={"product-card__add" + (added ? " is-added" : "")}
            onClick={handleAddToCart}
          >
            {added ? "Added ✓" : "Add to Cart"}
          </button>
        )}
      </div>
      <div className="product-card__body">
        <div>
          <h3 className="product-card__name">{product.name}</h3>
          <p className="product-card__cat">{product.category}</p>
        </div>
        <p className="product-card__price">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
