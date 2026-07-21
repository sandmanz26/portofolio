/* ============================================================
   BHF — Product data layer

   All product access goes through the functions at the bottom
   (fetch/create/update/delete). Right now they read and write a
   browser localStorage copy of SEED_PRODUCTS so the admin panel
   works before a backend exists. When Supabase lands, replace the
   bodies of these functions with supabase.from("products") calls
   returning the same shape — no page or admin component needs to
   change, since none of them touch storage directly.
   ============================================================ */

import { uniqueSlug } from "../utils/slug.js";

function unsplash(id, width = 1200) {
  return `https://images.unsplash.com/photo-${id}?q=80&w=${width}&auto=format&fit=crop`;
}

export const CATEGORIES = ["All", "Seating", "Tables", "Bedroom", "Storage"];

const SEED_PRODUCTS = [
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

/* ---- localStorage-backed store (temporary, pre-Supabase) ---- */

const STORAGE_KEY = "bhf_products_v1";
let store = null;
let persistenceOk = true;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

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

/** False if localStorage is unavailable or full — edits still work for this session only. */
export function isPersistenceAvailable() {
  return persistenceOk;
}

function persistErrorMessage(err) {
  if (err?.name === "QuotaExceededError") {
    return "Storage is full — remove a photo or two, then try again. (Your change is kept for this session only.)";
  }
  return "Couldn't save changes in this browser. (Your change is kept for this session only.)";
}

/* ---- Read access ---- */

export async function fetchProducts(category = "All") {
  const products = getStore();
  return category === "All" ? products.slice() : products.filter((p) => p.category === category);
}

export async function fetchProduct(id) {
  return getStore().find((p) => p.id === id) ?? null;
}

export async function fetchFeaturedProducts(limit = 6) {
  return getStore()
    .filter((p) => p.featured)
    .slice(0, limit);
}

export async function fetchRelatedProducts(product, limit = 3) {
  return getStore()
    .filter((p) => p.id !== product.id)
    .sort((a, b) => (b.category === product.category) - (a.category === product.category))
    .slice(0, limit);
}

/* ---- Write access (admin panel) ---- */

export async function createProduct(overrides = {}) {
  const products = getStore();
  const name = (overrides.name || "New Product").trim() || "New Product";
  const product = {
    id: uniqueSlug(name, products),
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
  const err = setStore([product, ...products]);
  if (err) throw new Error(persistErrorMessage(err));
  return product;
}

export async function updateProduct(id, patch) {
  const products = getStore();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Product not found: " + id);
  const next = products.slice();
  next[idx] = { ...next[idx], ...patch };
  const err = setStore(next);
  if (err) throw new Error(persistErrorMessage(err));
  return next[idx];
}

export async function deleteProduct(id) {
  const next = getStore().filter((p) => p.id !== id);
  const err = setStore(next);
  if (err) throw new Error(persistErrorMessage(err));
}

/** Restores the original demo catalog, discarding all admin edits. */
export async function resetProducts() {
  const next = clone(SEED_PRODUCTS);
  const err = setStore(next);
  if (err) throw new Error(persistErrorMessage(err));
  return next.slice();
}
