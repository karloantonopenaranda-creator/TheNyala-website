(() => {
  /* ---------- Forest vines on the offer cards ---------- */
  // Each card gets two pieces of vine anchored to opposite corners. Every stem is a cubic curve with ivy
  // leaves alternating along it (largest at the root), a curling tendril and a small blossom. Each card has
  // its own seed, so the vines differ between cards but look the same on every visit.
  // On load the stems grow and the leaves unfurl; with reduced motion the vines simply fade in.
  const rng = seed => () => { // mulberry32
    seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  const f = n => n.toFixed(1);
  const bez = (p, t) => { const u = 1 - t; return [u * u * u * p[0] + 3 * u * u * t * p[2] + 3 * u * t * t * p[4] + t * t * t * p[6], u * u * u * p[1] + 3 * u * u * t * p[3] + 3 * u * t * t * p[5] + t * t * t * p[7]]; };

  // Pieces are drawn for their native corner; other corners are mirrored. off = how far the piece reaches past the card edge.
  // inward = the direction that points into the card from the piece's native corner; leaves facing it stay small
  const PIECES = {
    drape: { w: 240, h: 120, native: 'tl', off: [18, 17], inward: [0, 1], stems: [
      { p: [2, 46, 58, 4, 146, 2, 222, 46], leaf: [28, 12], every: 14, tendrils: 1 },
      { p: [80, 16, 94, 34, 82, 50, 92, 62], leaf: [17, 9], every: 12, tendrils: 0 } ] },
    climb: { w: 120, h: 300, native: 'bl', off: [18, 15], inward: [1, 0], stems: [
      { p: [34, 298, 6, 214, 42, 118, 20, 12], leaf: [27, 11], every: 15, tendrils: 1 } ] },
    sprig: { w: 160, h: 90, native: 'tl', off: [17, 16], inward: [.6, .8], stems: [
      { p: [4, 24, 50, 4, 100, 14, 132, 52], leaf: [23, 10], every: 13, tendrils: 1 } ] },
  };
  const LAYOUT = [ [['drape', 'tl'], ['climb', 'br']], [['sprig', 'tr'], ['climb', 'bl']],
                   [['drape', 'tr'], ['sprig', 'bl']], [['sprig', 'tl'], ['climb', 'br']],
                   [['drape', 'tr'], ['climb', 'br']],
                   [['drape', 'tl'], ['climb', 'bl']] ]; // the last keeps to the left edge: the booking box, clear of its scrollbar on the right

  const leafPath = L => `M0 0C${f(L * .18)} ${f(-L * .42)} ${f(L * .72)} ${f(-L * .42)} ${f(L)} 0C${f(L * .72)} ${f(L * .42)} ${f(L * .18)} ${f(L * .42)} 0 0Z`;
  const tangent = (pts, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]; return Math.atan2(b[1] - a[1], b[0] - a[0]); };

  function piece(name, corner, seed, delay0) {
    const P = PIECES[name], R = rng(seed);
    let defs = '', stems = '', leaves = '';
    P.stems.forEach((st, si) => {
      const N = 120, pts = []; let len = 0;
      for (let i = 0; i <= N; i++) { const q = bez(st.p, i / N); if (i) len += Math.hypot(q[0] - pts[i - 1][0], q[1] - pts[i - 1][1]); pts.push([q[0], q[1], len]); }
      const at = s => Math.max(1, pts.findIndex(q => q[2] >= s));
      const d = `M${st.p[0]} ${st.p[1]}C${st.p[2]} ${st.p[3]} ${st.p[4]} ${st.p[5]} ${st.p[6]} ${st.p[7]}`;
      const sd = delay0 + si * .35;
      // the stem tapers from root to tip; a growing stroke inside a mask reveals it
      const left = [], right = [];
      pts.forEach((q, i) => { const a = tangent(pts, i), w = 2.2 - 1.6 * (q[2] / len);
        left.push(`${f(q[0] - Math.sin(a) * w)} ${f(q[1] + Math.cos(a) * w)}`); right.unshift(`${f(q[0] + Math.sin(a) * w)} ${f(q[1] - Math.cos(a) * w)}`); });
      const mid = `vm${seed}_${si}`;
      defs += `<mask id="${mid}" maskUnits="userSpaceOnUse" x="-20" y="-20" width="${P.w + 40}" height="${P.h + 40}"><path class="vine-grow" pathLength="1" d="${d}" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" style="--d:${f(sd)}s"/></mask>`;
      stems += `<path d="M${left.join('L')}L${right.join('L')}Z" fill="#3a5f2c" stroke="#1f3818" stroke-width=".5" mask="url(#${mid})"/>`;
      // a tendril curling off the stem, echoing the curls of the brand lettering
      for (let k = 0; k < st.tendrils; k++) {
        const i = at(len * (.3 + R() * .45)), [x, y] = pts[i], side = R() < .5 ? 1 : -1;
        let th = tangent(pts, i) + side * 1.1, r = 9 + R() * 4, cx = x, cy = y, path = `M${f(x)} ${f(y)}`;
        for (let j = 0; j < 26; j++) { cx += Math.cos(th) * r * .28; cy += Math.sin(th) * r * .28; th += side * .34; r *= .93; path += `L${f(cx)} ${f(cy)}`; }
        stems += `<path class="vine-grow vine-tendril" pathLength="1" d="${path}" style="--d:${f(sd + .5 + (pts[i][2] / len) * 1.1)}s"/>`;
      }
      // ivy leaves alternating along the stem, largest at the root
      let s = 9 + R() * 6, side = R() < .5 ? 1 : -1;
      while (s < len - 6) {
        const i = at(s), [x, y] = pts[i], ang = tangent(pts, i), u = s / len;
        const la = ang + side * (.85 + (R() - .5) * .5);
        const intoCard = Math.cos(la) * P.inward[0] + Math.sin(la) * P.inward[1] > .3; // keep the card's text clear
        const L = (st.leaf[0] + (st.leaf[1] - st.leaf[0]) * u + (R() - .5) * 5) * (intoCard ? .55 : 1);
        const bx = x - Math.sin(ang) * side * 2.5, by = y + Math.cos(ang) * side * 2.5;
        const lx = bx + Math.cos(la) * L * .28, ly = by + Math.sin(la) * L * .28;
        const dl = f(sd + .2 + u * 1.2), g = ['vine-a', 'vine-b', 'vine-c'][Math.floor(R() * 3)];
        leaves += `<path class="vine-petiole" d="M${f(x)} ${f(y)}L${f(lx)} ${f(ly)}" style="--d:${dl}s"/>`;
        leaves += `<g transform="translate(${f(lx)} ${f(ly)}) rotate(${f(la * 57.2958)})"><g class="vine-leaf" style="--d:${dl}s"><path d="${leafPath(L)}" fill="url(#${g})" stroke="#1f3818" stroke-width=".5"/><path class="vine-rib" d="M${f(L * .08)} 0Q${f(L * .5)} ${f(L * .04)} ${f(L * .86)} 0"/></g></g>`;
        side = -side; s += st.every * (.8 + R() * .45);
      }
      // a small pale blossom along the main stem
      if (si === 0) {
        const i = at(len * (.55 + R() * .2)), [x, y] = pts[i], a = tangent(pts, i), r = 3.4;
        const bx = x - Math.sin(a) * 6, by = y + Math.cos(a) * 6;
        let petals = '';
        for (let p = 0; p < 5; p++) { const pa = p / 5 * Math.PI * 2 + R(); petals += `<ellipse cx="${f(bx + Math.cos(pa) * r * .8)}" cy="${f(by + Math.sin(pa) * r * .8)}" rx="${f(r * .62)}" ry="${f(r * .42)}" transform="rotate(${f(pa * 57.2958)} ${f(bx + Math.cos(pa) * r * .8)} ${f(by + Math.sin(pa) * r * .8)})" fill="#f2eedb"/>`; }
        leaves += `<g class="vine-leaf" style="--d:${f(sd + 1.3)}s">${petals}<circle cx="${f(bx)}" cy="${f(by)}" r="${f(r * .4)}" fill="#f3d48c"/></g>`;
      }
    });
    const flipX = P.native[1] !== corner[1], flipY = P.native[0] !== corner[0];
    const inner = `<g transform="translate(${flipX ? P.w : 0} ${flipY ? P.h : 0}) scale(${flipX ? -1 : 1} ${flipY ? -1 : 1})">${stems}${leaves}</g>`;
    const pos = `${corner[0] === 't' ? 'top' : 'bottom'}:${-P.off[1]}px;${corner[1] === 'l' ? 'left' : 'right'}:${-P.off[0]}px;` +
      `transform-origin:${corner[1] === 'l' ? 'left' : 'right'} ${corner[0] === 't' ? 'top' : 'bottom'};--sway:${corner[1] === 'l' ? 1.4 : -1.4}deg`;
    return `<svg class="vine-piece" aria-hidden="true" width="${P.w}" height="${P.h}" viewBox="0 0 ${P.w} ${P.h}" style="${pos}"><defs>${defs}</defs>${inner}</svg>`;
  }

  // shared leaf gradients: lit along one half of the leaf, shaded along the other
  const shared = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  shared.setAttribute('width', '0'); shared.setAttribute('height', '0'); shared.setAttribute('aria-hidden', 'true'); shared.style.position = 'absolute';
  shared.innerHTML = `<defs>
    <linearGradient id="vine-a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd06c"/><stop offset=".5" stop-color="#5f9a3e"/><stop offset="1" stop-color="#3a6a2c"/></linearGradient>
    <linearGradient id="vine-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fb85a"/><stop offset=".5" stop-color="#4b8636"/><stop offset="1" stop-color="#2d5726"/></linearGradient>
    <linearGradient id="vine-c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b6df85"/><stop offset=".5" stop-color="#76ae4c"/><stop offset="1" stop-color="#477d35"/></linearGradient>
  </defs>`;
  document.body.prepend(shared);

  // the cards sit further down the page, so each one's vines wait (paused, see .vines-wait) until it scrolls into view
  const io = 'IntersectionObserver' in window && new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.remove('vines-wait'); io.unobserve(e.target); }
  }), { threshold: .25 });

  // the offer cards' lace art takes the layouts in turn; any other panel marked .vined picks one with data-vines="<0-5>"
  document.querySelectorAll('.offer-art, .vined').forEach((card, n) => {
    const layout = LAYOUT[(card.dataset.vines ? +card.dataset.vines : n) % LAYOUT.length];
    card.insertAdjacentHTML('afterbegin', layout.map(([name, corner], k) => piece(name, corner, 1013 + n * 97 + k * 31, .2 + n * .15 + k * .25)).join(''));
    if (io) { card.classList.add('vines-wait'); io.observe(card); }
  });
})();
