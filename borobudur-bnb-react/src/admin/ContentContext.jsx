import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabaseClient';
import { rooms as staticRooms } from '../data/rooms';
import { activities as staticActivities } from '../data/activities';
import { workshops as staticWorkshops } from '../data/workshops';
import { testimonials as staticTestimonials } from '../data/testimonials';
import { facilities as staticFacilities } from '../data/facilities';
import { homeGallery as staticHomeGallery, facilityGallery as staticFacilityGallery } from '../data/galleries';
import { SITE as staticSite } from '../data/site';
import { encodeSpecs, decodeSpecs, encodeParagraphs, decodeParagraphs, encodeLines, decodeLines } from './textCodec';

const ContentContext = createContext(null);

// Field names that differ between the JS (camelCase) shape and the
// Postgres (snake_case) column name.
const FIELD_TO_COLUMN = {
  storyTitle: 'story_title',
  listDesc: 'list_desc',
  listPrice: 'list_price',
  listPricePer: 'list_price_per',
  addressShort: 'address_short',
  mapEmbed: 'map_embed',
  capLeft: 'cap_left',
  capRight: 'cap_right',
  storyLabel: 'story_label',
  listMeta: 'list_meta',
};
const toColumn = (field) => FIELD_TO_COLUMN[field] || field;

const TABLE_CONFIG = {
  rooms: { table: 'rooms', keyColumn: 'slug', keyField: 'slug' },
  activities: { table: 'activities', keyColumn: 'slug', keyField: 'slug' },
  workshops: { table: 'workshops', keyColumn: 'id', keyField: 'id' },
  testimonials: { table: 'testimonials', keyColumn: 'id', keyField: 'id', keyIsIndex: true },
  facilities: { table: 'facilities', keyColumn: 'no', keyField: 'no', keyIsIndex: true },
};

// Strips fields (used to drop the embedded hero/thumbs/media that the
// static fallback data files still carry — photos now come exclusively
// from the `images` table / extractStaticImages() below).
function omit(obj, ...fields) {
  const clone = { ...obj };
  fields.forEach((f) => delete clone[f]);
  return clone;
}
const staticRoomsBase = staticRooms.map((r) => omit(r, 'hero', 'thumbs'));
const staticActivitiesBase = staticActivities.map((a) => omit(a, 'hero', 'thumbs'));
const staticWorkshopsBase = staticWorkshops.map((w) => omit(w, 'media'));

function mapRoomBaseRow(r) {
  return {
    slug: r.slug,
    no: r.no,
    kicker: r.kicker,
    name: r.name,
    lede: r.lede,
    capLeft: r.cap_left,
    capRight: r.cap_right,
    specs: r.specs || [],
    price: r.price,
    per: r.per,
    note: r.note,
    storyLabel: r.story_label,
    storyTitle: r.story_title,
    paragraphs: r.paragraphs || [],
    highlights: r.highlights || [],
    listMeta: r.list_meta || [],
    listDesc: r.list_desc,
    listPrice: r.list_price,
    listPricePer: r.list_price_per,
  };
}
const mapWorkshopBaseRow = (w) => ({ id: w.id, meta: w.meta, title: w.title, text: w.text });
const mapTestimonialRow = (t) => ({ id: t.id, quote: t.quote, name: t.name, place: t.place });
const mapFacilityRow = (f) => ({ no: f.no, title: f.title, text: f.text });
const mapSiteRow = (s) => ({
  name: s.name,
  tagline: s.tagline,
  phone: s.phone,
  email: s.email,
  address: s.address,
  addressShort: s.address_short,
  instagram: s.instagram,
  facebook: s.facebook,
  mapEmbed: s.map_embed,
});
const mapImageRow = (im) => ({
  id: im.id,
  section: im.section,
  entityKey: im.entity_key,
  role: im.role,
  sortOrder: im.sort_order,
  image: im.image,
  alt: im.alt,
});

