// Unsplash CDN helper — matches the same photo IDs used in the static build.
export function img(id, w = 1200) {
  const host = id.startsWith('premium') ? 'plus.unsplash.com' : 'images.unsplash.com';
  return `https://${host}/${id}?q=80&w=${w}&auto=format&fit=crop`;
}
