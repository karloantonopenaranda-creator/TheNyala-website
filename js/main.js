(() => {
  /* ---------- Hero: size Nyala to the window ---------- */
  // As large as the window allows while her outline never touches the headline and her head stays clear of the menu.
  // On landscape screens she stands inside the paper's embossed frame (see .hero::before in CSS): her horns stay below
  // its top rule even at the top of her float, and her feet above its bottom rule. Elsewhere she may use the whole
  // height, her feet reaching the bottom edge. Her star face stays on the page's centre line (see .nyala in CSS).
  const hero = document.querySelector('.hero'), nyala = hero.querySelector('.nyala'), nav = document.querySelector('.nav');
  const framed = matchMedia('(min-width: 1150px) and (min-aspect-ratio: 3/2)'); // the same test as the framed paper in CSS
  const ASPECT = 143 / 436, FLOAT = .03; // her width to height, and how far she floats up (a fraction of her height)
  // Her left edge in 40 horizontal bands, top to bottom, as a fraction of her width (measured from assets/nyala.png)
  const LEFT_EDGE = [.52,.50,.45,.45,.43,.41,.41,.39,.34,.28,.22,.18,.09,.04,.04,.08,.25,.27,.23,.31,.28,.19,.18,.28,.26,.24,.24,.25,.28,.31,.30,.26,.18,.38,.36,.34,.27,.21,.57,.62];
  const inkBox = el => { const rg = document.createRange(); rg.selectNodeContents(el); return rg.getBoundingClientRect(); };
  function fitNyala() {
    const r = hero.getBoundingClientRect(), H = r.height, cx = r.width / 2;
    const lines = [...hero.querySelectorAll('.hero-copy > *')].map(inkBox); // the words themselves, not their column
    const copyTop = Math.min(...lines.map(b => b.top)) - r.top - 12, copyBottom = Math.max(...lines.map(b => b.bottom)) - r.top + 12;
    const copyRight = Math.max(...lines.map(b => b.right)) - r.left + 28;
    const clears = (top, h) => LEFT_EDGE.every((f, k) => { // every band level with the copy sits to its right
      const y0 = top + k * h / 40, y1 = y0 + h / 40;
      return y1 < copyTop || y0 > copyBottom || cx - .6 * ASPECT * h + f * ASPECT * h >= copyRight;
    });
    // the frame's rules as fractions of the height (its top rule ends at 75px and its bottom rule starts at 1005px of 1080)
    const lim = framed.matches ? { top: .075, bottom: .93, tops: [.14, .12, .1] } : { top: 0, bottom: 1.01, tops: [.09, .07, .05, .04, .03] };
    const m = nav.getBoundingClientRect(), navLeft = m.left - r.left - 16, navBottom = m.width ? m.bottom - r.top + 14 : 0;
    let best = null;
    for (const t of lim.tops) { // prefer lower placements unless a higher one lets her be clearly larger
      let top = H * t, h = Math.min(H * .95, H * lim.bottom - top, (top - H * lim.top) / FLOAT);
      if (navBottom && top < navBottom && cx + .4 * ASPECT * h > navLeft) { top = navBottom; h = Math.min(h, H * lim.bottom - top); } // she'd reach under the menu: start below it
      while (h > H * .45 && !clears(top, h)) h -= 4;
      if (!best || h > best.h * 1.03) best = { top, h };
    }
    nyala.style.top = `${best.top}px`; nyala.style.height = `${best.h}px`;
  }
  let resizeTimer;
  addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(fitNyala, 120); });
  fitNyala();
  // the headline's width decides how large Nyala can be: measure again once the hand-drawn font has loaded
  document.fonts.ready.then(fitNyala);
})();
