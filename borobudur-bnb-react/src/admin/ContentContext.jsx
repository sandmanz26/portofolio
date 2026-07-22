import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabaseClient';
import { rooms as staticRooms } from '../data/rooms';
import { activities as staticActivities } from '../data/activities';
import { workshops as staticWorkshops } from '../data/workshops';
import { testimonials as staticTestimonials } from '../data/testimonials';
import { facilities as staticFacilities } from '../data/facilities';
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

function mapRoomRow(r) {
  return {
    slug: r.slug,
    no: r.no,
    kicker: r.kicker,
    name: r.name,
    lede: r.lede,
    hero: r.hero || {},
    thumbs: r.thumbs || [],
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
const mapWorkshopRow = (w) => ({ id: w.id, media: w.media || {}, meta: w.meta, title: w.title, text: w.text });
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

// Every editable field resolves through a flat "collection.key.field" path
// (e.g. "rooms.joglo.name", "site.phone", "facilities.3.title"). This
// flattens the live rows into that shape so Editable/EditableImage — which
// just read overrides[path] — don't need to know rows exist at all.
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
      (row.thumbs || []).forEach((t, i) => {
        flat[p(`thumbs.${i}.image`)] = t.image || '';
      });
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

function buildRowPatch(collection, row, field, value) {
  if (field === 'specs') return { specs: decodeSpecs(value) };
  if (field === 'paragraphs') return { paragraphs: decodeParagraphs(value) };
  if (field === 'highlights') return { highlights: decodeLines(value) };
  if (field === 'hero.image') return { hero: { ...row.hero, image: value } };
  const thumbMatch = field.match(/^thumbs\.(\d+)\.image$/);
  if (thumbMatch) {
    const idx = Number(thumbMatch[1]);
    return { thumbs: row.thumbs.map((t, i) => (i === idx ? { ...t, image: value } : t)) };
  }
  if (field === 'image' && collection === 'workshops') return { media: { ...row.media, image: value } };
  return { [field]: value };
}

async function persistField(rowsRef, path, value) {
  const { collection, key, field } = resolvePath(path);

  if (collection === 'site') {
    const { error } = await supabase.from('site_settings').update({ [toColumn(field)]: value }).eq('id', 1);
    return error;
  }

  const cfg = TABLE_CONFIG[collection];
  if (!cfg) return new Error(`Unknown collection: ${collection}`);
  const list = rowsRef.current[collection] || [];
  const row = cfg.keyIsIndex ? list[Number(key)] : list.find((r) => r[cfg.keyField] === key);
  if (!row) return new Error(`Row not found for ${path}`);

  const jsPatch = buildRowPatch(collection, row, field, value);
  const dbPatch = {};
  Object.entries(jsPatch).forEach(([k, v]) => {
    dbPatch[toColumn(k)] = v;
  });

  const { error } = await supabase.from(cfg.table).update(dbPatch).eq(cfg.keyColumn, row[cfg.keyColumn]);
  return error;
}

function applyLocalPatch(prevRows, path, value) {
  const { collection, key, field } = resolvePath(path);
  if (collection === 'site') {
    return { ...prevRows, site: { ...prevRows.site, [field]: value } };
  }
  const cfg = TABLE_CONFIG[collection];
  const list = prevRows[collection] || [];
  const idx = cfg.keyIsIndex ? Number(key) : list.findIndex((r) => r[cfg.keyField] === key);
  if (idx === -1 || !list[idx]) return prevRows;
  const nextRow = { ...list[idx], ...buildRowPatch(collection, list[idx], field, value) };
  const nextList = [...list];
  nextList[idx] = nextRow;
  return { ...prevRows, [collection]: nextList };
}

const INITIAL_ROWS = {
  site: staticSite,
  rooms: staticRooms,
  activities: staticActivities,
  workshops: staticWorkshops,
  testimonials: staticTestimonials,
  facilities: staticFacilities,
};

export function ContentProvider({ children }) {
  const [rows, setRows] = useState(INITIAL_ROWS);
  const [overrides, setOverrides] = useState(() => flattenAll(INITIAL_ROWS));
  const [loading, setLoading] = useState(supabaseConfigured);
  const [session, setSession] = useState(null);
  const [authError, setAuthError] = useState('');
  const [activeEditor, setActiveEditor] = useState(null);
  const rowsRef = useRef(rows);
  rowsRef.current = rows;

  async function loadAll() {
    setLoading(true);
    const [roomsR, activitiesR, workshopsR, testimonialsR, facilitiesR, siteR] = await Promise.all([
      supabase.from('rooms').select('*').order('sort_order'),
      supabase.from('activities').select('*').order('sort_order'),
      supabase.from('workshops').select('*').order('sort_order'),
      supabase.from('testimonials').select('*').order('sort_order'),
      supabase.from('facilities').select('*').order('sort_order'),
      supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
    ]);
    const nextRows = {
      rooms: roomsR.data?.length ? roomsR.data.map(mapRoomRow) : staticRooms,
      activities: activitiesR.data?.length ? activitiesR.data.map(mapRoomRow) : staticActivities,
      workshops: workshopsR.data?.length ? workshopsR.data.map(mapWorkshopRow) : staticWorkshops,
      testimonials: testimonialsR.data?.length ? testimonialsR.data.map(mapTestimonialRow) : staticTestimonials,
      facilities: facilitiesR.data?.length ? facilitiesR.data.map(mapFacilityRow) : staticFacilities,
      site: siteR.data ? mapSiteRow(siteR.data) : staticSite,
    };
    setRows(nextRows);
    setOverrides(flattenAll(nextRows));
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
    const error = await persistField(rowsRef, path, value);
    if (error) throw error;
    setOverrides((prev) => ({ ...prev, [path]: value }));
    setRows((prev) => applyLocalPatch(prev, path, value));
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
