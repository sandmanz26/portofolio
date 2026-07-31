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
import SaveCancelBar from "../../components/admin/SaveCancelBar.jsx";

const REAL_CATEGORIES = CATEGORIES.filter((c) => c !== "All");

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [drafts, setDrafts] = useState({}); // { [productId]: partialPatch }
  const navigate = useNavigate();

  async function refresh() {
    const data = await fetchProducts("All");
    setProducts(data);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  function fieldValue(product, key) {
    return drafts[product.id]?.[key] ?? product[key];
  }

  function setField(id, key, value) {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], [key]: value } }));
  }

  function clearDraft(id) {
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  async function handleSaveRow(id) {
    const patch = { ...drafts[id] };
    if ("tag" in patch) patch.tag = (patch.tag || "").trim() || null;
    if ("price" in patch) patch.price = Number(patch.price) || 0;
    try {
      await updateProduct(id, patch);
      clearDraft(id);
      setError("");
      await refresh();
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  }

  async function handleAdd() {
    const product = await createProduct({});
    navigate(`/admin/products/${product.id}`);
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? This can't be undone.`)) return;
    clearDraft(id);
    await deleteProduct(id);
    refresh();
  }

  async function handleReset() {
    if (!window.confirm("Reset all products back to the original demo catalog? Your edits will be lost.")) return;
    setDrafts({});
    await resetProducts();
    refresh();
  }

  if (loading) return <p className="admin-loading">Loading…</p>;

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1>Products</h1>
          <p>{products.length} total — edit a row, then Save or Cancel.</p>
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
            {products.map((p) => {
              const dirty = Boolean(drafts[p.id]);
              return (
                <tr key={p.id} className={dirty ? "is-dirty" : undefined}>
                  <td>
                    <Link to={`/admin/products/${p.id}`} className="admin-table__thumb">
                      {coverImage(p) ? <img src={coverImage(p)} alt="" /> : <span>No photo</span>}
                    </Link>
                  </td>
                  <td>
                    <InlineText value={fieldValue(p, "name")} onChange={(v) => setField(p.id, "name", v)} />
                  </td>
                  <td>
                    <InlineSelect
                      value={fieldValue(p, "category")}
                      options={REAL_CATEGORIES}
                      onChange={(v) => setField(p.id, "category", v)}
                    />
                  </td>
                  <td>
                    <InlineText
                      type="number"
                      value={fieldValue(p, "price")}
                      onChange={(v) => setField(p.id, "price", v)}
                    />
                  </td>
                  <td>
                    <InlineText
                      value={fieldValue(p, "tag") || ""}
                      placeholder="—"
                      onChange={(v) => setField(p.id, "tag", v)}
                    />
                  </td>
                  <td className="admin-table__center">
                    <input
                      type="checkbox"
                      checked={fieldValue(p, "featured")}
                      onChange={(e) => setField(p.id, "featured", e.target.checked)}
                    />
                  </td>
                  <td className="admin-table__actions">
                    <SaveCancelBar
                      dirty={dirty}
                      onSave={() => handleSaveRow(p.id)}
                      onCancel={() => clearDraft(p.id)}
                      compact
                    />
                    <Link to={`/admin/products/${p.id}`}>Edit gallery &rarr;</Link>
                    <button type="button" onClick={() => handleDelete(p.id, p.name)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
