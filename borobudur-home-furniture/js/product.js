/* ============================================================
   BHF — Product detail page
   Reads ?id= from the URL and renders the matching product
   ============================================================ */

(function () {
  var root = document.querySelector("[data-product-root]");
  if (!root) return;

  var id = new URLSearchParams(location.search).get("id");
  var product = bhfGetProduct(id);

  if (!product) {
    root.innerHTML =
      '<div class="catalog-empty">' +
        "<p>Produk tidak ditemukan.</p>" +
        '<p style="margin-top:1.5rem"><a class="link-arrow" href="catalog.html">Kembali ke katalog</a></p>' +
      "</div>";
    return;
  }

  document.title = product.name + " — Borobudur Home Furniture";

  var waMessage = encodeURIComponent(
    "Halo BHF, saya tertarik dengan " + product.name + " (" + bhfFormatPrice(product.price) + "). Boleh info ketersediaannya?"
  );

  root.innerHTML =
    '<div class="product-detail">' +
      '<div class="product-detail__media reveal">' +
        '<img src="' + product.image + '" alt="' + product.name + '">' +
      "</div>" +
      '<div class="reveal">' +
        '<nav class="breadcrumb" aria-label="Breadcrumb">' +
          '<a href="index.html">Home</a><span aria-hidden="true">/</span>' +
          '<a href="catalog.html">Catalog</a><span aria-hidden="true">/</span>' +
          '<a href="catalog.html?category=' + product.category + '">' + product.category + "</a>" +
        "</nav>" +
        '<h1 class="product-detail__title">' + product.name + "</h1>" +
        '<p class="product-detail__price">' + bhfFormatPrice(product.price) + "</p>" +
        '<p class="product-detail__desc">' + product.description + "</p>" +
        '<dl class="spec-list">' +
          "<div><dt>Dimensi</dt><dd>" + product.dimensions + "</dd></div>" +
          "<div><dt>Material</dt><dd>" + product.material + "</dd></div>" +
          "<div><dt>Finishing</dt><dd>" + product.finish + "</dd></div>" +
          "<div><dt>Ketersediaan</dt><dd>" + product.leadTime + "</dd></div>" +
        "</dl>" +
        '<div class="product-detail__actions">' +
          '<a class="btn btn--solid" href="https://wa.me/6281227160160?text=' + waMessage + '" target="_blank" rel="noopener">Tanya via WhatsApp</a>' +
          '<a class="btn" href="contact.html">Request Custom</a>' +
        "</div>" +
        '<p class="product-detail__note">Setiap produk dibuat dari kayu pilihan yang dikeringkan di kiln. ' +
          "Warna dan serat kayu dapat sedikit berbeda dari gambar — itulah karakter alami furniture kami.</p>" +
      "</div>" +
    "</div>";

  // Related pieces: same category first, then the rest
  var relatedGrid = document.querySelector("[data-related-grid]");
  if (relatedGrid) {
    var related = BHF_PRODUCTS
      .filter(function (p) { return p.id !== product.id; })
      .sort(function (a, b) {
        return (b.category === product.category) - (a.category === product.category);
      })
      .slice(0, 3);
    relatedGrid.innerHTML = related.map(bhfProductCardHTML).join("");
  }

  window.bhfObserveReveals();
})();
