// Scroll animations: GSAP if available, IntersectionObserver fallback otherwise.
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduced) {
  document.querySelectorAll('.reveal, [data-reveal]').forEach(el => el.classList.add('is-in'));
} else if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance
  const heroLines = document.querySelectorAll('.hero h1 .line span');
  if (heroLines.length) {
    gsap.from(heroLines, {
      yPercent: 110,
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.08,
      delay: 0.1
    });
  }
  gsap.from('.hero-sub, .hero-cta, .hero-aside > *', {
    y: 24, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08, delay: 0.4
  });

  // Generic reveal
  document.querySelectorAll('[data-reveal]').forEach(el => {
    const type = el.dataset.reveal;
    const delay = parseFloat(el.dataset.delay || 0);
    let from = { y: 32, opacity: 0 };
    if (type === 'left') from = { x: -40, opacity: 0 };
    if (type === 'right') from = { x: 40, opacity: 0 };
    if (type === 'mask') from = { clipPath: 'inset(0 100% 0 0)' };
    gsap.from(el, {
      ...from,
      duration: 0.9,
      ease: 'expo.out',
      delay,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true }
    });
  });

  // Stagger groups
  document.querySelectorAll('[data-stagger]').forEach(group => {
    const children = group.children;
    gsap.from(children, {
      y: 32, opacity: 0,
      duration: 0.8, ease: 'expo.out',
      stagger: 0.08,
      scrollTrigger: { trigger: group, start: 'top 85%', once: true }
    });
  });

  // Parallax shapes
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const intensity = parseFloat(el.dataset.parallax || 0.3);
    gsap.to(el, {
      yPercent: intensity * 100,
      ease: 'none',
      scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  // Reveal mask for headings
  document.querySelectorAll('[data-reveal="line"]').forEach(el => {
    gsap.from(el, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 1.1, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true }
    });
  });

  // Header background already handled by main.js
} else {
  // IntersectionObserver fallback
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        if (e.target.dataset.stagger !== undefined) {
          [...e.target.children].forEach((c, i) => {
            c.style.transitionDelay = (i * 80) + 'ms';
            c.classList.add('is-in');
          });
        }
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('[data-reveal], [data-stagger], .reveal').forEach(el => {
    el.classList.add('reveal');
    if (el.dataset.stagger !== undefined) {
      [...el.children].forEach(c => c.classList.add('reveal'));
    }
    io.observe(el);
  });
}
