/* ============================================================
   Client-side image resize/compress for the gallery uploader.

   There is no file storage backend yet, so uploaded photos are
   downscaled and re-encoded as JPEG data URLs and kept in the
   product record itself (persisted to localStorage — see
   data/products.js). When Supabase Storage is wired in, swap the
   call site in GalleryEditor for an actual upload and store the
   returned public URL instead.
   ============================================================ */

export function fileToCompressedDataUrl(file, { maxDimension = 1280, quality = 0.78 } = {}) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error || new Error("Could not read file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not decode image"));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          const scale = maxDimension / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
