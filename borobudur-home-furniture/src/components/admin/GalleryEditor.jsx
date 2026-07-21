import { useRef, useState } from "react";
import { fileToCompressedBlob, fileToCompressedDataUrl } from "../../utils/image.js";
import { supabase, isSupabaseConfigured } from "../../lib/supabaseClient.js";

const STORAGE_BUCKET = "product-photos";

/** Uploads to Supabase Storage and returns the public URL (see supabase/schema.sql for the bucket + policies this expects). */
async function uploadToSupabase(file, productId) {
  const blob = await fileToCompressedBlob(file);
  const path = `${productId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, blob, {
    contentType: "image/jpeg",
    upsert: false,
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Drag-and-drop / click-to-browse photo manager for a single
 * product. Every upload is resized and re-encoded client-side first
 * (see utils/image.js): when Supabase Storage is configured, the
 * compressed photo is uploaded there and only its public URL is
 * kept; otherwise (no backend yet) it's embedded directly as a data
 * URL. An image URL can also be pasted directly (handy for reusing
 * stock photography either way). Reordering is done with left/right
 * buttons rather than drag handles, which is simpler and more
 * reliable across touch and desktop alike.
 */
export default function GalleryEditor({ images, onChange, productId }) {
  const [urlDraft, setUrlDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  async function addFiles(fileList) {
    const files = Array.from(fileList || []).filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;
    setBusy(true);
    setError("");
    try {
      const urls = isSupabaseConfigured
        ? await Promise.all(files.map((f) => uploadToSupabase(f, productId)))
        : await Promise.all(files.map((f) => fileToCompressedDataUrl(f)));
      onChange([...images, ...urls]);
    } catch (e) {
      setError(e.message || "Couldn't process one of those images. Try a smaller file or a different format.");
    } finally {
      setBusy(false);
    }
  }

  function handleAddUrl(event) {
    event.preventDefault();
    const url = urlDraft.trim();
    if (!url) return;
    onChange([...images, url]);
    setUrlDraft("");
  }

  function moveImage(index, dir) {
    const target = index + dir;
    if (target < 0 || target >= images.length) return;
    const next = images.slice();
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function makeCover(index) {
    if (index === 0) return;
    const next = images.slice();
    const [item] = next.splice(index, 1);
    next.unshift(item);
    onChange(next);
  }

  function removeImage(index) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div className="gallery-editor">
      <div
        className={"gallery-editor__drop" + (dragOver ? " is-dragover" : "")}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        role="button"
        tabIndex={0}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
      >
        <p>{busy ? "Processing photos…" : "Drag photos here, or click to browse"}</p>
        <p className="gallery-editor__hint">JPG or PNG. Resized automatically.</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <form className="gallery-editor__url" onSubmit={handleAddUrl}>
        <input
          type="url"
          placeholder="Or paste an image URL…"
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
        />
        <button type="submit" className="btn">Add</button>
      </form>

      {error && <p className="admin-banner admin-banner--error">{error}</p>}

      {images.length === 0 ? (
        <p className="gallery-editor__empty">
          No photos yet — add at least one so this piece can appear in the catalog.
        </p>
      ) : (
        <ul className="gallery-editor__grid">
          {images.map((src, i) => (
            <li key={i} className="gallery-editor__item">
              {i === 0 && <span className="gallery-editor__cover-badge">Cover</span>}
              <img src={src} alt={`Photo ${i + 1}`} />
              <div className="gallery-editor__item-actions">
                <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0} aria-label="Move earlier">
                  &larr;
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(i, 1)}
                  disabled={i === images.length - 1}
                  aria-label="Move later"
                >
                  &rarr;
                </button>
                {i !== 0 && (
                  <button type="button" onClick={() => makeCover(i)}>
                    Set cover
                  </button>
                )}
                <button type="button" onClick={() => removeImage(i)} className="gallery-editor__remove">
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
