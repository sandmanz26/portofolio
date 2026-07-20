# Borobudur Home Furniture (BHF)

Website for Borobudur Home Furniture — a solid wood furniture manufacturer in
Yogyakarta, established 2016. Built with **React 18 + React Router**, bundled
by **Vite**. No backend yet — all data lives in `src/data/`, structured so an
admin panel backed by **Supabase** can be dropped in later without touching
any page component (see "Adding Supabase" below).

## Pages / Routes

| Route               | Component                    | Contents                                                            |
| -------------------- | ----------------------------- | --------------------------------------------------------------------- |
| `/`                  | `src/pages/Home.jsx`          | Hero, about, values, product range, featured pieces, contact         |
| `/catalog`            | `src/pages/Catalog.jsx`       | Product grid with category filters (`?category=Seating` etc.)        |
| `/product/:id`         | `src/pages/ProductDetail.jsx` | Product detail, related products                                     |
| `/contact`             | `src/pages/Contact.jsx`       | Showroom info + a form that opens WhatsApp with a pre-written message |
| anything else          | `src/pages/NotFound.jsx`      | 404                                                                   |

## Structure

```
src/
  main.jsx            entry point, mounts <App /> inside a BrowserRouter
  App.jsx             route table
  components/         Header, Footer, Layout (shared shell), ProductCard
  hooks/useReveal.js   scroll-reveal animation hook
  pages/               one file per route, listed above
  data/
    products.js        product data + fetchProducts/fetchProduct/etc.
    site.js             brand name, address, phone, WhatsApp helper
  styles/style.css      all styling (minimalist dark & white theme)
public/
  .htaccess             Apache rewrite so client-side routes survive a
                         direct link or page refresh on cPanel
```

Imagery currently comes from [Unsplash](https://unsplash.com) as placeholder
photography — swap the photo IDs in `src/data/products.js` and `src/pages/Home.jsx`
for real product shots when available.

## Running locally

```sh
npm install
npm run dev       # http://localhost:5173, hot reload
npm run build     # outputs static site to dist/
npm run preview   # serve the dist/ build locally to sanity-check it
```

## Adding Supabase + an admin panel later

All product/site reads go through the functions at the bottom of
`src/data/products.js` (`fetchProducts`, `fetchProduct`, `fetchFeaturedProducts`,
`fetchRelatedProducts`) — none of the page components query data directly.
To switch to Supabase:

1. `npm install @supabase/supabase-js`
2. Create a Supabase client (e.g. `src/lib/supabaseClient.js`) using an anon
   key exposed as a Vite env var (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
   in a `.env` file — Vite only exposes vars prefixed `VITE_` to the browser).
   `.env` files are already excluded via `.gitignore`.
3. Replace the bodies of the `fetch*` functions in `products.js` with
   `supabase.from("products").select(...)` calls returning the same shape
   (`id`, `name`, `category`, `price`, `image`, `tag`, `featured`, `short`,
   `description`, `dimensions`, `material`, `finish`, `leadTime`).
4. Build the admin panel as additional routes (e.g. `/admin/*`) gated behind
   Supabase Auth, writing to the same `products` table.

Because every page already renders from `await fetch...()` calls (see the
`useEffect` + `useState` pattern in `Home.jsx` / `Catalog.jsx` / `ProductDetail.jsx`),
no page needs to change — only `data/products.js`.

## Deploying to cPanel

1. Run `npm run build` — this produces a static `dist/` folder (HTML, JS,
   CSS, and `.htaccess` copied from `public/`).
2. Upload the **contents** of `dist/` (not the folder itself) to
   `public_html/` (or a subfolder, e.g. `public_html/bhf/`) via cPanel's File
   Manager or FTP.
3. If deploying to a subfolder instead of the domain root, change `base` in
   `vite.config.js` from `"/"` to `"/bhf/"` (matching the subfolder) and
   rebuild — the default `"/"` assumes the site lives at the root of its own
   domain or subdomain.
4. Confirm `.htaccess` made it into the upload and that the domain's Apache
   config has `mod_rewrite` enabled (standard on cPanel). This file is what
   lets a direct link or refresh on `/catalog` or `/product/rama-dining-table`
   keep working instead of 404ing, since this is a single-page app.

To add a product today (before Supabase), append one entry to the `PRODUCTS`
array in `src/data/products.js` and rebuild.
