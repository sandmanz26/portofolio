import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CATEGORIES, deleteProduct, fetchProduct, updateProduct } from "../../data/products.js";
import InlineText from "../../components/admin/InlineText.jsx";
import InlineSelect from "../../components/admin/InlineSelect.jsx";
import GalleryEditor from "../../components/admin/GalleryEditor.jsx";
import RichTextEditor from "../../components/admin/RichTextEditor.jsx";
import SaveCancelBar from "../../components/admin/SaveCancelBar.jsx";
import ProductCard from "../../components/ProductCard.jsx";

const REAL_CATEGORIES = CATEGORIES.filter((c) => c !== "All");

export default function AdminProductEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(undefined);
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState("");

  async function refresh() {
    const p = await fetchProduct(id);
    setProduct(p);
    setDraft(p);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function setField(key, value) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  const dirty = product && draft && JSON.stringify(product) !== JSON.stringify(draft);

  async function handleSave() {
    const patch = {
      ...draft,
      price: Number(draft.price) || 0,
      tag: (draft.tag || "").trim() || null,
    };
    try {
      const updated = await updateProduct(id, patch);
      setProduct(updated);
      setDraft(updated);
      setError("");
      return true;
    } catch (e) {
      setError(e.message || "Couldn't save that change.");
      return false;
    }
  }

  function handleCancel() {
    setDraft(product);
    setError("");
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

      <div className="save-bar-dock">
        <SaveCancelBar dirty={Boolean(dirty)} onSave={handleSave} onCancel={handleCancel} />
      </div>

      {error && <p className="admin-banner admin-banner--error">{error}</p>}

      <div className="admin-editor__grid">
        <div>
          <InlineText value={draft.name} onChange={(v) => setField("name", v)} big />

          <section className="admin-fieldset">
            <h2>Details</h2>
            <div className="admin-fieldset__row">
              <label>
                Category
                <InlineSelect
                  value={draft.category}
                  options={REAL_CATEGORIES}
                  onChange={(v) => setField("category", v)}
                />
              </label>
              <label>
                Price (Rp)
                <InlineText type="number" value={draft.price} onChange={(v) => setField("price", v)} />
              </label>
              <label>
                Tag
                <InlineText
                  value={draft.tag || ""}
                  placeholder="e.g. Best Seller"
                  onChange={(v) => setField("tag", v)}
                />
              </label>
              <label className="admin-fieldset__checkbox">
                <input
                  type="checkbox"
                  checked={draft.featured}
                  onChange={(e) => setField("featured", e.target.checked)}
                />
                Featured on homepage
              </label>
            </div>
          </section>

          <section className="admin-fieldset">
            <h2>Gallery</h2>
            <GalleryEditor images={draft.images} onChange={(images) => setField("images", images)} productId={product.id} />
          </section>

          <section className="admin-fieldset">
            <h2>Copy</h2>
            <label className="admin-field-block">
              Short description (used on cards)
              <InlineText textarea rows={2} value={draft.short} onChange={(v) => setField("short", v)} />
            </label>
            <div className="admin-field-block">
              <p className="admin-field-block__label">Full description</p>
              <RichTextEditor
                value={draft.description}
                onChange={(html) => setField("description", html)}
                placeholder="Full product description..."
              />
            </div>
          </section>

          <section className="admin-fieldset">
            <h2>Specifications</h2>
            <div className="admin-fieldset__row">
              <label>
                Dimensions
                <InlineText value={draft.dimensions} onChange={(v) => setField("dimensions", v)} />
              </label>
              <label>
                Material
                <InlineText value={draft.material} onChange={(v) => setField("material", v)} />
              </label>
              <label>
                Finish
                <InlineText value={draft.finish} onChange={(v) => setField("finish", v)} />
              </label>
              <label>
                Availability
                <InlineText value={draft.leadTime} onChange={(v) => setField("leadTime", v)} />
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
            <ProductCard product={draft} interactive={false} />
          </div>
          <Link className="link-arrow" to={`/product/${product.id}`} target="_blank" rel="noopener noreferrer">
            View public page &#8599;
          </Link>
        </aside>
      </div>
    </div>
  );
}
