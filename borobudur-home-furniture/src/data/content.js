/* ============================================================
   BHF — Editorial content layer

   Holds the copy for Home/Catalog/Contact (headings, paragraphs,
   CTA labels, images) and site-wide contact details, organised into
   named "sections" (home_hero, home_about, contact_cta, etc.) — see
   src/data/contentSchema.js for the admin form that edits these.

   Same dual-backend pattern as products.js: local* functions read
   and write a localStorage copy of DEFAULT_CONTENT (zero setup);
   supabase* functions read and write the `site_content` table once
   Supabase is configured (see supabase/schema.sql). The exported
   fetch/update functions at the bottom dispatch to whichever is
   active — no component needs to know which one it's talking to.
   ============================================================ */

import { supabase, isSupabaseConfigured } from "../lib/supabaseClient.js";
import { SITE } from "./site.js";

export const DEFAULT_CONTENT = {
  home_hero: {
    eyebrow: "Est. 2016 — Yogyakarta",
    title: "Solid wood,",
    titleEmphasis: "made to last.",
    ctaLabel: "Explore the Collection",
    backgroundImage: "https://images.unsplash.com/photo-1549497538-303791108f95?q=80&w=2000&auto=format&fit=crop",
    metaItems: ["Grade-A Teak", "Ready Stock & Custom", "Showroom in Yogyakarta"],
  },
  home_about: {
    eyebrow: "About Us",
    title: "A decade of working wood, patiently.",
    paragraph1:
      "Founded in 2016 in Yogyakarta, Borobudur Home Furniture grew from a small workshop into a manufacturer with its own showroom. Wood is where we are strongest: we select, dry, cut and join every board ourselves.",
    paragraph2:
      "Visit the showroom and take a ready-made piece home the same day — or sit down with our team and have something custom built precisely for your space.",
    image: "https://images.unsplash.com/photo-1611021061285-16c871740efa?q=80&w=1200&auto=format&fit=crop",
    facts: [
      { number: "10", label: "Years of Craft" },
      { number: "500+", label: "Custom Projects" },
      { number: "1", label: "Showroom in Jogja" },
    ],
  },
  home_values: {
    eyebrow: "What We Stand On",
    title: "Wood first. Everything else follows.",
    items: [
      {
        title: "Solid Wood, No Shortcuts",
        desc: "Grade-A Javanese teak and mahogany, kiln-dried in-house to below 12% moisture so every piece stays true for decades.",
      },
      {
        title: "Honest Joinery",
        desc: "Mortise-and-tenon joints cut by hand, the way Javanese carpenters have built for generations. Screws are a last resort, never the structure.",
      },
      {
        title: "Responsibly Sourced",
        desc: "Timber from legal, plantation-grown Javanese forests — traceable from the log yard to your living room.",
      },
      {
        title: "Built Beyond Trends",
        desc: "Quiet designs and a 10-year structural guarantee. Furniture you keep, repair, and hand down — not replace.",
      },
    ],
  },
  home_range: {
    eyebrow: "Product Range",
    title: "Four lines, one design language.",
    items: [
      { category: "Seating", desc: "Lounge chairs, dining chairs, sofas and stools on solid teak frames." },
      { category: "Tables", desc: "Dining and coffee tables cut from single teak boards." },
      { category: "Bedroom", desc: "Beds, nightstands and wardrobes with calm, quiet lines." },
      { category: "Storage", desc: "Sideboards, consoles and shelving that keep things in order." },
    ],
  },
  home_featured: {
    eyebrow: "Featured",
    title: "Selected pieces from the showroom.",
  },
  home_cta: {
    eyebrow: "Custom Furniture",
    title: "Have your own size or design? We build it.",
    paragraph:
      "From a single chair to furnishing an entire home — tell us what you need and our team will walk with you from sketch to installation.",
    buttonLabel: "Start a Consultation",
  },
  home_contact: {
    eyebrow: "Contact Us",
    title: "Visit our showroom in Yogyakarta.",
    paragraph:
      "Feel the grain and the weight of the joinery for yourself. The showroom is open every day, and our team is happy to help you choose.",
    buttonLabel: "Contact & Directions",
  },
  catalog_hero: {
    eyebrow: "Catalog",
    title: "The collection.",
    paragraph:
      "Every piece is made in our Yogyakarta workshop from selected solid wood. In-stock pieces can leave the showroom with you today; the rest are made to order.",
  },
  catalog_cta: {
    eyebrow: "Can't find the right fit?",
    title: "We also build custom furniture.",
    paragraph: "Dimensions, timber and finish — every detail tailored to your space.",
    buttonLabel: "Custom Consultation",
  },
  contact_hero: {
    eyebrow: "Contact Us",
    title: "Let's talk.",
    paragraph:
      "Ask about availability, book a showroom visit, or start a custom furniture consultation. We usually reply within one working day.",
  },
  contact_cta: {
    eyebrow: "Since 2016",
    title: "Ten years, one standard: honest handwork.",
    paragraph: "Visit the showroom and judge the quality with your own hands.",
    buttonLabel: "View the Collection",
  },
  site_settings: {
    tagline: SITE.tagline,
    whatsappNumber: SITE.whatsappNumber,
    whatsappDisplay: SITE.whatsappDisplay,
    email: SITE.email,
    addressStreet: SITE.address.street,
    addressCity: SITE.address.city,
    addressMapsUrl: SITE.address.mapsUrl,
    hours: SITE.hours.slice(),
  },
  site_branding: {
    // Empty string = no logo image uploaded yet; the header/footer fall
    // back to rendering brandMark/brandName as text (today's default).
    logoImage: "",
    brandMark: SITE.brand,
    brandName: SITE.name,
    footerNote: "Handcrafted in Yogyakarta.",
  },
};

