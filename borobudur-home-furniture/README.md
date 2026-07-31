# Borobudur Home Furniture (BHF)

Website for Borobudur Home Furniture — a solid wood furniture manufacturer in
Yogyakarta, established 2016. Built with **React 18 + React Router**, bundled
by **Vite**. Two things are editable from `/admin` without touching code:
the product catalog (`src/data/products.js`) and the editorial copy on
Home/Catalog/Contact plus contact details (`src/data/content.js`). Both use
the same dual-backend pattern and automatically dispatch to one of two
backends:

- **No Supabase configured** (default, zero setup): reads/writes a
  `localStorage` copy of the catalog and content, and `/admin` is guarded by
  a plain passphrase. This is what you get out of the box.
- **Supabase configured**: reads/writes the real `products` and
  `site_content` tables, gallery uploads go to Supabase Storage, and
  `/admin` is guarded by real Supabase Auth (email/password) instead of a
  passphrase.

The switch is automatic and based on whether `VITE_SUPABASE_URL` /
`VITE_SUPABASE_ANON_KEY` are set — no page or admin component needs to
change either way. See "Moving to Supabase" below for the exact steps.

## Pages / Routes

| Route           | Component                      | Contents                                                              |
| ---------------- | ------------------------------- | ------------------------------------------------------------------------ |
| `/`               | `src/pages/Home.jsx`            | Hero, about, values, product range, featured pieces, contact           |
| `/catalog`         | `src/pages/Catalog.jsx`         | Product grid with category filters (`?category=Seating` etc.)          |
| `/product/:id`      | `src/pages/ProductDetail.jsx`   | Product detail with a photo gallery, related products                  |
| `/cart`              | `src/pages/Cart.jsx`            | Cart + "Request Invoice" — see "Cart & invoice requests" below         |
| `/contact`          | `src/pages/Contact.jsx`         | Showroom info + a form that opens WhatsApp with a pre-written message  |
| `/admin`            | `src/pages/admin/AdminProducts.jsx` | Product list with inline editing (see "Admin panel" below)         |
| `/admin/products/:id` | `src/pages/admin/AdminProductEditor.jsx` | Full product editor + gallery manager                     |
| `/admin/content`     | `src/pages/admin/AdminContent.jsx` | Editorial content editor for Home/Catalog/Contact + site settings   |
| anything else        | `src/pages/NotFound.jsx`        | 404                                                                     |

## Structure

```
src/
  main.jsx              entry point, mounts <App /> inside a BrowserRouter
  App.jsx                route table
  components/            Header, Footer, Layout (public shell), ProductCard
    admin/                InlineText, InlineSelect, GalleryEditor,
                          ArrayFieldEditor, StringListEditor
  context/
    ContentContext.jsx     loads all site content once, provides it to every
                            public page via useContent()
    CartContext.jsx         cart state (localStorage-backed) via useCart() —
                            see "Cart & invoice requests" below
  hooks/useReveal.js       scroll-reveal animation hook
  pages/                   one file per public route, including Cart.jsx
    admin/                 AdminLayout (passphrase OR Supabase Auth gate + shell),
                            AdminProducts, AdminProductEditor, AdminContent
  data/
    products.js            product data + fetch/create/update/delete functions —
                            dispatches to localStorage or Supabase automatically
    content.js              editorial content (Home/Catalog/Contact copy + site
                            settings) — same dispatch pattern as products.js
    contentSchema.js         describes the fields AdminContent.jsx renders per
                            content section (tabs, labels, field types) —
                            a UI concern only, content.js doesn't know it exists
    site.js                 default brand/address/phone (seeds content.js's
                            site_settings section; still used directly by
                            Header/Footer)
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
                              the products + site_content tables, RLS policies,
                              storage bucket + policies, and all default data
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

## Cart & invoice requests

This is a no-checkout, no-payment site — the cart exists so a visitor can
gather several pieces, then send them to BHF as one message instead of
asking about each product individually. The flow is: **Add to Cart** (from
a product card or the product page) → **`/cart`** → fill in name/email/
optional phone & notes → **Request Invoice via WhatsApp**, which opens
WhatsApp with the whole cart itemized (name, quantity, line price, and an
estimated total) plus the customer's details. BHF's team follows up with an
actual price and invoice over WhatsApp — nothing here generates a real
invoice or processes payment.

- **Cart state** (`src/context/CartContext.jsx`, `useCart()`) lives in
  `localStorage` only (`{ productId, quantity }` pairs) — there's no
  Supabase table for it. Product details (name, price, image) are always
  looked up live from `src/data/products.js` when the cart renders, so
  prices shown are never stale even if an admin edits a product after it
  was added to someone's cart.
- The header's cart icon (with an item-count badge) is available on every
  public page; the same icon works fine on the dark hero header.
- **Add to Cart** appears as a hover button on every `ProductCard` (always
  visible on touch devices) and as a quantity-stepper + button on the
  product detail page — both call the same `addToCart()`.
- `ProductCard` takes an `interactive` prop (default `true`); the admin
  editor's "live preview" passes `interactive={false}` to hide the Add to
  Cart button there, since it's a static preview of an in-progress draft,
  not a real product page.
- `/cart` lets you adjust or remove line items and re-fetches product data
  whenever the cart changes, so it can't show a quantity for a product that
  was deleted since being added (those lines just don't render).

## Admin panel

Visit `/admin` (e.g. `http://localhost:5173/admin`).

- **Gate**: without Supabase configured, a passphrase prompt guards the panel
  — see "Security note" below. The passphrase is set in
  `src/data/adminAuth.js` (default: `bhf-admin-2026`). Once Supabase is
  configured, this automatically becomes a real email/password sign-in
  instead (see "Moving to Supabase").
