/* ============================================================
   BHF — Product data layer

   All product access goes through the functions at the bottom
   (fetch/create/update/delete/reset). Each one dispatches to one
   of two backends:

   - local*  — reads/writes a browser localStorage copy of
     SEED_PRODUCTS. Used automatically whenever Supabase isn't
     configured, so the admin panel works with zero setup.
   - supabase*  — reads/writes the real `products` table via
     src/lib/supabaseClient.js. Used automatically once
     VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set (see
     README's "Moving to Supabase" section, and supabase/schema.sql
     for the table + policies these functions expect).

   No page or admin component touches storage directly, and none of
   them need to change when you switch backends — only this file
   (and GalleryEditor.jsx's file-upload path) know the difference.
   ============================================================ */

import { uniqueSlug } from "../utils/slug.js";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient.js";

function unsplash(id, width = 1200) {
  return `https://images.unsplash.com/photo-${id}?q=80&w=${width}&auto=format&fit=crop`;
}

export const CATEGORIES = ["All", "Seating", "Tables", "Bedroom", "Storage"];

export const SEED_PRODUCTS = [
  {
    id: "arjuna-lounge-chair",
    name: "Arjuna Lounge Chair",
    category: "Seating",
    price: 4850000,
    images: [unsplash("1598300042247-d088f8ab3a91")],
    tag: "Best Seller",
    featured: true,
    short: "An upholstered lounge chair on a solid teak frame with a light silhouette.",
    description:
      "Arjuna is a lounge chair built on a solid teak frame, its reclined back angled for long, unhurried evenings. Traditional mortise-and-tenon joints are cut by hand in our Yogyakarta workshop, then finished in a natural matte that keeps the grain visible.",
    dimensions: "65 × 78 × 82 cm",
    material: "Grade-A solid teak, premium upholstery",
    finish: "Natural matte / Walnut dark",
    leadTime: "In stock at our showroom",
  },
  {
    id: "srikandi-dining-chair",
    name: "Srikandi Dining Chair",
    category: "Seating",
    price: 1950000,
    images: [unsplash("1592078615290-033ee584e267")],
    tag: null,
    featured: false,
    short: "A slatted-back dining chair — light in the hand, solid underfoot.",
    description:
      "Srikandi pairs a vertical slatted back with a generous seat. Its quiet profile sits comfortably with almost any dining table, from Scandinavian to Japandi interiors, and its solid-wood joinery is built for daily use.",
    dimensions: "45 × 52 × 88 cm",
    material: "Solid teak / mahogany",
    finish: "Natural matte / Black stain",
    leadTime: "In stock at our showroom",
  },
  {
    id: "bima-sofa",
    name: "Bima Three-Seat Sofa",
    category: "Seating",
    price: 12500000,
    images: [unsplash("1540574163026-643ea20ade25")],
    tag: "Featured",
    featured: true,
    short: "A three-seater with an exposed teak base and loose cushions.",
    description:
      "Bima is a three-seat sofa whose solid teak base stays visible along the arms and rail — the wood is the point. Premium foam cushions in removable linen covers can be re-covered in the fabric of your choice.",
    dimensions: "210 × 85 × 78 cm",
    material: "Solid teak frame, premium foam",
    finish: "Linen upholstery (custom colours)",
    leadTime: "Made to order, 4–6 weeks",
  },
  {
    id: "shinta-coffee-table",
    name: "Shinta Coffee Table",
    category: "Tables",
    price: 3250000,
    images: [unsplash("1519710164239-da123dc03ef4")],
    tag: null,
    featured: true,
    short: "A round coffee table cut from a single teak board.",
    description:
      "Shinta's top is cut from a single teak board with a softly rounded edge. The splayed legs keep it visually light while staying firmly planted — a calm centrepiece for a minimalist living room.",
    dimensions: "120 × 60 × 42 cm",
    material: "Grade-A solid teak",
    finish: "Natural matte",
    leadTime: "In stock at our showroom",
  },
  {
    id: "rama-dining-table",
    name: "Rama Dining Table",
    category: "Tables",
    price: 8900000,
    images: [unsplash("1519643381401-22c77e60520e")],
    tag: "Best Seller",
    featured: true,
    short: "A six-seat dining table with a 4 cm solid teak top.",
    description:
      "Rama is built from a 4 cm-thick teak top on full end-frame legs — a plain statement about simplicity and strength. Available in 160, 180 and 200 cm lengths, or made to measure for your room.",
    dimensions: "180 × 90 × 76 cm",
    material: "Solid teak, 4 cm top",
    finish: "Natural matte / Smoked oak",
    leadTime: "In stock & made to order",
  },
  {
    id: "nakula-console",
    name: "Nakula Console Table",
    category: "Storage",
    price: 4200000,
    images: [unsplash("1597072689227-8882273e8f6a")],
    tag: null,
    featured: false,
    short: "A slim two-drawer console for hallways and entryways.",
    description:
      "Nakula is a slim console with two drawers on traditional wooden runners. At just 35 cm deep it slips into hallways and entries without giving up storage — or quietly doubles as a small writing desk.",
    dimensions: "120 × 35 × 80 cm",
    material: "Solid teak & teak veneer",
    finish: "Natural matte / Black stain",
    leadTime: "Made to order, 3–4 weeks",
  },
  {
    id: "dewi-bed",
    name: "Dewi Bed Frame",
    category: "Bedroom",
    price: 9800000,
    images: [unsplash("1616594039964-ae9021a400a0")],
    tag: "Featured",
    featured: true,
    short: "A tall-headboard bed with calm lines and a low profile.",
    description:
      "Dewi carries a tall panelled headboard over a low platform that makes the whole room feel larger. The solid teak frame assembles without visible bolts. Available in queen and king, or fully custom sizes.",
    dimensions: "170 × 210 × 110 cm (Queen)",
    material: "Solid teak & teak panels",
    finish: "Natural matte / Walnut dark",
    leadTime: "Made to order, 4–6 weeks",
  },
  {
    id: "sadewa-nightstand",
    name: "Sadewa Nightstand",
    category: "Bedroom",
    price: 2150000,
    images: [unsplash("1595526114035-0d45ed16cfbf")],
    tag: null,
    featured: false,
    short: "A two-drawer nightstand on slender tapered legs.",
    description:
      "The companion to our Dewi bed, Sadewa holds two drawers on smooth traditional wooden runners. Compact on the floor, generous enough for everything a bedside needs.",
    dimensions: "45 × 40 × 55 cm",
    material: "Solid teak",
    finish: "Natural matte / Walnut dark",
    leadTime: "In stock at our showroom",
  },
  {
    id: "gatot-wardrobe",
    name: "Gatot Wardrobe",
    category: "Bedroom",
    price: 14500000,
    images: [unsplash("1558997519-83ea9252edf8")],
    tag: null,
    featured: false,
    short: "A two-door wardrobe with a configurable interior.",
    description:
      "Gatot is a two-door wardrobe with recessed wooden pulls. The interior — hanging rail, shelves and drawers — is configured to how you actually dress. A three-door version is available on request.",
    dimensions: "120 × 60 × 210 cm",
    material: "Solid teak & teak panels",
    finish: "Natural matte / Smoked oak",
    leadTime: "Made to order, 5–7 weeks",
  },
  {
    id: "kresna-bookshelf",
    name: "Kresna Bookshelf",
    category: "Storage",
    price: 5600000,
    images: [unsplash("1594620302200-9a762244a156")],
    tag: "New",
    featured: false,
    short: "An open four-tier shelf with architectural proportions.",
    description:
      "Kresna is an open four-tier shelf in a thick teak frame. Its firm proportions read as architecture against a wall — for books, ceramics, or whatever you collect.",
    dimensions: "95 × 35 × 180 cm",
    material: "Solid teak",
    finish: "Natural matte / Black stain",
    leadTime: "In stock & made to order",
  },
  {
    id: "laksmana-sideboard",
    name: "Laksmana Sideboard",
    category: "Storage",
    price: 7800000,
    images: [unsplash("1616046229478-9901c5536a45")],
    tag: "New",
    featured: true,
    short: "A long, low three-door sideboard with quiet horizontal lines.",
    description:
      "Laksmana runs long and low — a three-door sideboard with adjustable shelving behind every door. Equally at home as a dining-room credenza or a media cabinet in the living room.",
    dimensions: "180 × 45 × 75 cm",
    material: "Solid teak & teak veneer",
    finish: "Natural matte / Walnut dark",
    leadTime: "In stock & made to order",
  },
  {
    id: "drupadi-stool",
    name: "Drupadi Stool",
    category: "Seating",
    price: 1450000,
    images: [unsplash("1503602642458-232111445657")],
    tag: null,
    featured: false,
    short: "A solid-wood stool that works anywhere in the house.",
    description:
      "Drupadi is a simple solid-wood stool with through-tenon joinery — extra seating at the dining table, a bedside perch, or a stand for a favourite plant. Simple objects, done properly, last the longest.",
    dimensions: "38 × 38 × 45 cm",
    material: "Solid teak",
    finish: "Natural matte",
    leadTime: "In stock at our showroom",
  },
];

