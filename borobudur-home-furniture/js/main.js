/* ============================================================
   BHF — Shared behaviour: header, mobile nav, reveal, footer
   ============================================================ */

(function () {
  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");

  // Header background after scrolling past the top
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile navigation
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("nav-locked", open);
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-locked");
      }
    });
  }

  // Mark the current page in the nav
  var page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-nav a").forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === page || (page === "product.html" && href === "catalog.html")) {
      link.classList.add("is-active");
    }
  });

  // Reveal-on-scroll
  window.bhfObserveReveals = function () {
    var items = document.querySelectorAll(".reveal:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach(function (el) { observer.observe(el); });
  };
  window.bhfObserveReveals();

  // Featured products on the home page
  var featuredGrid = document.querySelector("[data-featured-grid]");
  if (featuredGrid && typeof BHF_PRODUCTS !== "undefined") {
    var featured = BHF_PRODUCTS.filter(function (p) { return p.featured; }).slice(0, 6);
    featuredGrid.innerHTML = featured.map(bhfProductCardHTML).join("");
    window.bhfObserveReveals();
  }

  // Footer year
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
