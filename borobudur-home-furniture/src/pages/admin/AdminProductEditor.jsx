import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CATEGORIES, deleteProduct, fetchProduct, updateProduct } from "../../data/products.js";
import InlineText from "../../components/admin/InlineText.jsx";
import InlineSelect from "../../components/admin/InlineSelect.jsx";
import GalleryEditor from "../../components/admin/GalleryEditor.jsx";
import ProductCard from "../../components/ProductCard.jsx";

const REAL_CATEGORIES = CATEGORIES.filter((c) => c !== "All");

export default function AdminProductEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(undefined);
  const [error, setError] = useState("");

  async function refresh() {
    const p = await fetchProduct(id);
    setProduct(p);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function save(patch) {
    try {
      const updated = await updateProduct(id, patch);
      setProduct(updated);
      setError("");
    } catch (e) {
      setError(e.message || "Couldn't save that change.");
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    await deleteProduct(id);
    navigate("/admin");
  }

  if (product === undefined) return <p className="admin-loading">Loading…</p>;

  if (product === null) {
    return (
      <div className="admin-page">
        <p>Product not found.</p>
        <Link to="/admin" className="admin-editor__back">&larr; All products</Link>
      </div>
    );
  }

  return (
    <div className="admin-page admin-editor">
      <Link to="/admin" className="admin-editor__back">&larr; All products</Link>

      {error && <p className="admin-banner admin-banner--error">{error}</p>}

      <div className="admin-editor__grid">
        <div>
          <InlineText value={product.name} onSave={(v) => save({ name: v })} big />

          <section className="admin-fieldset">
            <h2>Details</h2>
            <div className="admin-fieldset__row">
              <label>
                Category
                <InlineSelect
                  value={product.category}
                  options={REAL_CATEGORIES}
                  onSave={(v) => save({ category: v })}
                />
              </label>
              <label>
                Price (Rp)
                <InlineText
                  type="number"
                  value={product.price}
                  onSave={(v) => save({ price: Number(v) || 0 })}
                />
              </label>
              <label>
                Tag
                <InlineText
                  value={product.tag || ""}
                  placeholder="e.g. Best Seller"
                  onSave={(v) => save({ tag: v.trim() || null })}
                />
              </label>
              <label className="admin-fieldset__checkbox">
                <input
                  type="checkbox"
                  checked={product.featured}
                  onChange={(e) => save({ featured: e.target.checked })}
                />
                Featured on homepage
              </label>
            </div>
          </section>

          <section className="admin-fieldset">
            <h2>Gallery</h2>
            <GalleryEditor images={product.images} onChange={(images) => save({ images })} productId={product.id} />
          </section>

          <section className="admin-fieldset">
            <h2>Copy</h2>
            <label className="admin-field-block">
              Short description (used on cards)
              <InlineText textarea rows={2} value={product.short} onSave={(v) => save({ short: v })} />
            </label>
            <label className="admin-field-block">
              Full description
              <InlineText textarea rows={5} value={product.description} onSave={(v) => save({ description: v })} />
            </label>
          </section>

          <section className="admin-fieldset">
            <h2>Specifications</h2>
            <div className="admin-fieldset__row">
              <label>
                Dimensions
                <InlineText value={product.dimensions} onSave={(v) => save({ dimensions: v })} />
              </label>
              <label>
                Material
                <InlineText value={product.material} onSave={(v) => save({ material: v })} />
              </label>
              <label>
                Finish
                <InlineText value={product.finish} onSave={(v) => save({ finish: v })} />
              </label>
              <label>
                Availability
                <InlineText value={product.leadTime} onSave={(v) => save({ leadTime: v })} />
              </label>
            </div>
          </section>

          <button type="button" className="admin-delete" onClick={handleDelete}>
            Delete this product
          </button>
        </div>

        <aside className="admin-editor__preview">
          <p className="admin-editor__preview-label">Live preview</p>
          <div className="admin-editor__preview-card" onClickCapture={(e) => e.preventDefault()}>
            <ProductCard product={product} />
          </div>
          <Link className="link-arrow" to={`/product/${product.id}`} target="_blank" rel="noopener noreferrer">
            View public page &#8599;
          </Link>
        </aside>
      </div>
    </div>
  );
}