- **Nothing writes until you click Save.** Every editable surface in the
  admin panel — a product row, the product editor, a content section — holds
  your edits as a local draft. A **Save / Cancel** bar appears the moment
  something changes: **Save** persists the whole draft in one call, **Cancel**
  discards it and reverts every field (including the gallery) back to what
  was last saved. Nothing is written in between, so there's no risk of a
  stray click overriding real content mid-edit.
- **Product list** (`/admin`): edit name, category, price, tag or "featured"
  directly in a row — a compact Save/Cancel appears in that row once it's
  dirty.
- **Add product**: creates a blank product and opens its editor.
- **Reset demo data**: discards all admin edits and restores the original
  12-piece demo catalog — useful while testing.
- **Product editor** (`/admin/products/:id`): a single Save/Cancel bar
  (docked under the top bar while you scroll) governs every field on the
  page at once — details, gallery, copy, specifications.
  - **Full description** uses a small rich-text editor (bold, italic,
    bullet/numbered lists) instead of a plain textarea — see "Rich text
    editor" below.
  - **Gallery**: drag photos onto the drop zone (or click it to browse
    files). Each photo is resized and compressed in the browser before
    being stored. Without Supabase, they're kept as data URLs on the
    product record itself; with Supabase configured, they're uploaded to
    the `product-photos` Storage bucket instead and only the public URL is
    stored. You can also paste an image URL directly either way (handy for
    reusing stock photography). Use the arrow buttons to reorder, "Set
    cover" to promote a photo to the front (it becomes the image shown on
    cards and as the default on the product page), and "Remove" to delete
    one — none of this is persisted until the page-level Save is clicked
    (uploaded files themselves do go to Storage immediately, since that's
    a separate concern from the product record; Cancel just leaves an
    unused file there rather than trying to un-upload it).
  - A live preview of the product card sits alongside the form.
- **Delete product**: at the bottom of the editor, or from the list table —
  this is immediate (with its own confirmation dialog), not part of the
  Save/Cancel draft.

### Rich text editor

The product **Full description** field (`RichTextEditor.jsx`) is a small
WYSIWYG editor — bold, italic, bullet and numbered lists — built directly on
`contentEditable` + `document.execCommand` rather than a library. That API is
deprecated but every major browser still supports exactly these four
commands, and pulling in a dependency (Quill, Tiptap, ...) felt
disproportionate for "bold/italic/lists" on a furniture description. It
stores an HTML string, which the public product page renders with
`dangerouslySetInnerHTML` — safe here because the only path that writes it
is this authenticated admin editor. If richer formatting (links, images,
tables) is ever needed, swap this component for a real library; the
`value`/`onChange` contract (both plain HTML strings) means nothing else
needs to change.

### Content editor (`/admin/content`)

Everything editorial on Home, Catalog and Contact — headings, paragraphs,
button labels, the four value cards, the "years of craft" facts, the hero
meta strip, product-range descriptions, and site-wide contact details
(phone, email, address, hours) — is editable here, grouped into four tabs:
**Home**, **Catalog**, **Contact**, **Site Settings**. The public pages read
this content through `useContent()` (`src/context/ContentContext.jsx`),
which loads it once and provides it to every page — edit it in `/admin/content`,
then reload the public page (or navigate to it) to see the change.

- Each **section** (Hero, About, Values, ...) is its own draft with its own
  Save/Cancel bar at the bottom — editing one section doesn't affect any
  other, so you can work through several without committing each
  individually.
- List fields (the hero meta strip, opening hours, value cards, facts,
  product-range lines) have their own small editor: type into any item,
  reorder with the arrow buttons, **Remove** to delete one, or the **+ Add**
  button to append a new one — all part of that section's draft, same as
  the plain text fields.
- **Reset to default** sits at the top of each section and reverts just that
  section (not the whole page) to the original copy the site ships with —
  this one is immediate (with its own confirmation dialog), not part of the
  Save/Cancel draft.
- Changing **Site Settings** → WhatsApp number also updates the WhatsApp
  links on the Contact page and homepage contact strip, since both read the
  number from there rather than a hardcoded value.

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

Product reads/writes go through `src/data/products.js`, and content
reads/writes go through `src/data/content.js` — both automatically switch
from their `localStorage` backend to Supabase as soon as `VITE_SUPABASE_URL`
and `VITE_SUPABASE_ANON_KEY` are set. The gallery uploader
(`GalleryEditor.jsx`) and the admin gate (`AdminLayout.jsx`) do the same.
Nothing else needs to change — follow these steps:

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com), sign in, and create a new
project (pick any name/region; note the database password somewhere safe,
though this app doesn't need it directly).

### 2. Create the table, storage bucket, and demo data

In the Supabase Dashboard, open **SQL Editor → New query**, paste the
entire contents of **`supabase/schema.sql`** from this repo, and click
**Run**. This one script creates:

- the `products` table with the columns the app expects
- the `site_content` table (one row per content section — `home_hero`,
  `home_about`, `contact_cta`, `site_settings`, etc.)
- Row Level Security policies on both tables: anyone can read, only
  signed-in (`authenticated`) users can insert/update/delete
- the `product-photos` Storage bucket, public-read / authenticated-write
- the same 12 demo products, and the same default copy for every content
  section, that the site already ships with — so it looks identical right
  after switching over

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
- Try editing a product, adding a photo, editing something in
  `/admin/content`, and reloading — changes should persist (they're in the
  real database and bucket now, not `localStorage`).

If something doesn't load, check the browser console — `products.js` and
`content.js` both surface Supabase/Postgres errors (e.g. a missing table, or
an RLS policy blocking a write) as thrown `Error`s with the original
message.

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
