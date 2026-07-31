import { useRef, useState } from "react";
import { fileToCompressedBlob, fileToCompressedDataUrl } from "../../utils/image.js";
import { supabase, isSupabaseConfigured } from "../../lib/supabaseClient.js";

const STORAGE_BUCKET = "product-photos";

/** Same bucket GalleryEditor uses — storage policies are per-bucket, not per-path, so no new bucket/policy is needed. */
async function uploadToSupabase(file, pathPrefix) {
  const blob = await fileToCompressedBlob(file);
  const path = `${pathPrefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, blob, {
    contentType: "image/jpeg",
    upsert: false,
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Single-image version of GalleryEditor — for one-off images like a
 * site logo rather than a product's photo array. Same upload path
 * (compress client-side, then Supabase Storage or a data URL) and
 * the same drag/drop + paste-URL affordances, just for exactly one
 * image with a Remove instead of reorder/cover controls.
 */
export default function ImageUploadField({ value, onChange, pathPrefix = "branding", placeholder }) {
  const [urlDraft, setUrlDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  async function addFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    setBusy(true);
    setError("");
    try {
      const url = isSupabaseConfigured
        ? await uploadToSupabase(file, pathPrefix)
        : await fileToCompressedDataUrl(file);
      onChange(url);
    } catch (e) {
      setError(e.message || "Couldn't process that image. Try a smaller file or a different format.");
    } finally {
      setBusy(false);
    }
  }

  function handleAddUrl(event) {
    event.preventDefault();
    const url = urlDraft.trim();
    if (!url) return;
    onChange(url);
    setUrlDraft("");
  }

  return (
    <div className="gallery-editor">
      {value ? (
        <div className="image-field__preview">
          <img src={value} alt="" />
          <button type="button" className="gallery-editor__remove" onClick={() => onChange("")}>
            Remove
          </button>
        </div>
      ) : (
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
            addFile(e.dataTransfer.files?.[0]);
          }}
        >
          <p>{busy ? "Processing image…" : placeholder || "Drag an image here, or click to browse"}</p>
          <p className="gallery-editor__hint">JPG or PNG. Resized automatically.</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              addFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>
      )}

      <form className="gallery-editor__url" onSubmit={handleAddUrl}>
        <input
          type="url"
          placeholder="Or paste an image URL…"
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
        />
        <button type="submit" className="btn">Use URL</button>
      </form>

      {error && <p className="admin-banner admin-banner--error">{error}</p>}
    </div>
  );
}
