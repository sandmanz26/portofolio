# Borobudur Home Furniture (BHF)

Website for Borobudur Home Furniture — a solid wood furniture manufacturer in
Yogyakarta, established 2016. Built with **React 18 + React Router**, bundled
by **Vite**. Product data lives behind a small set of async functions in
`src/data/products.js`; today they read/write a `localStorage` copy of the
catalog so the admin panel works with no backend at all, and later they can
be swapped for **Supabase** queries without touching any page or admin
component (see "Moving to Supabase" below).

## Pages / Routes

| Route           | Component                      | Contents                                                              |
| ---------------- | ------------------------------- | ------------------------------------------------------------------------ |
| `/`               | `src/pages/Home.jsx`            | Hero, about, values, product range, featured pieces, contact           |
| `/catalog`         | `src/pages/Catalog.jsx`         | Product grid with category filters (`?category=Seating` etc.)          |
| `/product/:id`      | `src/pages/ProductDetail.jsx`   | Product detail with a photo gallery, related products                  |
| `/contact`          | `src/pages/Contact.jsx`         | Showroom info + a form that opens WhatsApp with a pre-written message  |
| `/admin`            | `src/pages/admin/AdminProducts.jsx` | Product list with inline editing (see "Admin panel" below)         |
| `/admin/products/:id` | `src/pages/admin/AdminProductEditor.jsx` | Full product editor + gallery manager                     |
| anything else        | `src/pages/NotFound.jsx`        | 404                                                                     |

## Structure

```
src/
  main.jsx              entry point, mounts <App /> inside a BrowserRouter
  App.jsx                route table
  components/            Header, Footer, Layout (public shell), ProductCard
    admin/                InlineText, InlineSelect, GalleryEditor
  hooks/useReveal.js       scroll-reveal animation hook
  pages/                   one file per public route
    admin/                 AdminLayout (passphrase gate + shell), AdminProducts,
                            AdminProductEditor
  data/
    products.js            product data + fetch/create/update/delete functions
    site.js                 brand name, address, phone, WhatsApp helper
    adminAuth.js             TEMPORARY admin passphrase (see below)
  utils/
    image.js                 resizes/compresses uploaded photos client-side
    slug.js                   generates a URL-safe id for new products
  styles/
    style.css                 public site styling (minimalist dark & white)
    admin.css                  admin panel styling
public/
  .htaccess                 Apache rewrite so client-side routes survive a
                             direct link or page refresh on cPanel
  robots.txt                 disallows /admin from search engines
```

## Running locally

```sh
npm install
npm run dev       # http://localhost:5173, hot reload
npm run build     # outputs static site to dist/
npm run preview   # serve the dist/ build locally to sanity-check it
```

## Admin panel

Visit `/admin` (e.g. `http://localhost:5173/admin`).

- **Gate**: a passphrase prompt guards the panel — see "Security note" below.
  The passphrase is set in `src/data/adminAuth.js`.
- **Product list** (`/admin`): name, category, price, tag and "featured" are
  editable directly in the table. Click a cell, change it, click away (or
  press Enter) — it saves immediately, no Save button. A green flash confirms
  the save.
- **Add product**: creates a blank product and opens its editor.
- **Reset demo data**: discards all admin edits and restores the original
  12-piece demo catalog — useful while testing.
- **Product editor** (`/admin/products/:id`): every field (description,
  dimensions, material, finish, availability) is the same inline-save
  pattern, plus:
  - **Gallery**: drag photos onto the drop zone (or click it to browse
    files). Each photo is resized and compressed in the browser before
    being stored — there's no upload backend yet, so photos are kept as
    part of the product record itself. You can also paste an image URL
    (handy for reusing stock photography). Use the arrow buttons to reorder,
    "Set cover" to promote a photo to the front (it becomes the image shown
    on cards and as the default on the product page), and "Remove" to
    delete one.
  - A live preview of the product card sits alongside the form.
