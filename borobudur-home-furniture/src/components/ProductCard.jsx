import { Link } from "react-router-dom";
import { formatPrice, coverImage } from "../data/products.js";

export default function ProductCard({ product }) {
  const cover = coverImage(product);
  return (
    <Link className="product-card reveal" to={"/product/" + product.id}>
      <div className="product-card__media">
        {product.tag && <span className="product-card__tag">{product.tag}</span>}
        {cover ? (
          <img src={cover} alt={product.name} />
        ) : (
          <div className="product-card__media-empty">No photo yet</div>
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
