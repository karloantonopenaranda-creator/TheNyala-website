// Writes and draws each home-page section onto the paper as it comes into view (the pen itself is js/ink.js; the
// hidden states it needs are in css/style.css, "Scroll writing"). ScrollTrigger starts each piece once, in reading
// order, with pieces arriving together starting a moment apart; on arrival from the booking page the first ones wait
// for the paper sheet to lift. The colored decks are dealt instead: squared up, then fanned out from under the front
// card (a fade with reduced motion). Once dealt, a deck spreads a little under a mouse.
(() => {
  const { gsap, ScrollTrigger, Ink, NyalaMotion } = window;
  const root = document.documentElement;
  const ready = () => root.classList.remove('ink-pending'); // shows the pieces held back until they were prepared
  if (!gsap || !ScrollTrigger || !Ink) { ready(); return; }

  const PIECES = [
    '.hero--collage .hero-frame', '.readings .pricing-intro', '.readings .deck-fan', '.readings .offer',
    '.reviews-section .reviews-intro-copy', '.reviews-section .deck-fan', '.reviews-section .review-story',
  ].join(', ');
  const STAGGER = .12; // seconds between pieces that arrive together
  const reduced = NyalaMotion?.reduced ?? matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = NyalaMotion?.finePointer ?? matchMedia('(hover: hover) and (pointer: fine)');

  // ----- the colored decks: dealt from a squared-up pile into their fan
  const SPREAD = { 'deck-fan-card--left': { x: -12, rotation: -5 }, 'deck-fan-card--right': { x: 12, rotation: 5 }, 'deck-fan-card--center': { y: -6 } };
  const spreadOnHover = fan => {
    const cards = [...fan.querySelectorAll('.deck-fan-card')];
    let base = null;
    fan.classList.add('can-spread');
    fan.addEventListener('pointerenter', e => {
      if (e.pointerType !== 'mouse' || reduced.matches || !finePointer.matches) return;
      base ??= cards.map(c => ({ x: gsap.getProperty(c, 'x'), y: gsap.getProperty(c, 'y'), rotation: gsap.getProperty(c, 'rotation') }));
      cards.forEach((c, i) => {
        const d = SPREAD[[...c.classList].find(k => SPREAD[k])] || {};
        gsap.to(c, { x: base[i].x + (d.x || 0), y: base[i].y + (d.y || 0), rotation: base[i].rotation + (d.rotation || 0), duration: .5, ease: 'power3.out', overwrite: true });
      });
    });
    fan.addEventListener('pointerleave', () => {
      if (!base) return;
      const back = base; base = null;
      cards.forEach((c, i) => gsap.to(c, { ...back[i], duration: .45, ease: 'power3.out', overwrite: true, clearProps: 'transform' }));
    });
  };
  const deal = fan => {
    const tl = gsap.timeline({ paused: true });
    gsap.set(fan, { autoAlpha: 0 });
    if (reduced.matches) return tl.to(fan, { autoAlpha: 1, duration: .7, ease: 'power1.out', clearProps: 'opacity,visibility' });
    const cards = fan.querySelectorAll('.deck-fan-card'); // left, right, then the front card on top
    tl.to(fan, { autoAlpha: 1, duration: .3, ease: 'power1.out', clearProps: 'opacity,visibility' }, 0)
      // from one squared pile, a little low, to the fan the stylesheet sets (read back as each card's x, y, rotation)
      .from(cards, { x: 0, y: 22, rotation: 0, duration: 1.1, ease: 'power3.out', stagger: .08, clearProps: 'transform' }, .15)
      .add(() => spreadOnHover(fan));
    return tl;
  };

  const pieces = [...document.querySelectorAll(PIECES)];
  const timelines = new Map(pieces.map(p => [p, p.matches('.deck-fan') ? deal(p) : Ink.write(p)]));
  ready();

  const inOrder = (a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
  let wait = NyalaMotion?.arrivalDelay || 0; // only the first batch waits for the sheet
  ScrollTrigger.batch(pieces, {
    start: 'top 92%', once: true,
    onEnter: batch => {
      batch.sort(inOrder).forEach((el, n) => gsap.delayedCall(wait + n * STAGGER, () => timelines.get(el).play()));
      wait = 0;
    },
  });
})();
