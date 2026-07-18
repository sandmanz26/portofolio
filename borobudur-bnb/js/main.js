/* =========================================================================
   BOROBUDUR BNB — INTERACTIONS
   Vanilla JS. No build step, no dependencies.
   ========================================================================= */
(function () {
  'use strict';

  var WA_NUMBER = '6281390000123'; // WhatsApp number in international format, no leading +
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initDrawer();
    initReveal();
    initCounters();
    initParallax();
    initTestimonials();
    initGallery();
    initFaq();
    initFloatButtons();
    initContactForm();
    initRoomBookingLinks();
    initYear();
  });

  /* ---------------- NAV ---------------- */
  function initNav() {
    var nav = document.querySelector('.nav');
    if (!nav) return;
    var lastY = window.scrollY;
    var ticking = false;

    function onScroll() {
      var y = window.scrollY;
      nav.classList.toggle('is-scrolled', y > 40);
      if (y > 260 && y > lastY) {
        nav.classList.add('is-hidden');
      } else {
        nav.classList.remove('is-hidden');
      }
      lastY = y;
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    onScroll();

    // active link by current page
    var path = (window.location.pathname.split('/').pop() || 'index.html');
    document.querySelectorAll('.nav__links a, .drawer__links a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) a.classList.add('is-active');
    });
  }

  /* ---------------- MOBILE DRAWER ---------------- */
  function initDrawer() {
    var burger = document.querySelector('.nav__burger');
    var drawer = document.querySelector('.drawer');
    if (!burger || !drawer) return;
    var closeBtn = drawer.querySelector('.drawer__close');
    var scrim = drawer.querySelector('.drawer__scrim');

    function open() { drawer.classList.add('is-open'); document.body.classList.add('no-scroll'); }
    function close() { drawer.classList.remove('is-open'); document.body.classList.remove('no-scroll'); }

    burger.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (scrim) scrim.addEventListener('click', close);
    drawer.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* ---------------- SCROLL REVEAL ---------------- */
  function initReveal() {
    var targets = document.querySelectorAll('[data-reveal], [data-reveal-group]');
    if (!targets.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function (t) { t.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ---------------- COUNTERS ---------------- */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    function animate(el) {
      var end = parseFloat(el.getAttribute('data-count'));
      var decimals = (el.getAttribute('data-count').split('.')[1] || '').length;
      var suffix = el.getAttribute('data-suffix') || '';
      if (reduceMotion) { el.textContent = end.toFixed(decimals) + suffix; return; }
      var start = 0;
      var duration = 1600;
      var startTime = null;
      function step(ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = start + (end - start) * eased;
        el.textContent = value.toFixed(decimals) + suffix;
        if (progress < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) { counters.forEach(animate); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animate(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { io.observe(c); });
  }

  /* ---------------- PARALLAX HERO ---------------- */
  function initParallax() {
    if (reduceMotion) return;
    var media = document.querySelector('.hero__media img, .pagehero__media img');
    if (!media) return;
    var ticking = false;
    function onScroll() {
      var y = window.scrollY;
      var translate = Math.min(y * 0.28, 160);
      var scale = 1.08 + Math.min(y * 0.00012, 0.05);
      media.style.transform = 'translateY(' + translate + 'px) scale(' + scale + ')';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
  }

  /* ---------------- TESTIMONIAL CAROUSEL ---------------- */
  function initTestimonials() {
    var root = document.querySelector('[data-testi]');
    if (!root) return;
    var slides = Array.prototype.slice.call(root.querySelectorAll('.testi__slide'));
    var dotsWrap = root.querySelector('.testi__nav');
    var prevBtn = root.querySelector('.testi__arrow--prev');
    var nextBtn = root.querySelector('.testi__arrow--next');
    var index = 0;
    var timer;

    slides.forEach(function (s, i) {
      if (dotsWrap) {
        var dot = document.createElement('button');
        dot.className = 'testi__dot';
        dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
        dot.addEventListener('click', function () { go(i); reset(); });
        dotsWrap.appendChild(dot);
      }
    });
    var dots = dotsWrap ? Array.prototype.slice.call(dotsWrap.children) : [];

    function go(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, si) { s.classList.toggle('is-active', si === index); });
      dots.forEach(function (d, di) { d.classList.toggle('is-active', di === index); });
    }
    function next() { go(index + 1); }
    function prev() { go(index - 1); }
    function reset() {
      clearInterval(timer);
      if (!reduceMotion) timer = setInterval(next, 6000);
    }

    if (nextBtn) nextBtn.addEventListener('click', function () { next(); reset(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); reset(); });

    go(0);
    reset();
  }

  /* ---------------- GALLERY LIGHTBOX ---------------- */
  function initGallery() {
    var items = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
    if (!items.length) return;

    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = '<button class="lightbox__nav lightbox__nav--prev" aria-label="Previous photo">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg></button>' +
      '<img alt="">' +
      '<button class="lightbox__nav lightbox__nav--next" aria-label="Next photo">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></button>' +
      '<button class="lightbox__close" aria-label="Close">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>';
    document.body.appendChild(lb);

    var img = lb.querySelector('img');
    var current = 0;

    function open(i) {
      current = i;
      var src = items[i].getAttribute('data-lightbox') || items[i].querySelector('img').src;
      img.src = src;
      img.alt = items[i].querySelector('img') ? items[i].querySelector('img').alt : '';
      lb.classList.add('is-open');
      document.body.classList.add('no-scroll');
    }
    function close() { lb.classList.remove('is-open'); document.body.classList.remove('no-scroll'); }
    function step(dir) { open((current + dir + items.length) % items.length); }

    items.forEach(function (el, i) { el.addEventListener('click', function () { open(i); }); });
    lb.querySelector('.lightbox__close').addEventListener('click', close);
    lb.querySelector('.lightbox__nav--prev').addEventListener('click', function () { step(-1); });
    lb.querySelector('.lightbox__nav--next').addEventListener('click', function () { step(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    });
  }

  /* ---------------- FAQ ACCORDION ---------------- */
  function initFaq() {
    var items = document.querySelectorAll('.faq__item');
    items.forEach(function (item) {
      var q = item.querySelector('.faq__q');
      var a = item.querySelector('.faq__a');
      if (!q || !a) return;
      q.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');
        items.forEach(function (other) {
          other.classList.remove('is-open');
          other.querySelector('.faq__a').style.maxHeight = 0;
        });
        if (!isOpen) {
          item.classList.add('is-open');
          a.style.maxHeight = a.scrollHeight + 'px';
        }
      });
    });
  }

  /* ---------------- FLOATING BUTTONS ---------------- */
  function initFloatButtons() {
    var waFab = document.querySelector('.fab--wa');
    if (waFab) waFab.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent('Halo Borobudur BnB, saya ingin tanya ketersediaan kamar.');

    var topFab = document.querySelector('.fab--top');
    if (topFab) {
      window.addEventListener('scroll', function () {
        topFab.classList.toggle('is-visible', window.scrollY > 700);
      }, { passive: true });
      topFab.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    }
  }

  /* ---------------- CONTACT FORM -> WHATSAPP ---------------- */
  function initContactForm() {
    var form = document.querySelector('#contact-form');
    if (!form) return;
    var success = form.querySelector('.form-success');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.querySelector('#name');
      var checkin = form.querySelector('#checkin');
      var guests = form.querySelector('#guests');
      var valid = true;

      [name].forEach(function (field) {
        var errorEl = field.parentElement.querySelector('.field-error');
        if (!field.value.trim()) {
          if (errorEl) errorEl.textContent = 'This field is required.';
          field.style.borderColor = '#b5602f';
          valid = false;
        } else if (errorEl) {
          errorEl.textContent = '';
          field.style.borderColor = '';
        }
      });

      if (!valid) return;

      var msg = 'Halo Borobudur BnB, saya ' + name.value.trim() + '.';
      if (checkin && checkin.value) msg += '\nCheck-in: ' + checkin.value;
      var checkout = form.querySelector('#checkout');
      if (checkout && checkout.value) msg += '\nCheck-out: ' + checkout.value;
      if (guests && guests.value) msg += '\nTamu: ' + guests.value;
      var roomType = form.querySelector('#room-type');
      if (roomType && roomType.value) msg += '\nTipe kamar: ' + roomType.value;
      var message = form.querySelector('#message');
      if (message && message.value.trim()) msg += '\nPesan: ' + message.value.trim();

      var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);

      if (success) success.classList.add('is-visible');
      window.open(url, '_blank', 'noopener');
      form.reset();
    });
  }

  /* ---------------- ROOM CARD BOOKING LINKS ---------------- */
  function initRoomBookingLinks() {
    document.querySelectorAll('[data-book-room]').forEach(function (btn) {
      var room = btn.getAttribute('data-book-room');
      var msg = 'Halo Borobudur BnB, saya ingin memesan ' + room + '. Mohon info ketersediaan dan harga.';
      btn.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
    });
  }

  /* ---------------- FOOTER YEAR ---------------- */
  function initYear() {
    var el = document.querySelector('[data-year]');
    if (el) el.textContent = new Date().getFullYear();
  }
})();
