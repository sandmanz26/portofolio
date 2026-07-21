/* ============================================================
   Client-side image resize/compress for the gallery uploader.

   Two output modes share the same resize step:
   - fileToCompressedDataUrl: used when there is no storage backend
     (Supabase not configured) — the resized JPEG is embedded directly
     in the product record as a data URL and persisted to localStorage.
   - fileToCompressedBlob: used when Supabase Storage IS configured —
     the resized JPEG is uploaded as a Blob and only its public URL is
     stored on the product record.
   See GalleryEditor.jsx for where these are chosen.
   ============================================================ */

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error || new Error("Could not read file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not decode image"));
      img.onload = () => resolve(img);
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function drawToCanvas(img, maxDimension) {
  let { width, height } = img;
  if (width > maxDimension || height > maxDimension) {
    const scale = maxDimension / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d").drawImage(img, 0, 0, width, height);
  return canvas;
}

export async function fileToCompressedDataUrl(file, { maxDimension = 1280, quality = 0.78 } = {}) {
  const img = await loadImageFromFile(file);
  const canvas = drawToCanvas(img, maxDimension);
  return canvas.toDataURL("image/jpeg", quality);
}

export async function fileToCompressedBlob(file, { maxDimension = 1600, quality = 0.82 } = {}) {
  const img = await loadImageFromFile(file);
  const canvas = drawToCanvas(img, maxDimension);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not encode image"))),
      "image/jpeg",
      quality
    );
  });
}
