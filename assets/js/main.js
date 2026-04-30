// Header scroll state
const header = document.querySelector('.site-header');
const onScroll = () => {
  if (window.scrollY > 12) header.classList.add('is-scrolled');
  else header.classList.remove('is-scrolled');

  const top = document.querySelector('.to-top');
  if (top) {
    if (window.scrollY > 600) top.classList.add('is-show');
    else top.classList.remove('is-show');
  }
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile drawer
const burger = document.querySelector('.hamburger');
const drawer = document.querySelector('.mobile-drawer');
if (burger && drawer) {
  burger.addEventListener('click', () => {
    const open = drawer.classList.toggle('is-open');
    burger.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    drawer.classList.remove('is-open');
    burger.classList.remove('is-open');
    document.body.style.overflow = '';
  }));
}

// To top
const toTop = document.querySelector('.to-top');
if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Cookie banner
const cookieKey = 'tpv-cookie-consent';
const banner = document.querySelector('.cookie-banner');
if (banner && !localStorage.getItem(cookieKey)) {
  setTimeout(() => banner.classList.add('is-show'), 800);
  banner.querySelectorAll('[data-cookie]').forEach(b => {
    b.addEventListener('click', () => {
      localStorage.setItem(cookieKey, b.dataset.cookie);
      banner.classList.remove('is-show');
    });
  });
}

// Team filter chips
const chips = document.querySelectorAll('.team-filters .chip');
const teamCards = document.querySelectorAll('.team-grid .team-card');
if (chips.length && teamCards.length) {
  chips.forEach(chip => chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('is-active'));
    chip.classList.add('is-active');
    const f = chip.dataset.filter;
    teamCards.forEach(card => {
      const role = card.dataset.role;
      card.style.display = (f === 'all' || role === f) ? '' : 'none';
    });
  }));
}

// Spec page scroll-spy
const specNavLinks = document.querySelectorAll('.spec-nav a');
const specSections = document.querySelectorAll('.spec-section');
if (specNavLinks.length && specSections.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        specNavLinks.forEach(a => {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  specSections.forEach(s => io.observe(s));
}

// Bio modal
document.querySelectorAll('[data-bio]').forEach(card => {
  card.addEventListener('click', () => {
    const id = card.dataset.bio;
    const m = document.querySelector('#' + id);
    if (m) m.classList.add('is-open');
  });
});

// Team horizontal scroll arrows (home page)
const teamScroll = document.querySelector('.team-scroll');
const teamBtns = document.querySelectorAll('.team-scroll-btn');
if (teamScroll && teamBtns.length) {
  const updateBtns = () => {
    const max = teamScroll.scrollWidth - teamScroll.clientWidth - 2;
    teamBtns.forEach(btn => {
      const dir = +btn.dataset.dir;
      if (dir < 0) btn.disabled = teamScroll.scrollLeft <= 2;
      else btn.disabled = teamScroll.scrollLeft >= max;
    });
  };
  teamBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = teamScroll.querySelector('.team-card');
      const step = card ? card.getBoundingClientRect().width + 16 : 280;
      teamScroll.scrollBy({ left: step * +btn.dataset.dir, behavior: 'smooth' });
    });
  });
  teamScroll.addEventListener('scroll', updateBtns, { passive: true });
  window.addEventListener('resize', updateBtns);
  updateBtns();
}
document.querySelectorAll('.modal-backdrop').forEach(b => {
  b.addEventListener('click', (e) => {
    if (e.target === b || e.target.classList.contains('close')) b.classList.remove('is-open');
  });
});

// Counter animation
const counters = document.querySelectorAll('[data-count]');
if (counters.length && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const start = performance.now();
        const dur = 1400;
        const step = (t) => {
          const p = Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toLocaleString('nl-NL');
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        io.unobserve(el);
      }
    });
  }, { threshold: .4 });
  counters.forEach(c => io.observe(c));
}
