# Borobudur BnB — React

React + Vite port of the static Borobudur BnB marketing site. Same design,
content, and pages — now driven by a React Router SPA backed by Supabase,
with an inline content editor for non-technical updates.

## Stack

- React 19 + Vite (build tool)
- React Router v7 (`BrowserRouter`, nested layout route)
- Plain CSS (ported 1:1 from the static site's `css/style.css`)
- Supabase (Postgres + Auth + Storage) for content and the admin editor
- Booking still goes through WhatsApp deep links (`wa.me`) — no booking backend

## Local development

```bash
npm install
npm run dev       # dev server with HMR
npm run build     # production build -> dist/
npm run preview   # serve the dist/ build locally (SPA-correct routing)
npm run lint      # oxlint
```

## Deploying to cPanel (shared hosting)

Vite's `npm run build` produces a fully static `dist/` folder — plain HTML/CSS/JS,
no Node.js process required. That's exactly what a normal cPanel shared hosting
plan can serve.

1. Run `npm run build` locally.
2. Upload the **contents** of `dist/` (not the folder itself) into
   `public_html/` (or a subfolder, e.g. `public_html/borobudur/`) via cPanel's
   File Manager or FTP.
3. The build already includes a `.htaccess` file (copied from `public/.htaccess`)
   that rewrites any unknown path to `index.html`. This is required because
   React Router handles routes like `/room/joglo` or `/activity/rafting`
   entirely client-side — without the rewrite rule, refreshing or
   directly opening one of those URLs would 404 on Apache.
4. If you deploy into a subfolder instead of the domain root, uncomment
   `RewriteBase /your-subfolder` in `.htaccess`.

No Node.js setup, no "Setup Node.js App" panel, no Passenger config needed —
it's a static file deploy.

## Project structure

```
src/
  data/        room/activity/workshop/testimonial/site content as plain arrays
  components/  shared UI (Nav, Footer, Gallery, Lightbox, DetailPage, ...)
  pages/       one file per route
  hooks/       useScrollNav, useReveal, useLightbox, useDocumentTitle
  utils/       img() (Unsplash URL builder), whatsapp.js (wa.me link helpers)
```

Room, activity, workshop, testimonial, and facility content all live in
`src/data/*.js` as plain JS arrays — these now serve only as **fallback /
seed content**: what renders before Supabase finishes loading, or the whole
site's content if Supabase isn't configured at all. Once Supabase is set up
(below), every page fetches live data from the database instead.

## Supabase setup

The site works without Supabase configured (it just shows the built-in
placeholder content and the admin editor stays disabled). To wire up the
real database:

1. **Create a project** at [supabase.com](https://supabase.com) if you
   haven't already.
2. **Run the schema**: open Supabase Dashboard → SQL Editor → New query,
   paste the contents of `supabase/schema.sql`, and run it. This creates the
   `rooms`, `activities`, `workshops`, `testimonials`, `facilities`,
   `site_settings`, and `images` tables, enables Row Level Security (public
   read, authenticated-only write), and creates the `content-images` Storage
   bucket with matching policies. **If the bucket insert fails** (some
   projects block writing to `storage.buckets` directly, even from the SQL
   Editor), create it manually instead: Storage → New bucket → name
   `content-images`, mark it Public — then re-run just the four `create
   policy ... on storage.objects` statements at the bottom of the file.
3. **Seed initial content**: run `supabase/seed.sql` the same way. It
   populates all tables with the same content the static site ships with
   (4 rooms, 5 activities, 4 workshops, 3 testimonials, 14 facilities, site
   info, and every photo). Re-running it resets content back to these
   defaults, so keep that in mind if you've already made edits you want to
   keep.
   - If you ran an earlier version of `schema.sql` (the one where photos
     lived in a `hero`/`thumbs`/`media` jsonb column on each row instead of
     their own `images` table), just re-run the current `schema.sql` first —
     it safely drops those old columns and adds `images` — then re-run
     `seed.sql`.
4. **Create your admin login**: Dashboard → Authentication → Users → Add
   user. Set an email + password and either turn off "email confirmations"
   in Authentication settings or confirm the user manually — otherwise
   Supabase will refuse to sign them in until the email is confirmed.
5. **Set your env vars**: copy `.env.example` to `.env.local` and fill in
   your project's URL and anon/public key (Dashboard → Project Settings →
   API).
6. **Redeploy** (or restart `npm run dev`) — Vite only reads `.env.local` at
   startup/build time.

That's it — `/admin` will now show a real email+password login instead of
"Supabase belum terhubung", and every save writes directly to the database.

### Admin content editor (`/admin`)

An inline "click-to-edit" mode, in the spirit of Elementor/WPBakery:

1. Go to `/admin` and sign in with the account created above.
2. Open any page — every editable title, description, price, and image is
   outlined with a dashed blue border and a small ✎ badge. Click one to open
   the edit panel.
3. Text fields show a character-limit rule and counter; image fields show a
   recommended aspect ratio / minimum resolution and validate the image
   (pasted URL, or a file picked from the upload button — uploads go to the
   `content-images` Storage bucket) against those rules before saving.
4. **Every Save writes straight to the database** — no export/import step,
   no "draft" state. The change is live for all visitors immediately.
5. The bottom toolbar shows who's signed in and offers **Refresh data**
   (re-fetch, useful if another tab changed something) and **Download
   backup** (a JSON snapshot of everything currently in the database, for
   your own records).

What's editable: site name/tagline/phone/email/address/social links (Nav,
Footer, Contact), and per room/activity — name, description, price, story
text, specs, highlights — plus workshops, testimonials, and the facilities
list.

**Photos** live in their own `images` table (not embedded in the row they
illustrate), so there are two patterns depending on the slot:
- **Hero image** (per room/activity) and **workshop photo** — single slot,
  click to replace, same as any other field.
- **Room/activity thumbnail gallery**, and the curated **Home ("A Small
  Taste")** / **Facility ("In Pictures")** galleries — click any photo to
  replace or delete it (🗑), and use the dashed **"+ Tambah foto"** tile to
  add as many more as you like.

Not yet wired up (still requires a direct edit in Supabase's Table Editor or
in code): page narrative copy (the "Our Story" paragraphs, section intros),
FAQ items, and policy/meeting-rate tables.

### Security note

Row Level Security is set so **any signed-in Supabase user** can write to
every table — there's no per-row ownership check, since this is built for a
single admin account. Don't add more Supabase Auth users than people you
trust to edit the whole site. The anon key in your `.env.local` is public
(it ships in the JS bundle) by design — it only grants read access plus
whatever RLS explicitly allows, never a bypass of it.
