# Borobudur Home Furniture (BHF)

Website for Borobudur Home Furniture — a solid wood furniture manufacturer in
Yogyakarta, established 2016. Built with **React 18 + React Router**, bundled
by **Vite**. Product data lives behind a small set of async functions in
`src/data/products.js`, which automatically dispatch to one of two backends:

- **No Supabase configured** (default, zero setup): reads/writes a
  `localStorage` copy of the catalog, and `/admin` is guarded by a plain
  passphrase. This is what you get out of the box.
- **Supabase configured**: reads/writes the real `products` table, gallery
  uploads go to Supabase Storage, and `/admin` is guarded by real Supabase
  Auth (email/password) instead of a passphrase.

The switch is automatic and based on whether `VITE_SUPABASE_URL` /
`VITE_SUPABASE_ANON_KEY` are set — no page or admin component needs to
change either way. See "Moving to Supabase" below for the exact steps.

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
    admin/                 AdminLayout (passphrase OR Supabase Auth gate + shell),
                            AdminProducts, AdminProductEditor
  data/
    products.js            product data + fetch/create/update/delete functions —
                            dispatches to localStorage or Supabase automatically
    site.js                 brand name, address, phone, WhatsApp helper
    adminAuth.js             TEMPORARY admin passphrase, only used pre-Supabase
  lib/
    supabaseClient.js         Supabase client + isSupabaseConfigured flag
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
supabase/
  schema.sql                 run this once in the Supabase SQL Editor — creates
                              the products table, RLS policies, storage bucket
                              + policies, and the 12 demo products
vercel.json                 SPA rewrite for Vercel previews (same purpose as
                             .htaccess, different host — see "Deploying" below)
.env.example                 copy to .env.local and fill in to enable Supabase
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

- **Gate**: without Supabase configured, a passphrase prompt guards the panel
  — see "Security note" below. The passphrase is set in
  `src/data/adminAuth.js` (default: `bhf-admin-2026`). Once Supabase is
  configured, this automatically becomes a real email/password sign-in
  instead (see "Moving to Supabase").
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
    being stored. Without Supabase, they're kept as data URLs on the
    product record itself; with Supabase configured, they're uploaded to
    the `product-photos` Storage bucket instead and only the public URL is
    stored. You can also paste an image URL directly either way (handy for
    reusing stock photography). Use the arrow buttons to reorder, "Set
    cover" to promote a photo to the front (it becomes the image shown on
    cards and as the default on the product page), and "Remove" to delete
    one.
  - A live preview of the product card sits alongside the form.
- **Delete product**: at the bottom of the editor, or from the list table.

### Where edits are stored right now

Without Supabase configured, admin edits (including uploaded photos, as data
URLs) are saved to the browser's `localStorage`, keyed per-browser — not
shared between devices or visitors, and cleared if the user clears site data.
This is intentional: it lets the whole admin experience be built and used
immediately with zero setup. Because uploaded photos are stored as base64
text, a browser's `localStorage` quota (usually 5–10MB) can fill up after
many high-resolution photos — the panel will show a message if a save fails
for this reason. Once Supabase is configured (below), none of this applies:
data lives in a real database and photos in real object storage, shared by
everyone.

### Security note (read before deploying without Supabase)

The `/admin` passphrase in `src/data/adminAuth.js` is **not real
authentication** — it's a client-side string check meant only to keep casual
visitors out of a preview build. Anyone who inspects the deployed JavaScript
can read it. Do not treat it as access control for real business data.
`public/robots.txt` also disallows `/admin` from search engines, which
prevents indexing but is not security either. Complete the Supabase setup
below — which replaces this with real authentication — before this panel
manages real inventory.

## Moving to Supabase