- **Delete product**: at the bottom of the editor, or from the list table.

### Where edits are stored right now

There is no backend yet, so admin edits (including uploaded photos, as
data URLs) are saved to the browser's `localStorage`, keyed per-browser —
not shared between devices or visitors, and cleared if the user clears site
data. This is intentional: it lets the whole admin experience be built and
used today, and is designed to be replaced by Supabase with minimal changes
(see below). Because uploaded photos are stored as base64 text, a browser's
`localStorage` quota (usually 5–10MB) can fill up after many high-resolution
photos — the panel will show a message if a save fails for this reason.

### Security note (read before deploying)

The `/admin` passphrase in `src/data/adminAuth.js` is **not real
authentication** — it's a client-side string check meant only to keep casual
visitors out of a preview build. Anyone who inspects the deployed JavaScript
can read it. Do not treat it as access control for real business data.
`public/robots.txt` also disallows `/admin` from search engines, which
prevents indexing but is not security either. Replace the gate with Supabase
Auth (below) before this panel manages real inventory.

## Moving to Supabase

All product reads/writes already go through one file, `src/data/products.js`
— `fetchProducts`, `fetchProduct`, `fetchFeaturedProducts`,
`fetchRelatedProducts`, `createProduct`, `updateProduct`, `deleteProduct`,
`resetProducts`. No page or admin component touches storage directly. To
switch from `localStorage` to Supabase:

1. `npm install @supabase/supabase-js`
2. Create a Supabase client (e.g. `src/lib/supabaseClient.js`) using an anon
   key exposed as a Vite env var (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
   in a `.env` file — Vite only exposes vars prefixed `VITE_` to the browser).
   `.env` files are already excluded via `.gitignore`.
3. Create a `products` table matching the product shape used throughout the
   app: `id` (text, primary key), `name`, `category`, `price` (numeric),
   `images` (jsonb array of URLs), `tag`, `featured` (bool), `short`,
   `description`, `dimensions`, `material`, `finish`, `lead_time`.
4. Replace the bodies of the functions in `products.js` with
   `supabase.from("products")` calls returning the same shape. Delete the
   `localStorage` plumbing (`getStore`/`setStore`/`persist`) at the same time.
5. For the gallery uploader specifically: create a Supabase Storage bucket
   (e.g. `product-photos`), and in `GalleryEditor.jsx` swap the call to
   `fileToCompressedDataUrl` (which returns a base64 string) for a
   `supabase.storage.from("product-photos").upload(...)` call that returns a
   public URL instead. The rest of the gallery UI (reorder, set cover,
   remove) needs no changes since it just operates on an array of URL
   strings.
6. Replace `src/data/adminAuth.js` and the gate in `AdminLayout.jsx` with
   Supabase Auth (e.g. email/password or magic link), and add row-level
   security policies on the `products` table so only authenticated
   admin users can write.

## Deploying to cPanel

1. Run `npm run build` — this produces a static `dist/` folder (HTML, JS,
   CSS, `.htaccess` and `robots.txt` copied from `public/`).
2. Upload the **contents** of `dist/` (not the folder itself) to
   `public_html/` (or a subfolder, e.g. `public_html/bhf/`) via cPanel's File
   Manager or FTP.
3. If deploying to a subfolder instead of the domain root, change `base` in
   `vite.config.js` from `"/"` to `"/bhf/"` (matching the subfolder) and
   rebuild — the default `"/"` assumes the site lives at the root of its own
   domain or subdomain.
4. Confirm `.htaccess` made it into the upload and that the domain's Apache
   config has `mod_rewrite` enabled (standard on cPanel). This file is what
   lets a direct link or refresh on `/catalog`, `/product/rama-dining-table`,
   or `/admin` keep working instead of 404ing, since this is a single-page
   app.
5. Before pointing this at a real business, complete the Supabase migration
   above — `localStorage` data does not sync between visitors or survive a
   cleared browser, and the admin passphrase is not real security.
