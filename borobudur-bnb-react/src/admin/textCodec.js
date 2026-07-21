// Overrides are always stored as plain strings. These codecs convert
// list-shaped data (paragraphs, highlights, spec rows) to/from a single
// editable text block so they can go through the same textarea UI.

export function encodeLines(arr) {
  return (arr || []).join('\n');
}

export function decodeLines(str) {
  return (str || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function encodeParagraphs(arr) {
  return (arr || []).join('\n\n');
}

export function decodeParagraphs(str) {
  return (str || '')
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function encodeSpecs(specs) {
  return (specs || []).map(([k, v]) => `${k}: ${v}`).join('\n');
}

export function decodeSpecs(str) {
  return (str || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const idx = line.indexOf(':');
      if (idx === -1) return [line, ''];
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    });
}