export function formatPrice(value) {
  return "Rp " + Number(value || 0).toLocaleString("id-ID");
}

export function coverImage(product) {
  return product?.images?.[0] || null;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function newProductDefaults(overrides = {}) {
  const name = (overrides.name || "New Product").trim() || "New Product";
  return {
    name,
    category: overrides.category || "Seating",
    price: overrides.price ?? 0,
    images: overrides.images || [],
    tag: overrides.tag ?? null,
    featured: overrides.featured ?? false,
    short: overrides.short || "",
    description: overrides.description || "",
    dimensions: overrides.dimensions || "",
    material: overrides.material || "",
    finish: overrides.finish || "",
    leadTime: overrides.leadTime || "",
  };
}

/* ============================================================
   Local backend — localStorage copy of SEED_PRODUCTS.
   Active whenever Supabase isn't configured.
   ============================================================ */

const STORAGE_KEY = "bhf_products_v1";
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

/** Writes through to localStorage; returns an Error on failure instead of throwing. */
function persist(products) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
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
  store = saved ?? clone(SEED_PRODUCTS);
  return store;
}

/** Updates the in-memory store immediately, then best-effort persists it. */
function setStore(next) {
  store = next;
  return typeof window !== "undefined" ? persist(store) : null;
}

function persistErrorMessage(err) {
  if (err?.name === "QuotaExceededError") {
    return "Storage is full — remove a photo or two, then try again. (Your change is kept for this session only.)";
  }
  return "Couldn't save changes in this browser. (Your change is kept for this session only.)";
}

