# Borobudur Home Furniture (BHF)

Website statis untuk Borobudur Home Furniture — manufaktur furniture kayu jati
di Yogyakarta sejak 2016. Dibangun hanya dengan HTML, CSS, dan JavaScript
(tanpa backend, tanpa framework, tanpa dependensi eksternal).

## Halaman

| File           | Isi                                                                 |
| -------------- | ------------------------------------------------------------------- |
| `index.html`   | Home — hero, about, product range, featured products, contact       |
| `catalog.html` | Katalog produk dengan filter kategori (`?category=Seating` dst.)    |
| `product.html` | Detail produk, dirender dari query string (`?id=rama-dining-table`) |
| `contact.html` | Info showroom + formulir yang membuka WhatsApp berisi pesan tersusun |

## Struktur

- `css/style.css` — seluruh styling (tema minimalist dark & white)
- `js/products.js` — data produk (single source of truth) + helper kartu produk
- `js/main.js` — header, navigasi mobile, reveal-on-scroll, featured grid
- `js/catalog.js`, `js/product.js`, `js/contact.js` — logika per halaman
- `assets/img/` — ilustrasi SVG line-art untuk semua produk

## Menjalankan

Buka `index.html` langsung di browser, atau jalankan server statis:

```sh
python3 -m http.server 8000
```

Untuk menambah produk, cukup tambahkan satu entri pada `BHF_PRODUCTS`
di `js/products.js` beserta file gambarnya di `assets/img/`.
