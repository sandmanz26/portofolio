/* ============================================================
   BHF — Product data
   Single source of truth for catalog, featured, and detail pages
   ============================================================ */

const BHF_PRODUCTS = [
  {
    id: "arjuna-lounge-chair",
    name: "Arjuna Lounge Chair",
    category: "Seating",
    price: 4850000,
    image: "assets/img/arjuna-lounge-chair.svg",
    tag: "Best Seller",
    featured: true,
    short: "Kursi santai kayu jati dengan sandaran rebah dan siluet ringan.",
    description:
      "Arjuna adalah kursi santai dengan rangka jati solid dan sudut sandaran yang dirancang untuk waktu istirahat panjang. Sambungan purus tradisional dikerjakan oleh pengrajin Jogja, difinishing natural matte yang mempertahankan serat kayu.",
    dimensions: "65 × 78 × 82 cm",
    material: "Jati solid (grade A)",
    finish: "Natural matte / Walnut dark",
    leadTime: "Ready stock di showroom"
  },
  {
    id: "srikandi-dining-chair",
    name: "Srikandi Dining Chair",
    category: "Seating",
    price: 1950000,
    image: "assets/img/srikandi-dining-chair.svg",
    tag: null,
    featured: false,
    short: "Kursi makan berjeruji vertikal, ringan namun kokoh.",
    description:
      "Srikandi memadukan sandaran jeruji vertikal dengan dudukan lebar yang nyaman. Bentuknya sederhana sehingga mudah dipadukan dengan meja makan gaya apa pun, dari skandinavia hingga japandi.",
    dimensions: "45 × 52 × 88 cm",
    material: "Jati solid / Mahoni",
    finish: "Natural matte / Hitam duco",
    leadTime: "Ready stock di showroom"
  },
  {
    id: "bima-sofa",
    name: "Bima Three-Seat Sofa",
    category: "Seating",
    price: 12500000,
    image: "assets/img/bima-sofa.svg",
    tag: "Featured",
    featured: true,
    short: "Sofa tiga dudukan berangka jati dengan bantalan lepas-pasang.",
    description:
      "Bima adalah sofa tiga dudukan dengan rangka jati solid yang terlihat pada sisi lengan. Bantalan busa premium berbalut kain linen dapat dilepas untuk dicuci, dan pilihan kain dapat disesuaikan dengan interior Anda.",
    dimensions: "210 × 85 × 78 cm",
    material: "Rangka jati solid, busa premium",
    finish: "Kain linen (pilihan warna)",
    leadTime: "Custom 4–6 minggu"
  },
  {
    id: "shinta-coffee-table",
    name: "Shinta Coffee Table",
    category: "Tables",
    price: 3250000,
    image: "assets/img/shinta-coffee-table.svg",
    tag: null,
    featured: true,
    short: "Meja kopi oval dengan kaki menyilang yang anggun.",
    description:
      "Permukaan oval Shinta dibuat dari papan jati utuh dengan tepian membulat halus. Kaki menyilang memberi kesan ringan sekaligus stabil, cocok menjadi titik tengah ruang keluarga minimalis.",
    dimensions: "120 × 60 × 42 cm",
    material: "Jati solid (grade A)",
    finish: "Natural matte",
    leadTime: "Ready stock di showroom"
  },
  {
    id: "rama-dining-table",
    name: "Rama Dining Table",
    category: "Tables",
    price: 8900000,
    image: "assets/img/rama-dining-table.svg",
    tag: "Best Seller",
    featured: true,
    short: "Meja makan enam kursi dari papan jati tebal 4 cm.",
    description:
      "Rama dibuat dari papan jati tebal 4 cm dengan kaki penuh di kedua ujung — sebuah pernyataan tentang kesederhanaan dan kekokohan. Tersedia panjang 160, 180, dan 200 cm, atau ukuran custom sesuai ruang Anda.",
    dimensions: "180 × 90 × 76 cm",
    material: "Jati solid, top 4 cm",
    finish: "Natural matte / Smoked oak",
    leadTime: "Ready stock & custom"
  },
  {
    id: "nakula-console",
    name: "Nakula Console Table",
    category: "Storage",
    price: 4200000,
    image: "assets/img/nakula-console.svg",
    tag: null,
    featured: false,
    short: "Meja konsol dua laci untuk foyer atau ruang tamu.",
    description:
      "Nakula adalah meja konsol ramping dengan dua laci berpegangan bulat. Kedalamannya hanya 35 cm sehingga pas untuk lorong dan foyer, tanpa mengorbankan ruang simpan.",
    dimensions: "120 × 35 × 80 cm",
    material: "Jati solid & veneer jati",
    finish: "Natural matte / Hitam duco",
    leadTime: "Custom 3–4 minggu"
  },
  {
    id: "dewi-bed",
    name: "Dewi Bed Frame",
    category: "Bedroom",
    price: 9800000,
    image: "assets/img/dewi-bed.svg",
    tag: "Featured",
    featured: true,
    short: "Ranjang berkepala tinggi dengan garis tenang dan proporsi rendah.",
    description:
      "Dewi mengusung headboard panel tinggi dan dipan rendah yang membuat kamar terasa lapang. Rangka jati solid dirakit tanpa baut terlihat; tersedia ukuran queen dan king, serta custom.",
    dimensions: "170 × 210 × 110 cm (Queen)",
    material: "Jati solid & panel jati",
    finish: "Natural matte / Walnut dark",
    leadTime: "Custom 4–6 minggu"
  },
  {
    id: "sadewa-nightstand",
    name: "Sadewa Nightstand",
    category: "Bedroom",
    price: 2150000,
    image: "assets/img/sadewa-nightstand.svg",
    tag: null,
    featured: false,
    short: "Nakas dua laci dengan kaki miring yang ramping.",
    description:
      "Pendamping ranjang Dewi, nakas Sadewa memiliki dua laci dengan rel kayu tradisional yang halus. Ukurannya kompak namun cukup untuk kebutuhan samping tempat tidur.",
    dimensions: "45 × 40 × 55 cm",
    material: "Jati solid",
    finish: "Natural matte / Walnut dark",
    leadTime: "Ready stock di showroom"
  },
  {
    id: "gatot-wardrobe",
    name: "Gatot Wardrobe",
    category: "Bedroom",
    price: 14500000,
    image: "assets/img/gatot-wardrobe.svg",
    tag: null,
    featured: false,
    short: "Lemari dua pintu dengan interior yang dapat dikonfigurasi.",
    description:
      "Gatot adalah lemari pakaian dua pintu dengan pegangan kayu tersembunyi. Interiornya — rel gantung, ambalan, dan laci — dapat dikonfigurasi sesuai kebutuhan. Tersedia juga versi tiga pintu custom.",
    dimensions: "120 × 60 × 210 cm",
    material: "Jati solid & panel jati",
    finish: "Natural matte / Smoked oak",
    leadTime: "Custom 5–7 minggu"
  },
  {
    id: "kresna-bookshelf",
    name: "Kresna Bookshelf",
    category: "Storage",
    price: 5600000,
    image: "assets/img/kresna-bookshelf.svg",
    tag: "New",
    featured: false,
    short: "Rak buku terbuka empat tingkat berproporsi arsitektural.",
    description:
      "Kresna adalah rak terbuka empat tingkat dengan rangka jati tebal. Proporsinya yang tegas menjadikannya elemen arsitektural pada dinding, baik untuk buku, keramik, maupun koleksi Anda.",
    dimensions: "95 × 35 × 180 cm",
    material: "Jati solid",
    finish: "Natural matte / Hitam duco",
    leadTime: "Ready stock & custom"
  },
  {
    id: "laksmana-sideboard",
    name: "Laksmana Sideboard",
    category: "Storage",
    price: 7800000,
    image: "assets/img/laksmana-sideboard.svg",
    tag: "New",
    featured: true,
    short: "Bufet tiga pintu dengan garis horizontal yang panjang dan tenang.",
    description:
      "Laksmana membentang rendah dan panjang — bufet tiga pintu dengan ambalan dalam yang dapat diatur. Cocok sebagai kredensa ruang makan maupun kabinet media di ruang keluarga.",
    dimensions: "180 × 45 × 75 cm",
    material: "Jati solid & veneer jati",
    finish: "Natural matte / Walnut dark",
    leadTime: "Ready stock & custom"
  },
  {
    id: "drupadi-bench",
    name: "Drupadi Bench",
    category: "Seating",
    price: 2750000,
    image: "assets/img/drupadi-bench.svg",
    tag: null,
    featured: false,
    short: "Bangku panjang serbaguna untuk meja makan atau foyer.",
    description:
      "Drupadi adalah bangku jati sepanjang 150 cm dengan penopang silang bawah. Serbaguna: pendamping meja Rama, bangku foyer, atau dudukan di ujung ranjang.",
    dimensions: "150 × 38 × 45 cm",
    material: "Jati solid",
    finish: "Natural matte",
    leadTime: "Ready stock di showroom"
  }
];

const BHF_CATEGORIES = ["All", "Seating", "Tables", "Bedroom", "Storage"];

function bhfFormatPrice(value) {
  return "Rp " + value.toLocaleString("id-ID");
}

function bhfGetProduct(id) {
  return BHF_PRODUCTS.find(function (p) { return p.id === id; }) || null;
}

function bhfProductCardHTML(product) {
  var tag = product.tag
    ? '<span class="product-card__tag">' + product.tag + "</span>"
    : "";
  return (
    '<a class="product-card reveal" href="product.html?id=' + product.id + '">' +
      '<div class="product-card__media">' +
        tag +
        '<img src="' + product.image + '" alt="' + product.name + '">' +
      "</div>" +
      '<div class="product-card__body">' +
        "<div>" +
          '<h3 class="product-card__name">' + product.name + "</h3>" +
          '<p class="product-card__cat">' + product.category + "</p>" +
        "</div>" +
        '<p class="product-card__price">' + bhfFormatPrice(product.price) + "</p>" +
      "</div>" +
    "</a>"
  );
}