async function localFetchProducts(category) {
  const products = getStore();
  return category === "All" ? products.slice() : products.filter((p) => p.category === category);
}

async function localFetchProduct(id) {
  return getStore().find((p) => p.id === id) ?? null;
}

async function localFetchFeaturedProducts(limit) {
  return getStore()
    .filter((p) => p.featured)
    .slice(0, limit);
}

async function localFetchRelatedProducts(product, limit) {
  return getStore()
    .filter((p) => p.id !== product.id)
    .sort((a, b) => (b.category === product.category) - (a.category === product.category))
    .slice(0, limit);
}

async function localCreateProduct(overrides) {
  const products = getStore();
  const product = { id: uniqueSlug(overrides.name || "New Product", products), ...newProductDefaults(overrides) };
  const err = setStore([product, ...products]);
  if (err) throw new Error(persistErrorMessage(err));
  return product;
}

async function localUpdateProduct(id, patch) {
  const products = getStore();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Product not found: " + id);
  const next = products.slice();
  next[idx] = { ...next[idx], ...patch };
  const err = setStore(next);
  if (err) throw new Error(persistErrorMessage(err));
  return next[idx];
}

async function localDeleteProduct(id) {
  const next = getStore().filter((p) => p.id !== id);
  const err = setStore(next);
  if (err) throw new Error(persistErrorMessage(err));
}

async function localResetProducts() {
  const next = clone(SEED_PRODUCTS);
  const err = setStore(next);
  if (err) throw new Error(persistErrorMessage(err));
  return next.slice();
}

/* ============================================================
   Supabase backend — active once VITE_SUPABASE_URL and
   VITE_SUPABASE_ANON_KEY are set. Expects the `products` table
   created by supabase/schema.sql.
   ============================================================ */

/** DB row (snake_case) -> product (camelCase), the shape every page expects. */
function fromRow(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: Number(row.price) || 0,
    images: row.images || [],
    tag: row.tag ?? null,
    featured: Boolean(row.featured),
    short: row.short || "",
    description: row.description || "",
    dimensions: row.dimensions || "",
    material: row.material || "",
    finish: row.finish || "",
    leadTime: row.lead_time || "",
  };
}