// Synthesizes an images-table-shaped list from the static fallback data
// files, so hero/thumb/media/gallery photos still render correctly before
// Supabase responds (or if it's never configured at all). Ids are
// prefixed "static-" so image CRUD functions can recognize and refuse to
// operate on them (they don't exist as real rows to update/delete).
function extractStaticImages() {
  const list = [];
  let n = 0;
  const push = (section, entityKey, role, sortOrder, image, alt) => {
    if (!image) return;
    list.push({ id: `static-${n++}`, section, entityKey, role, sortOrder, image, alt: alt || '' });
  };
  staticRooms.forEach((r) => {
    push('room', r.slug, 'hero', 0, r.hero?.image, r.hero?.alt);
    (r.thumbs || []).forEach((t, i) => push('room', r.slug, 'thumb', i, t.image, t.alt));
  });
  staticActivities.forEach((a) => {
    push('activity', a.slug, 'hero', 0, a.hero?.image, a.hero?.alt);
    (a.thumbs || []).forEach((t, i) => push('activity', a.slug, 'thumb', i, t.image, t.alt));
  });
  staticWorkshops.forEach((w) => push('workshop', w.id, 'media', 0, w.media?.image, w.media?.alt));
  staticHomeGallery.forEach((g, i) => push('home_gallery', null, 'gallery', i, g.image, g.alt));
  staticFacilityGallery.forEach((g, i) => push('facility_gallery', null, 'gallery', i, g.image, g.alt));
  return list;
}

function findOneImage(images, section, entityKey, role) {
  const found = images.find((im) => im.section === section && im.entityKey === entityKey && im.role === role);
  return found ? { id: found.id, image: found.image, alt: found.alt } : { id: null, image: '', alt: '' };
}
function findManyImages(images, section, entityKey, role) {
  return images
    .filter((im) => im.section === section && im.entityKey === entityKey && im.role === role)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((im) => ({ id: im.id, image: im.image, alt: im.alt }));
}

// Every editable scalar/list field resolves through a flat
// "collection.key.field" path (e.g. "rooms.joglo.name", "site.phone",
// "facilities.3.title"). Photos are handled separately (see
// upsertSingleImage / addGalleryImage / updateImageById / deleteImageById)
// except for the two single-slot cases (hero, workshop media) which stay
// in this flat map for the existing click-to-edit Editable/EditableImage
// components to keep working unchanged.
function flattenAll({ site, rooms, activities, workshops, testimonials, facilities }) {
  const flat = {};
  Object.entries(site || {}).forEach(([k, v]) => {
    flat[`site.${k}`] = v ?? '';
  });
  [
    ['rooms', rooms],
    ['activities', activities],
  ].forEach(([collection, list]) => {
    (list || []).forEach((row) => {
      const p = (f) => `${collection}.${row.slug}.${f}`;
      flat[p('name')] = row.name ?? '';
      flat[p('lede')] = row.lede ?? '';
      flat[p('price')] = row.price ?? '';
      flat[p('per')] = row.per ?? '';
      flat[p('note')] = row.note ?? '';
      flat[p('storyTitle')] = row.storyTitle ?? '';
      flat[p('listDesc')] = row.listDesc ?? '';
      flat[p('listPrice')] = row.listPrice ?? '';
      flat[p('listPricePer')] = row.listPricePer ?? '';
      flat[p('specs')] = encodeSpecs(row.specs);
      flat[p('paragraphs')] = encodeParagraphs(row.paragraphs);
      flat[p('highlights')] = encodeLines(row.highlights);
      flat[p('hero.image')] = row.hero?.image || '';
    });
  });
  (workshops || []).forEach((w) => {
    const p = (f) => `workshops.${w.id}.${f}`;
    flat[p('title')] = w.title ?? '';
    flat[p('text')] = w.text ?? '';
    flat[p('meta')] = w.meta ?? '';
    flat[p('image')] = w.media?.image || '';
  });
  (testimonials || []).forEach((t, i) => {
    flat[`testimonials.${i}.quote`] = t.quote ?? '';
    flat[`testimonials.${i}.name`] = t.name ?? '';
    flat[`testimonials.${i}.place`] = t.place ?? '';
  });
  (facilities || []).forEach((f, i) => {
    flat[`facilities.${i}.title`] = f.title ?? '';
    flat[`facilities.${i}.text`] = f.text ?? '';
  });
  return flat;
}

function resolvePath(path) {
  const parts = path.split('.');
  const collection = parts[0];
  if (collection === 'site') return { collection, field: parts.slice(1).join('.') };
  return { collection, key: parts[1], field: parts.slice(2).join('.') };
}

