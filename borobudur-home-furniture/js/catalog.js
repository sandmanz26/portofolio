/* ============================================================
   BHF — Catalog page: category filter + grid rendering
   ============================================================ */

(function () {
  var grid = document.querySelector("[data-catalog-grid]");
  var filterBar = document.querySelector("[data-filter-bar]");
  var countEl = document.querySelector("[data-catalog-count]");
  if (!grid || !filterBar) return;

  var activeCategory = "All";

  // Allow deep-linking: catalog.html?category=Seating
  var param = new URLSearchParams(location.search).get("category");
  if (param && BHF_CATEGORIES.indexOf(param) !== -1) {
    activeCategory = param;
  }

  function render() {
    var items = BHF_PRODUCTS.filter(function (p) {
      return activeCategory === "All" || p.category === activeCategory;
    });

    if (countEl) {
      countEl.textContent = items.length + (items.length === 1 ? " piece" : " pieces");
    }

    grid.innerHTML = items.length
      ? items.map(bhfProductCardHTML).join("")
      : '<p class="catalog-empty">No products in this category yet.</p>';

    window.bhfObserveReveals();
  }

  filterBar.innerHTML = BHF_CATEGORIES.map(function (cat) {
    return '<button class="filter-btn" type="button" data-category="' + cat + '">' + cat + "</button>";
  }).join("");

  function syncButtons() {
    filterBar.querySelectorAll(".filter-btn").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.dataset.category === activeCategory);
    });
  }

  filterBar.addEventListener("click", function (event) {
    var btn = event.target.closest(".filter-btn");
    if (!btn) return;
    activeCategory = btn.dataset.category;
    syncButtons();
    render();
  });

  syncButtons();
  render();
})();
