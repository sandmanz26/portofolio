import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CATEGORIES,
  coverImage,
  createProduct,
  deleteProduct,
  fetchProducts,
  isPersistenceAvailable,
  resetProducts,
  updateProduct,
} from "../../data/products.js";
import InlineText from "../../components/admin/InlineText.jsx";
import InlineSelect from "../../components/admin/InlineSelect.jsx";

const REAL_CATEGORIES = CATEGORIES.filter((c) => c !== "All");

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function refresh() {
    const data = await fetchProducts("All");
    setProducts(data);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleField(id, patch) {
    try {
      await updateProduct(id, patch);
      setError("");
    } catch (e) {
      setError(e.message);
    }
    refresh();
  }

  async function handleAdd() {
    const product = await createProduct({});
    navigate(`/admin/products/${product.id}`);
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? This can't be undone.`)) return;
    await deleteProduct(id);
    refresh();
  }

  async function handleReset() {
    if (!window.confirm("Reset all products back to the original demo catalog? Your edits will be lost.")) return;
    await resetProducts();
    refresh();
  }

  if (loading) return <p className="admin-loading">Loading…</p>;

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1>Products</h1>
          <p>{products.length} total — click any field to edit, changes save automatically.</p>
        </div>
        <div className="admin-page__actions">
          <button className="btn" type="button" onClick={handleReset}>Reset demo data</button>
          <button className="btn btn--solid" type="button" onClick={handleAdd}>+ Add product</button>
        </div>
      </div>

      {!isPersistenceAvailable() && (
        <p className="admin-banner admin-banner--warn">
          Local storage isn't available in this browser — your changes will be lost on reload.
        </p>
      )}
      {error && <p className="admin-banner admin-banner--error">{error}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Category</th>
              <th>Price (Rp)</th>
              <th>Tag</th>
              <th>Featured</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <Link to={`/admin/products/${p.id}`} className="admin-table__thumb">
                    {coverImage(p) ? <img src={coverImage(p)} alt="" /> : <span>No photo</span>}
                  </Link>
                </td>
                <td>
                  <InlineText value={p.name} onSave={(v) => handleField(p.id, { name: v })} />
                </td>
                <td>
                  <InlineSelect
                    value={p.category}
                    options={REAL_CATEGORIES}
                    onSave={(v) => handleField(p.id, { category: v })}
                  />
                </td>
                <td>
                  <InlineText
                    type="number"
                    value={p.price}
                    onSave={(v) => handleField(p.id, { price: Number(v) || 0 })}
                  />
                </td>
                <td>
                  <InlineText
                    value={p.tag || ""}
                    placeholder="—"
                    onSave={(v) => handleField(p.id, { tag: v.trim() || null })}
                  />
                </td>
                <td className="admin-table__center">
                  <input
                    type="checkbox"
                    checked={p.featured}
                    onChange={(e) => handleField(p.id, { featured: e.target.checked })}
                  />
                </td>
                <td className="admin-table__actions">
                  <Link to={`/admin/products/${p.id}`}>Edit gallery &rarr;</Link>
                  <button type="button" onClick={() => handleDelete(p.id, p.name)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
