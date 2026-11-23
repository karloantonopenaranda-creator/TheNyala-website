// Motion on the booking page, kept apart from the form's logic (js/booking.js): it watches what that script changes.
// - "Begin Your Reading" and its line are written onto the paper on arrival (after the sheet lifts).
// - Choosing a reading rewrites the line under it in ink, so the change on the far side of the page is noticed.
// - The questions a reading needs unfold into place as they appear, one group after another (a fade with reduced
//   motion). Nothing waits on this: the fields are usable at once.
// - A chosen date is written into the panel beside the calendar; the thank-you note is written out once sent.
(() => {
  const { gsap, Ink, NyalaMotion } = window;
  const root = document.documentElement;
  const ready = () => root.classList.remove('ink-pending');
  const form = document.getElementById('intake');
  if (!gsap || !Ink || !form) { ready(); return; }
  const reduced = NyalaMotion?.reduced ?? matchMedia('(prefers-reduced-motion: reduce)');

  // ----- the glade's heading and line
  const pane = document.querySelector('.book-pane-copy');
  if (pane) { const tl = Ink.write(pane); ready(); gsap.delayedCall(NyalaMotion?.arrivalDelay || 0, () => tl.play()); }
  else ready();

  // ----- the line under the heading follows the chosen reading: rewrite it when its words change
  const sub = document.getElementById('pane-sub');
  if (sub) {
    let last = sub.textContent;
    new MutationObserver(() => {
      if (sub.querySelector('.ink-unit') || sub.textContent === last) return; // our own split, or the same words again
      last = sub.textContent;
      Ink.write(sub).play();
    }).observe(sub, { childList: true });
  }

  // ----- questions unfold as they appear
  const unfold = els => {
    if (!els.length) return;
    gsap.fromTo(els, { autoAlpha: 0, y: reduced.matches ? 0 : 14 }, {
      autoAlpha: 1, y: 0, duration: reduced.matches ? .2 : .5, ease: 'power3.out',
      stagger: Math.min(.07, .35 / els.length), overwrite: true, clearProps: 'opacity,visibility,transform',
    });
  };
  new MutationObserver(records => {
    const shown = [...new Set(records.filter(r => r.oldValue !== null && !r.target.hidden).map(r => r.target))];
    const outer = shown.filter(el => !shown.some(o => o !== el && o.contains(el)) && !el.closest('[hidden]'));
    // when the whole panel first opens, its groups unfold one after another rather than all at once
    unfold(outer.flatMap(el => (el.matches('.intake-panel') ? [...el.children].filter(c => !c.hidden) : [el])));
  }).observe(form, { subtree: true, attributes: true, attributeFilter: ['hidden'], attributeOldValue: true });

  // ----- a chosen date is written into the panel
  for (const show of document.querySelectorAll('.datepick-show')) {
    new MutationObserver(() => {
      gsap.fromTo(show, { clipPath: 'inset(-20% 100% -20% -20%)' }, { clipPath: 'inset(-20% -20% -20% -20%)', duration: .5, ease: 'power2.inOut', overwrite: true, clearProps: 'clipPath' });
    }).observe(show.querySelector('.datepick-num'), { childList: true });
  }

  // ----- the thank-you note is written out
  const thanks = document.getElementById('thanks');
  if (thanks) {
    new MutationObserver(() => { if (!thanks.hidden) Ink.write(thanks).play(); })
      .observe(thanks, { attributes: true, attributeFilter: ['hidden'] });
  }
})();