export function ContentProvider({ children }) {
  const [roomsBase, setRoomsBase] = useState(staticRoomsBase);
  const [activitiesBase, setActivitiesBase] = useState(staticActivitiesBase);
  const [workshopsBase, setWorkshopsBase] = useState(staticWorkshopsBase);
  const [testimonials, setTestimonials] = useState(staticTestimonials);
  const [facilities, setFacilities] = useState(staticFacilities);
  const [site, setSite] = useState(staticSite);
  const [imagesRaw, setImagesRaw] = useState(extractStaticImages);
  const [loading, setLoading] = useState(supabaseConfigured);
  const [session, setSession] = useState(null);
  const [authError, setAuthError] = useState('');
  const [activeEditor, setActiveEditor] = useState(null);
  const imagesRef = useRef(imagesRaw);
  imagesRef.current = imagesRaw;

  const rooms = useMemo(
    () =>
      roomsBase.map((r) => ({
        ...r,
        hero: findOneImage(imagesRaw, 'room', r.slug, 'hero'),
        thumbs: findManyImages(imagesRaw, 'room', r.slug, 'thumb'),
      })),
    [roomsBase, imagesRaw]
  );
  const activities = useMemo(
    () =>
      activitiesBase.map((a) => ({
        ...a,
        hero: findOneImage(imagesRaw, 'activity', a.slug, 'hero'),
        thumbs: findManyImages(imagesRaw, 'activity', a.slug, 'thumb'),
      })),
    [activitiesBase, imagesRaw]
  );
  const workshops = useMemo(
    () => workshopsBase.map((w) => ({ ...w, media: findOneImage(imagesRaw, 'workshop', w.id, 'media') })),
    [workshopsBase, imagesRaw]
  );
  const homeGallery = useMemo(() => findManyImages(imagesRaw, 'home_gallery', null, 'gallery'), [imagesRaw]);
  const facilityGallery = useMemo(() => findManyImages(imagesRaw, 'facility_gallery', null, 'gallery'), [imagesRaw]);

  const rows = { site, rooms, activities, workshops, testimonials, facilities, homeGallery, facilityGallery };
  const overrides = useMemo(() => flattenAll(rows), [site, rooms, activities, workshops, testimonials, facilities]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadAll() {
    setLoading(true);
    const [roomsR, activitiesR, workshopsR, testimonialsR, facilitiesR, siteR, imagesR] = await Promise.all([
      supabase.from('rooms').select('*').order('sort_order'),
      supabase.from('activities').select('*').order('sort_order'),
      supabase.from('workshops').select('*').order('sort_order'),
      supabase.from('testimonials').select('*').order('sort_order'),
      supabase.from('facilities').select('*').order('sort_order'),
      supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
      supabase.from('images').select('*').order('sort_order'),
    ]);
    setRoomsBase(roomsR.data?.length ? roomsR.data.map(mapRoomBaseRow) : staticRoomsBase);
    setActivitiesBase(activitiesR.data?.length ? activitiesR.data.map(mapRoomBaseRow) : staticActivitiesBase);
    setWorkshopsBase(workshopsR.data?.length ? workshopsR.data.map(mapWorkshopBaseRow) : staticWorkshopsBase);
    setTestimonials(testimonialsR.data?.length ? testimonialsR.data.map(mapTestimonialRow) : staticTestimonials);
    setFacilities(facilitiesR.data?.length ? facilitiesR.data.map(mapFacilityRow) : staticFacilities);
    setSite(siteR.data ? mapSiteRow(siteR.data) : staticSite);
    setImagesRaw(imagesR.data?.length ? imagesR.data.map(mapImageRow) : extractStaticImages());
    setLoading(false);
  }

  useEffect(() => {
    if (!supabaseConfigured) return;
    loadAll();
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => setSession(sess));
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function setOverride(path, value) {
    if (!supabaseConfigured) {
      throw new Error('Supabase belum dikonfigurasi (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY kosong).');
    }
    const { collection, key, field } = resolvePath(path);

    if (field === 'hero.image') {
      await upsertSingleImage(collection === 'rooms' ? 'room' : 'activity', key, 'hero', value);
      return;
    }
    if (collection === 'workshops' && field === 'image') {
      await upsertSingleImage('workshop', key, 'media', value);
      return;
    }
    if (collection === 'site') {
      const { error } = await supabase.from('site_settings').update({ [toColumn(field)]: value }).eq('id', 1);
      if (error) throw error;
      setSite((prev) => ({ ...prev, [field]: value }));
      return;
    }

    const cfg = TABLE_CONFIG[collection];
    if (!cfg) throw new Error(`Unknown collection: ${collection}`);
    const baseList = { rooms: roomsBase, activities: activitiesBase, workshops: workshopsBase, testimonials, facilities }[collection];
    const row = cfg.keyIsIndex ? baseList[Number(key)] : baseList.find((r) => r[cfg.keyField] === key);
    if (!row) throw new Error(`Row not found for ${path}`);

    let jsPatch;
    if (field === 'specs') jsPatch = { specs: decodeSpecs(value) };
    else if (field === 'paragraphs') jsPatch = { paragraphs: decodeParagraphs(value) };
    else if (field === 'highlights') jsPatch = { highlights: decodeLines(value) };
    else jsPatch = { [field]: value };

    const dbPatch = {};
    Object.entries(jsPatch).forEach(([k, v]) => {
      dbPatch[toColumn(k)] = v;
    });

    const { error } = await supabase.from(cfg.table).update(dbPatch).eq(cfg.keyColumn, row[cfg.keyColumn]);
    if (error) throw error;

    const setter = { rooms: setRoomsBase, activities: setActivitiesBase, workshops: setWorkshopsBase, testimonials: setTestimonials, facilities: setFacilities }[collection];
    setter((prev) => {
      const idx = cfg.keyIsIndex ? Number(key) : prev.findIndex((r) => r[cfg.keyField] === key);
      if (idx === -1) return prev;
      const next = [...prev];
      next[idx] = { ...next[idx], ...jsPatch };
      return next;
    });
  }

  // Hero images and workshop media are single-slot: replace only. Insert
  // the row on first use, update it after that.
  async function upsertSingleImage(section, entityKey, role, imageUrl) {
    const existing = imagesRef.current.find(
      (im) => im.section === section && im.entityKey === entityKey && im.role === role && !String(im.id).startsWith('static-')
    );
    if (existing) {
      const { error } = await supabase.from('images').update({ image: imageUrl }).eq('id', existing.id);
      if (error) throw error;
      setImagesRaw((prev) => prev.map((im) => (im.id === existing.id ? { ...im, image: imageUrl } : im)));
    } else {
      const { data, error } = await supabase
        .from('images')
        .insert({ section, entity_key: entityKey, role, sort_order: 0, image: imageUrl, alt: '' })
        .select()
        .single();
      if (error) throw error;
      setImagesRaw((prev) => [...prev.filter((im) => !(im.section === section && im.entityKey === entityKey && im.role === role)), mapImageRow(data)]);
    }
  }

  // Thumbs and galleries are multi-slot: any number of photos, added or
  // removed freely.
  async function addGalleryImage(section, entityKey, role, { image, alt }) {
    if (!supabaseConfigured) throw new Error('Supabase belum dikonfigurasi.');
    const group = imagesRef.current.filter((im) => im.section === section && im.entityKey === entityKey && im.role === role);
    const nextOrder = group.length ? Math.max(...group.map((g) => g.sortOrder)) + 1 : 0;
    const { data, error } = await supabase
      .from('images')
      .insert({ section, entity_key: entityKey, role, sort_order: nextOrder, image, alt: alt || '' })
      .select()
      .single();
    if (error) throw error;
    setImagesRaw((prev) => [...prev, mapImageRow(data)]);
  }

  async function updateImageById(id, patch) {
    if (!supabaseConfigured) throw new Error('Supabase belum dikonfigurasi.');
    if (String(id).startsWith('static-')) throw new Error('Data foto belum selesai dimuat dari database — coba lagi sebentar.');
    const { error } = await supabase.from('images').update(patch).eq('id', id);
    if (error) throw error;
    setImagesRaw((prev) => prev.map((im) => (im.id === id ? { ...im, ...patch } : im)));
  }

  async function deleteImageById(id) {
    if (!supabaseConfigured) throw new Error('Supabase belum dikonfigurasi.');
    if (String(id).startsWith('static-')) throw new Error('Data foto belum selesai dimuat dari database — coba lagi sebentar.');
    const { error } = await supabase.from('images').delete().eq('id', id);
    if (error) throw error;
    setImagesRaw((prev) => prev.filter((im) => im.id !== id));
  }

  async function uploadImage(file) {
    if (!supabaseConfigured) throw new Error('Supabase belum dikonfigurasi.');
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from('content-images').upload(path, file, { cacheControl: '3600', upsert: false });
    if (error) throw error;
    const { data } = supabase.storage.from('content-images').getPublicUrl(path);
    return data.publicUrl;
  }

  async function signIn(email, password) {
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
      return false;
    }
    return true;
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  function openEditor(descriptor) {
    setActiveEditor(descriptor);
  }
  function closeEditor() {
    setActiveEditor(null);
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `borobudur-bnb-backup-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const value = {
    rows,
    overrides,
    loading,
    supabaseConfigured,
    setOverride,
    uploadImage,
    addGalleryImage,
    updateImageById,
    deleteImageById,
    activeEditor,
    openEditor,
    closeEditor,
    isEditMode: !!session,
    session,
    signIn,
    signOut,
    authError,
    exportJSON,
    refresh: () => supabaseConfigured && loadAll(),
  };

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within a ContentProvider');
  return ctx;
}
