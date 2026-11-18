// A small cursor tilt complements the CSS float. The source artwork stays intact.
(() => {
  const hero = document.querySelector('.hero--vitruvian');
  const artwork = hero?.querySelector('.nyala-vitruvian');
  if (!artwork) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  let visible = true;
  let frame = 0;
  let pointerX = 0;
  let pointerY = 0;

  function resetTilt() {
    cancelAnimationFrame(frame);
    frame = 0;
    artwork.style.removeProperty('--nyala-tilt-x');
    artwork.style.removeProperty('--nyala-tilt-y');
  }

  function syncMotion() {
    hero.classList.toggle('is-motion-paused', !visible || document.hidden);
    resetTilt();
  }

  hero.addEventListener('pointermove', event => {
    if (reducedMotion.matches || !finePointer.matches || !visible || document.hidden || event.pointerType !== 'mouse') return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const bounds = hero.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (pointerX - bounds.left) / bounds.width * 2 - 1));
      const y = Math.max(-1, Math.min(1, (pointerY - bounds.top) / bounds.height * 2 - 1));
      artwork.style.setProperty('--nyala-tilt-x', `${(-y * 2).toFixed(2)}deg`);
      artwork.style.setProperty('--nyala-tilt-y', `${(x * 2).toFixed(2)}deg`);
    });
  }, { passive: true });

  hero.addEventListener('pointerleave', resetTilt);
  hero.addEventListener('pointercancel', resetTilt);
  window.addEventListener('blur', resetTilt);
  reducedMotion.addEventListener('change', syncMotion);
  finePointer.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      syncMotion();
    });
    observer.observe(hero);
  }
  syncMotion();
})();
