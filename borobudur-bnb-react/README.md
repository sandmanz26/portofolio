# Borobudur BnB — React

React + Vite port of the static Borobudur BnB marketing site. Same design,
content, and pages — now driven by a React Router SPA with data-driven
room/activity content, so it's easier to extend later.

## Stack

- React 19 + Vite (build tool)
- React Router v7 (`BrowserRouter`, nested layout route)
- Plain CSS (ported 1:1 from the static site's `css/style.css`)
- No backend — booking still goes through WhatsApp deep links (`wa.me`)

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

Room, activity, workshop, and testimonial content all live in `src/data/*.js`
as plain JS arrays/objects consumed by generic components (`IndexRow`,
`DetailPage`, `ExpCard`, `Gallery`). Adding a room or activity is just adding
an object to the array — no new components or routes needed (routes like
`/room/:slug` are already dynamic).

## Later: Supabase

The data layer was deliberately kept as flat arrays with simple finder
helpers (`findRoom(slug)`, `findActivity(slug)`) so it can be swapped for
Supabase queries later with minimal restructuring — e.g. replace the static
array in `src/data/rooms.js` with a `useEffect`/React Query fetch from a
`rooms` table, keeping the same shape so `DetailPage`, `IndexRow`, etc. don't
need to change. This wasn't wired up yet — the site currently ships as a
fully static build with no backend calls.
