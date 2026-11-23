// Smooth scrolling and the moments between places, on both pages.
// - Lenis smooths wheel scrolling (touch keeps its native feel). GSAP's ticker drives it, so ScrollTrigger and the
//   writing (js/ink.js) stay in step. Lenis follows the visitor's reduced-motion setting by itself: no smoothing and
//   instant jumps. Scroll boxes inside the page (the intake on wide screens) keep their own native scrolling.
// - Same-page links glide to their section and hand focus to it; the placeholder "#" link goes nowhere.
// - On the home page a compact bar (wordmark, Readings, Reviews) returns on scrolling up once the first screen has
//   gone, and marks the section in view.
// - Links to the other page lay a sheet of the paper over this one before leaving; the next page lifts it away
//   (css/style.css, "Page sheet"). A cross-fade with reduced motion.
// - The framed buttons lean gently towards a nearby mouse (after React Bits' Magnet), never with touch or reduced motion.
(() => {
  const { gsap, ScrollTrigger, Lenis } = window;
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  if (gsap && ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  // ----- the page sheet: arriving
  const arriving = root.classList.contains('is-arriving');
  if (arriving) setTimeout(() => root.classList.remove('is-arriving'), 1000); // after the lift (css), so leaving can play
  addEventListener('pageshow', e => { if (e.persisted) root.classList.remove('is-leaving', 'is-arriving'); }); // back/forward cache

  // ----- Lenis
  let lenis = null;
  if (gsap && ScrollTrigger && Lenis) {
    lenis = new Lenis({ allowNestedScroll: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  // shared with the page scripts: the writing waits for the sheet to lift
  window.NyalaMotion = { lenis, reduced, finePointer, arrivalDelay: arriving ? .45 : 0 };

  // ----- same-page links glide to their section; links to the other page lay the sheet down first
  const page = url => url.pathname.replace(/index\.html$/, '') + url.search;
  const glide = (target, hash) => {
    if (lenis) lenis.scrollTo(target, { duration: 1.3, easing: t => 1 - Math.pow(1 - t, 4) });
    else target.scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth' });
    if (location.hash !== hash) history.pushState(null, '', hash);
    // keyboard and screen reader users carry on from the section, as with a native jump
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  };
  const leave = url => {
    try { sessionStorage.setItem('nyala-sheet', '1'); } catch { /* storage blocked: the next page simply shows */ }
    root.classList.add('is-leaving');
    setTimeout(() => { location.href = url; }, reduced.matches ? 160 : 480);
  };
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if ((a.target && a.target !== '_self') || a.hasAttribute('download')) return;
    if (a.getAttribute('href') === '#') { e.preventDefault(); return; } // a placeholder (Daily Card): nowhere to go yet
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    if (page(url) === page(location)) {
      const target = url.hash && document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      glide(target, url.hash);
      return;
    }
    e.preventDefault();
    leave(url.href);
  });

  if (!gsap || !ScrollTrigger) return;

  // ----- the compact bar (home page)
  const bar = document.querySelector('.topbar'), hero = document.querySelector('.hero');
  if (bar && hero) {
    let shown = false;
    const show = on => {
      if (!on && bar.contains(document.activeElement)) return; // never pull it away from someone tabbing through it
      if (on === shown) return;
      shown = on; bar.inert = !on; bar.classList.toggle('is-shown', on);
    };
    ScrollTrigger.create({
      trigger: hero, start: 'bottom top', end: 'max',
      onUpdate: self => show(self.direction < 0),
      onLeaveBack: () => show(false),
    });
    // the section in view is marked in the bar
    for (const link of bar.querySelectorAll('nav a[href^="#"]')) {
      const section = document.querySelector(link.getAttribute('href'));
      if (!section) continue;
      ScrollTrigger.create({
        trigger: section, start: 'top 45%', end: 'bottom 45%',
        onToggle: self => { if (self.isActive) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); },
      });
    }
  }

  // ----- the framed buttons lean towards a nearby mouse (after React Bits' Magnet), a few pixels at most
  const magnets = [...document.querySelectorAll('.hero-cta')].map(el => ({
    el, x: gsap.quickTo(el, 'x', { duration: .6, ease: 'power3.out' }), y: gsap.quickTo(el, 'y', { duration: .6, ease: 'power3.out' }), on: false,
  }));
  const REACH = 40, PULL = .14, MOST = 6;
  const clamp = gsap.utils.clamp(-MOST, MOST);
  let pending = 0, px = 0, py = 0;
  const pull = () => {
    pending = 0;
    for (const m of magnets) {
      const r = m.el.getBoundingClientRect();
      const near = r.width && px > r.left - REACH && px < r.right + REACH && py > r.top - REACH && py < r.bottom + REACH;
      if (near) { m.on = true; m.x(clamp((px - (r.left + r.width / 2)) * PULL)); m.y(clamp((py - (r.top + r.height / 2)) * PULL)); }
      else if (m.on) { m.on = false; m.x(0); m.y(0); }
    }
  };
  const release = () => { for (const m of magnets) if (m.on) { m.on = false; m.x(0); m.y(0); } };
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse' || reduced.matches || !finePointer.matches) return;
    px = e.clientX; py = e.clientY;
    if (!pending) pending = requestAnimationFrame(pull);
  }, { passive: true });
  if (lenis) lenis.on('scroll', () => { if (!pending && magnets.some(m => m.on)) pending = requestAnimationFrame(pull); }); // the page moved under a still mouse
  document.documentElement.addEventListener('pointerleave', release);
  addEventListener('blur', release);
  reduced.addEventListener('change', release);
})();