/** product/patch (camelCase) -> DB row (snake_case). Only includes keys that were passed in. */
function toRow(fields) {
  const row = {};
  if ("id" in fields) row.id = fields.id;
  if ("name" in fields) row.name = fields.name;
  if ("category" in fields) row.category = fields.category;
  if ("price" in fields) row.price = fields.price;
  if ("images" in fields) row.images = fields.images;
  if ("tag" in fields) row.tag = fields.tag;
  if ("featured" in fields) row.featured = fields.featured;
  if ("short" in fields) row.short = fields.short;
  if ("description" in fields) row.description = fields.description;
  if ("dimensions" in fields) row.dimensions = fields.dimensions;
  if ("material" in fields) row.material = fields.material;
  if ("finish" in fields) row.finish = fields.finish;
  if ("leadTime" in fields) row.lead_time = fields.leadTime;
  return row;
}

async function supabaseFetchProducts(category) {
  let query = supabase.from("products").select("*").order("created_at", { ascending: false });
  if (category !== "All") query = query.eq("category", category);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data || []).map(fromRow);
}

async function supabaseFetchProduct(id) {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? fromRow(data) : null;
}

async function supabaseFetchFeaturedProducts(limit) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data || []).map(fromRow);
}

async function supabaseFetchRelatedProducts(product, limit) {
  // The catalog is small enough that filtering client-side is simpler
  // (and cheaper) than a second round-trip with an OR/priority query.
  const all = await supabaseFetchProducts("All");
  return all
    .filter((p) => p.id !== product.id)
    .sort((a, b) => (b.category === product.category) - (a.category === product.category))
    .slice(0, limit);
}

async function supabaseCreateProduct(overrides) {
  const existing = await supabaseFetchProducts("All");
  const fields = newProductDefaults(overrides);
  const id = uniqueSlug(fields.name, existing);
  const { data, error } = await supabase
    .from("products")
    .insert(toRow({ id, ...fields }))
    .select()
    .single();
  if (error) throw new Error(error.message);
  return fromRow(data);
}

async function supabaseUpdateProduct(id, patch) {
  const { data, error } = await supabase.from("products").update(toRow(patch)).eq("id", id).select().maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Product not found: " + id);
  return fromRow(data);
}

async function supabaseDeleteProduct(id) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

async function supabaseResetProducts() {
  const { error: deleteError } = await supabase.from("products").delete().not("id", "is", null);
  if (deleteError) throw new Error(deleteError.message);
  const rows = SEED_PRODUCTS.map((p) => toRow(p));
  const { data, error } = await supabase.from("products").insert(rows).select();
  if (error) throw new Error(error.message);
  return (data || []).map(fromRow);
}

/* ============================================================
   Public API — dispatches to whichever backend is active.
   Pages and admin components only ever call these.
   ============================================================ */

/** False only for the local backend when localStorage is unavailable or full. */
export function isPersistenceAvailable() {
  return isSupabaseConfigured || persistenceOk;
}

export async function fetchProducts(category = "All") {
  return isSupabaseConfigured ? supabaseFetchProducts(category) : localFetchProducts(category);
}

export async function fetchProduct(id) {
  return isSupabaseConfigured ? supabaseFetchProduct(id) : localFetchProduct(id);
}

export async function fetchFeaturedProducts(limit = 6) {
  return isSupabaseConfigured ? supabaseFetchFeaturedProducts(limit) : localFetchFeaturedProducts(limit);
}

export async function fetchRelatedProducts(product, limit = 3) {
  return isSupabaseConfigured
    ? supabaseFetchRelatedProducts(product, limit)
    : localFetchRelatedProducts(product, limit);
}

export async function createProduct(overrides = {}) {
  return isSupabaseConfigured ? supabaseCreateProduct(overrides) : localCreateProduct(overrides);
}

export async function updateProduct(id, patch) {
  return isSupabaseConfigured ? supabaseUpdateProduct(id, patch) : localUpdateProduct(id, patch);
}

export async function deleteProduct(id) {
  return isSupabaseConfigured ? supabaseDeleteProduct(id) : localDeleteProduct(id);
}

/** Restores the original demo catalog, discarding all admin edits. */
export async function resetProducts() {
  return isSupabaseConfigured ? supabaseResetProducts() : localResetProducts();
}
