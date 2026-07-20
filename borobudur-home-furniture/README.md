# Borobudur Home Furniture (BHF)

Static website for Borobudur Home Furniture — a solid wood furniture
manufacturer in Yogyakarta, established 2016. Built with plain HTML, CSS and
JavaScript only (no backend, no frameworks, no build step).

## Pages

| File           | Contents                                                            |
| -------------- | ------------------------------------------------------------------- |
| `index.html`   | Home — hero, about, values, product range, featured pieces, contact |
| `catalog.html` | Product catalog with category filters (`?category=Seating` etc.)    |
| `product.html` | Product detail, rendered from the query string (`?id=rama-dining-table`) |
| `contact.html` | Showroom info + a form that opens WhatsApp with a pre-written message |

## Structure

- `css/style.css` — all styling (minimalist dark & white theme)
- `js/products.js` — product data (single source of truth) + card helper
- `js/main.js` — header, mobile nav, reveal-on-scroll, featured grid
- `js/catalog.js`, `js/product.js`, `js/contact.js` — per-page logic
- Imagery is served from [Unsplash](https://unsplash.com) (placeholder
  photography — swap the photo IDs in `js/products.js` and the HTML for real
  product shots when available)

## Running

Open `index.html` directly in a browser, or serve statically:

```sh
python3 -m http.server 8000
```

To add a product, append one entry to `BHF_PRODUCTS` in `js/products.js`.
