// Loads a candidate image URL off-DOM and checks it against the rules
// defined for that slot (min resolution, aspect ratio), the "size /
// aturan" validation the inline editor shows before an image is saved.
export function probeImage(url, rules = {}) {
  return new Promise((resolve) => {
    if (!url) {
      resolve({ ok: false, message: 'Masukkan URL gambar terlebih dahulu.' });
      return;
    }
    const im = new Image();
    const timeout = setTimeout(() => {
      resolve({ ok: false, message: 'Waktu cek gambar habis — pastikan URL benar dan dapat diakses publik.' });
    }, 8000);

    im.onload = () => {
      clearTimeout(timeout);
      const w = im.naturalWidth;
      const h = im.naturalHeight;
      const problems = [];

      if (rules.minWidth && w < rules.minWidth) problems.push(`lebar ${w}px, minimal ${rules.minWidth}px`);
      if (rules.minHeight && h < rules.minHeight) problems.push(`tinggi ${h}px, minimal ${rules.minHeight}px`);

      if (rules.aspect) {
        const [aw, ah] = rules.aspect.split(':').map(Number);
        if (aw && ah) {
          const target = aw / ah;
          const actual = w / h;
          if (Math.abs(actual - target) / target > 0.15) {
            problems.push(`rasio ${w}:${h} jauh dari target ${rules.aspect}`);
          }
        }
      }

      if (problems.length) {
        resolve({ ok: false, message: `${w}×${h}px — ${problems.join('; ')}` });
      } else {
        resolve({ ok: true, message: `${w}×${h}px — sesuai aturan ukuran` });
      }
    };

    im.onerror = () => {
      clearTimeout(timeout);
      resolve({ ok: false, message: 'Gambar gagal dimuat — pastikan URL menunjuk langsung ke file gambar (jpg/png/webp).' });
    };

    im.src = url;
  });
}
