/* ============================================================
   Cookie-consent + blokkade van externe diensten.
   Lettertypen worden zelf gehost (first-party) en laden altijd.
   Externe diensten (GSAP CDN + Google Maps) worden PAS geladen
   nadat de bezoeker expliciet akkoord geeft.
   Keuze opgeslagen in localStorage: 'tpv-cookie-consent' = 'accept' | 'decline'.
   ============================================================ */
(function () {
  var KEY = 'tpv-cookie-consent';
  var GSAP = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js';
  var SCROLLTRIGGER = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js';

  var consent = localStorage.getItem(KEY); // 'accept' | 'decline' | null

  function injectScript(src, onload) {
    var s = document.createElement('script');
    s.src = src;
    if (onload) s.onload = onload;
    document.body.appendChild(s);
  }

  // Eigen (first-party) scripts laden we altijd. GSAP alleen bij akkoord.
  function loadAppScripts(withGsap) {
    var locals = ['/assets/js/main.js', '/assets/js/animations.js', '/assets/js/forms.js'];
    function chain(i) {
      if (i >= locals.length) return;
      injectScript(locals[i], function () { chain(i + 1); });
    }
    if (withGsap) {
      injectScript(GSAP, function () { injectScript(SCROLLTRIGGER, function () { chain(0); }); });
    } else {
      chain(0);
    }
  }

  // Vervang geblokkeerde-kaart-placeholders door de echte Google Maps iframe.
  function renderMaps() {
    document.querySelectorAll('[data-map]').forEach(function (box) {
      var src = box.getAttribute('data-map-src');
      if (!src) return;
      var f = document.createElement('iframe');
      f.loading = 'lazy';
      f.title = box.getAttribute('data-map-title') || 'Kaart';
      f.src = src;
      f.style.border = '0';
      box.replaceWith(f);
    });
  }

  function applyAccept() {
    renderMaps();
  }

  // ---- Initiële lading ----
  if (consent === 'accept') {
    loadAppScripts(true);
    renderMaps();
  } else {
    loadAppScripts(false); // geen gsap/maps tot akkoord
  }

  // ---- Banner ----
  var banner = document.querySelector('.cookie-banner');
  if (banner && consent === null) {
    setTimeout(function () { banner.classList.add('is-show'); }, 800);
  }

  // ---- Klik-afhandeling ----
  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target : null;
    if (!el) return;

    // "Cookievoorkeuren" in de footer → banner opnieuw tonen
    var settings = el.closest('[data-cookie-settings]');
    if (settings) {
      e.preventDefault();
      if (banner) banner.classList.add('is-show');
      return;
    }

    // Banner-knoppen én "kaart laden"-knop ([data-cookie])
    var btn = el.closest('[data-cookie]');
    if (!btn) return;
    var choice = btn.getAttribute('data-cookie'); // 'accept' | 'decline'
    var prev = localStorage.getItem(KEY);
    localStorage.setItem(KEY, choice);
    if (banner) banner.classList.remove('is-show');
    if (choice === 'accept') {
      applyAccept();
    } else if (choice === 'decline' && prev === 'accept') {
      // Externe diensten waren al geladen → herladen om ze écht te blokkeren
      location.reload();
    }
  });
})();