All product reads/writes already go through one file, `src/data/products.js`,
which automatically switches from the `localStorage` backend to a Supabase
backend as soon as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set.
The gallery uploader (`GalleryEditor.jsx`) and the admin gate
(`AdminLayout.jsx`) do the same. Nothing else needs to change — follow these
steps:

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com), sign in, and create a new
project (pick any name/region; note the database password somewhere safe,
though this app doesn't need it directly).

### 2. Create the table, storage bucket, and demo data

In the Supabase Dashboard, open **SQL Editor → New query**, paste the
entire contents of **`supabase/schema.sql`** from this repo, and click
**Run**. This one script creates:

- the `products` table with the columns the app expects
- Row Level Security policies: anyone can read, only signed-in
  (`authenticated`) users can insert/update/delete
- the `product-photos` Storage bucket, public-read / authenticated-write
- the same 12 demo products the site already ships with, so it looks
  identical right after switching over

It's safe to re-run if it fails partway through (every statement uses
`if not exists` / `drop ... if exists` / `on conflict do nothing`).

### 3. Create an admin login

In the Dashboard, go to **Authentication → Users → Add user**, and create
one (or more) accounts with an email and password — this is what you'll use
to sign in at `/admin` once Supabase is active. (Leave "Auto Confirm User"
checked so you don't need to click an email confirmation link.)

### 4. Get your API keys

In the Dashboard, go to **Settings → API**. You need two values:

- **Project URL** (e.g. `https://xxxxxxxxxxxx.supabase.co`)
- **anon / public** key (a long string under "Project API keys" — **not**
  the `service_role` key, which must never be exposed to the browser)

### 5. Set the environment variables

**For local development**: copy `.env.example` to `.env.local` in this
folder and fill in the two values from step 4:

```sh
cp .env.example .env.local
```

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

`.env.local` is already excluded by `.gitignore` — never commit real keys.
Restart `npm run dev` after creating/editing it.

**For a deployed build** (Vercel or cPanel), the same two variables need to
be set wherever the build runs, since Vite bakes them into the JS bundle at
build time:

- **Vercel**: Project → Settings → Environment Variables, add both, then
  redeploy (a new build is required — setting them alone doesn't affect an
  already-built deployment).
- **cPanel**: there's no server-side build step, so set them in a `.env.local`
  file (or export them in your shell) on whatever machine you run
  `npm run build` on before uploading `dist/` — the values get compiled into
  the JS at that point.

### 6. Verify

Once deployed (or in `npm run dev` locally) with the env vars set:

- The public site should look unchanged — it now reads from Supabase.
- Visiting `/admin` should show an email/password sign-in form instead of
  the passphrase prompt. Sign in with the account from step 3.
- Try editing a product, adding a photo, and reloading — changes should
  persist (they're in the real database and bucket now, not
  `localStorage`).

If something doesn't load, check the browser console — `products.js`
surfaces Supabase/Postgres errors (e.g. a missing table, or an RLS policy
blocking a write) as thrown `Error`s with the original message.

## Deploying

This is a client-side single-page app: React Router handles routes like
`/catalog`, `/product/rama-dining-table` and `/admin` entirely in the
browser, but they are all really just `index.html`. Any host serving this
build **must** be told to fall back to `index.html` for unknown paths, or a
direct link / refresh / bookmark to anything but `/` will 404. That fallback
is configured differently per host:

- **Vercel** (e.g. a `*.vercel.app` preview): handled by `vercel.json` at
  the project root, already included. If Vercel is building this project
  with its **Root Directory** setting pointed at `borobudur-home-furniture/`,
  no extra setup is needed — just push and it deploys. If `/admin` (or any
  route besides `/`) 404s with a plain "NOT_FOUND" page from Vercel itself
  (not a blank page — check with curl or the Network tab), the most common
  cause is `vercel.json` not being picked up because the Root Directory is
  set to the repo root instead of this folder.
- **cPanel** (see below): handled by `public/.htaccess`, which Apache reads
  automatically once uploaded alongside the built files.

### Deploying to cPanel

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
