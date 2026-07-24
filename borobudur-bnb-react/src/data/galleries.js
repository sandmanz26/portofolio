import { img } from '../utils/img';

// Fallback content for the curated bento galleries on Home ("A Small
// Taste") and Facility ("In Pictures") — shown before Supabase responds,
// or if it's never configured. Once loaded, these are replaced by rows
// from the `images` table (section = 'home_gallery' / 'facility_gallery').
const HOME_GALLERY_RAW = [
  { id: 'photo-1591674585153-ca78d0339b09', alt: 'Borobudur Temple sunrise' },
  { id: 'photo-1584132905271-512c958d674a', alt: 'Bedroom interior' },
  { id: 'photo-1759223607861-f0ef3e617739', alt: 'Bathroom detail' },
  { id: 'photo-1780283574760-e8d7fd944da5', alt: 'Garden swimming pool' },
  { id: 'photo-1754617438035-712ddf5500ef', alt: 'Traditional Indonesian breakfast' },
];

const FACILITY_GALLERY_RAW = [
  { id: 'photo-1780283574760-e8d7fd944da5', alt: 'Garden pool' },
  { id: 'photo-1754617438035-712ddf5500ef', alt: 'Home-cooked breakfast tray' },
  { id: 'photo-1571456803038-80efbf5c9d6b', alt: 'Kolam Kungkum wooden soaking tub' },
  { id: 'photo-1591674585153-ca78d0339b09', alt: 'Sunrise temple tour' },
  { id: 'photo-1566559532224-6d65e9fc0f37', alt: 'Borobudur Temple morning light' },
];

export const homeGallery = HOME_GALLERY_RAW.map((it, i) => ({
  id: `static-home-gallery-${i}`,
  image: img(it.id, 1400),
  alt: it.alt,
}));

export const facilityGallery = FACILITY_GALLERY_RAW.map((it, i) => ({
  id: `static-facility-gallery-${i}`,
  image: img(it.id, 1400),
  alt: it.alt,
}));