export const CONTENT_KEYS = Object.keys(DEFAULT_CONTENT);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

/** Fills in any section/field missing from `partial` with DEFAULT_CONTENT, so old
 *  stored data (local or Supabase) never breaks when new fields are added later. */
function withDefaults(partial) {
  const result = {};
  for (const key of CONTENT_KEYS) {
    result[key] = { ...DEFAULT_CONTENT[key], ...(partial?.[key] || {}) };
  }
  return result;
}

/* ============================================================
   Local backend — localStorage copy of DEFAULT_CONTENT.
   Active whenever Supabase isn't configured.
   ============================================================ */

const STORAGE_KEY = "bhf_content_v1";
let store = null;
let persistenceOk = true;

function readFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persist(content) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    persistenceOk = true;
    return null;
  } catch (err) {
    persistenceOk = false;
    return err;
  }
}

function getStore() {
  if (store) return store;
  const saved = typeof window !== "undefined" ? readFromStorage() : null;
  store = withDefaults(saved);
  return store;
}

function setStore(next) {
  store = next;
  return typeof window !== "undefined" ? persist(store) : null;
}

function persistErrorMessage(err) {
  if (err?.name === "QuotaExceededError") {
    return "Storage is full. (Your change is kept for this session only.)";
  }
  return "Couldn't save changes in this browser. (Your change is kept for this session only.)";
}

async function localFetchAllContent() {
  return clone(getStore());
}

async function localFetchContentSection(key) {
  return clone(getStore()[key]);
}

async function localUpdateContentSection(key, patch) {
  const current = getStore();
  const next = { ...current, [key]: { ...current[key], ...patch } };
  const err = setStore(next);
  if (err) throw new Error(persistErrorMessage(err));
  return clone(next[key]);
}

async function localResetContentSection(key) {
  return localUpdateContentSection(key, clone(DEFAULT_CONTENT[key]));
}

async function localResetAllContent() {
  const next = withDefaults(null);
  const err = setStore(next);
  if (err) throw new Error(persistErrorMessage(err));
  return clone(next);
}

/* ============================================================
   Supabase backend — active once VITE_SUPABASE_URL and
   VITE_SUPABASE_ANON_KEY are set. Expects the `site_content` table
   created by supabase/schema.sql.
   ============================================================ */

async function supabaseFetchAllRows() {
  const { data, error } = await supabase.from("site_content").select("key, content");
  if (error) throw new Error(error.message);
  const partial = {};
  for (const row of data || []) partial[row.key] = row.content;
  return partial;
}

async function supabaseFetchAllContent() {
  return withDefaults(await supabaseFetchAllRows());
}

async function supabaseFetchContentSection(key) {
  const { data, error } = await supabase.from("site_content").select("content").eq("key", key).maybeSingle();
  if (error) throw new Error(error.message);
  return { ...DEFAULT_CONTENT[key], ...(data?.content || {}) };
}

async function supabaseUpdateContentSection(key, patch) {
  const current = await supabaseFetchContentSection(key);
  const nextContent = { ...current, ...patch };
  const { data, error } = await supabase
    .from("site_content")
    .upsert({ key, content: nextContent })
    .select("content")
    .single();
  if (error) throw new Error(error.message);
  return data.content;
}

async function supabaseResetContentSection(key) {
  const { data, error } = await supabase
    .from("site_content")
    .upsert({ key, content: clone(DEFAULT_CONTENT[key]) })
    .select("content")
    .single();
  if (error) throw new Error(error.message);
  return data.content;
}

async function supabaseResetAllContent() {
  const rows = CONTENT_KEYS.map((key) => ({ key, content: clone(DEFAULT_CONTENT[key]) }));
  const { error } = await supabase.from("site_content").upsert(rows);
  if (error) throw new Error(error.message);
  return clone(DEFAULT_CONTENT);
}

/* ============================================================
   Public API — dispatches to whichever backend is active.
   ============================================================ */

export function isContentPersistenceAvailable() {
  return isSupabaseConfigured || persistenceOk;
}

export async function fetchAllContent() {
  return isSupabaseConfigured ? supabaseFetchAllContent() : localFetchAllContent();
}

export async function fetchContentSection(key) {
  return isSupabaseConfigured ? supabaseFetchContentSection(key) : localFetchContentSection(key);
}

export async function updateContentSection(key, patch) {
  return isSupabaseConfigured ? supabaseUpdateContentSection(key, patch) : localUpdateContentSection(key, patch);
}

export async function resetContentSection(key) {
  return isSupabaseConfigured ? supabaseResetContentSection(key) : localResetContentSection(key);
}

export async function resetAllContent() {
  return isSupabaseConfigured ? supabaseResetAllContent() : localResetAllContent();
}
