// Inject shared header/footer partials, then load the rest of the JS.
(async function () {
  const slots = document.querySelectorAll('[data-include]');
  await Promise.all([...slots].map(async (el) => {
    try {
      const res = await fetch(el.dataset.include);
      el.outerHTML = await res.text();
    } catch (e) {
      console.warn('Include failed', e);
    }
  }));
  const yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();
  // Now load behaviour scripts (after partials are in DOM)
  const load = (src) => new Promise(r => { const s = document.createElement('script'); s.src = src; s.onload = r; document.body.appendChild(s); });
  await load('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js');
  await load('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js');
  await load('assets/js/main.js');
  await load('assets/js/animations.js');
  await load('assets/js/forms.js');
})();
