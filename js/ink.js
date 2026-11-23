// The pen: writes a piece of the page onto the paper, as a paused GSAP timeline. Shared by the home page
// (js/section-transitions.js) and the booking page (js/booking-motion.js).
// Headings are written letter by letter and other text word by word, each stroke inked in from left to right over
// three strokes' time, in reading order through the piece. Blocks are drawn as a whole: the framed buttons and the
// review scrolls across, the avatars faded in. On a pricing leaf the paper is laid down first, its double frame drawn
// round it, the rules drawn out from their stars, the Vitruvian circle, square and triangle drawn in turn, the axes
// pricked in and the engraving sketched in on a slant; the embossed card and corner points are pressed in last.
// Nothing is hidden until a piece is prepared, and each stroke's inline styles are cleared once it has been written,
// so nothing is left behind. These are in-place reveals (no movement), so they also play with reduced motion.
window.Ink = (() => {
  const gsap = window.gsap;
  if (!gsap) return null;

  // the steps inside a piece, in document order: text to write, and blocks that are drawn as a whole
  const STEPS = 'h1, h2, h3, p, li, .plan-numeral, .plan-emblem, .plan-includes, .hero-cta, .story-avatar, .story-scroll';
  const BLOCKS = '.plan-emblem, .hero-cta, .story-scroll'; // nothing inside these is written separately
  const LETTERS = 'h1, h2, h3, .plan-numeral'; // written letter by letter; the rest word by word
  const STEP_TIME = { letter: .025, word: .03 }; // seconds between strokes
  const BLOCK_TIME = { 'plan-emblem': .5, 'plan-includes': .25, 'hero-cta': .3, 'story-avatar': .25, 'story-scroll': .4 }; // drawing runs on while the next line is written
  const GAP = .05; // a breath between one line of text and the next

  const UNWRITTEN = 'inset(-30% 100% -30% -12%)', WRITTEN = 'inset(-30% -12% -30% -12%)';
  const UNDRAWN = 'inset(-40% 100% -40% -40%)', DRAWN = 'inset(-40% -40% -40% -40%)';
  const PEN = 'power2.inOut'; // a drawing hand: eases in, travels, settles

  // Wraps each word (or each letter, in words that never break) in a span that can be inked in; returns the strokes.
  const split = (el, byLetter) => {
    const units = [];
    const walk = node => {
      for (const child of [...node.childNodes]) {
        if (child.nodeType === Node.TEXT_NODE) {
          const parts = child.textContent.split(/(\s+)/);
          if (parts.every(p => !p.trim())) continue;
          const frag = document.createDocumentFragment();
          for (const part of parts) {
            if (!part) continue;
            if (!part.trim()) { frag.append(part); continue; }
            const word = document.createElement('span');
            if (byLetter) {
              word.className = 'ink-word';
              for (const ch of part) {
                const letter = document.createElement('span');
                letter.className = 'ink-unit'; letter.textContent = ch;
                word.append(letter); units.push(letter);
              }
            } else {
              word.className = 'ink-unit'; word.textContent = part; units.push(word);
            }
            frag.append(word);
          }
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE && !child.matches('br, svg, img, .ink-unit')) {
          walk(child);
        }
      }
    };
    walk(el);
    return units;
  };

  // a rule with a star at its centre (a pseudo-element, driven through --rule and --rule-star)
  const rule = (tl, el, at) => {
    gsap.set(el, { '--rule': 0, '--rule-star': 0 });
    tl.to(el, { '--rule': 1, duration: .6, ease: 'power1.out' }, at)
      .to(el, { '--rule-star': 1, duration: .36, ease: 'power1.out' }, at + .24);
  };
  const fade = (tl, targets, at, duration) => {
    gsap.set(targets, { opacity: 0 });
    tl.to(targets, { opacity: 1, duration, ease: 'power1.out', clearProps: 'opacity' }, at);
  };
  const stroke = (tl, lines, at, duration, stagger = 0) => {
    gsap.set(lines, { strokeDasharray: '1 1', strokeDashoffset: 1 });
    tl.to(lines, { strokeDashoffset: 0, duration, ease: PEN, stagger, clearProps: 'strokeDasharray,strokeDashoffset' }, at);
  };

  const BLOCK = {
    'plan-emblem': (tl, el, t) => { // the circle, square and triangle in turn, the axes and centre, then the engraving
      stroke(tl, el.querySelectorAll('.plan-line'), t, .8, .22);
      fade(tl, el.querySelectorAll('.plan-geometry-axis, .plan-geometry-dot'), t + .6, .5);
      const art = el.querySelector('.plan-engraving');
      if (art) {
        art.classList.add('is-sketching'); gsap.set(art, { '--sketch': 1 });
        tl.to(art, { '--sketch': 0, duration: 1, ease: 'power2.inOut', onComplete: () => art.classList.remove('is-sketching') }, t + .5);
      }
    },
    'plan-includes': (tl, el, t) => rule(tl, el, t), // the divider; the list inside is written line by line
    'hero-cta': (tl, el, t) => {
      gsap.set(el, { clipPath: UNDRAWN });
      tl.to(el, { clipPath: DRAWN, duration: .7, ease: PEN, clearProps: 'clipPath' }, t);
    },
    'story-avatar': (tl, el, t) => fade(tl, el, t, .6),
  };
  BLOCK['story-scroll'] = BLOCK['hero-cta'];

  // Prepares a piece (hides what is still to be written) and returns its paused timeline.
  const write = piece => {
    const tl = gsap.timeline({ paused: true });
    const leaf = piece.matches('.plan');
    let t = 0;
    if (leaf) { // the leaf's paper is laid down first, its double frame drawn round it, the embossed card pressed in last
      gsap.set(piece, { '--leaf': 0 });
      tl.to(piece, { '--leaf': 1, duration: .5, ease: 'power1.out' }, 0);
      const [outer, inner] = piece.querySelectorAll('.plan-frame rect');
      if (outer) stroke(tl, outer, .25, 1.8);
      if (inner) stroke(tl, inner, .45, 1.8);
      fade(tl, piece.querySelectorAll('.plan-mark'), 1.6, 1.2);
      t = .35;
    }
    // a piece is written step by step; one with no steps inside (a single line, like the booking page's #pane-sub) is
    // written as itself. (The pricing leaves and review stories are <li>s, but they hold steps.)
    const inner = piece.querySelectorAll(STEPS);
    const steps = inner.length ? [...inner] : piece.matches(STEPS) ? [piece] : [];
    for (const el of steps) {
      const inBlock = el.parentElement?.closest(BLOCKS);
      if ((inBlock && piece.contains(inBlock)) || el.closest('.story-paper')) continue;
      const block = Object.keys(BLOCK).find(name => el.classList.contains(name));
      if (block) { BLOCK[block](tl, el, t); t += BLOCK_TIME[block]; continue; }
      const byLetter = el.matches(LETTERS);
      if (byLetter && /^H\d$/.test(el.tagName) && !el.hasAttribute('aria-label')) el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
      const units = split(el, byLetter);
      if (!units.length) continue;
      const step = byLetter ? STEP_TIME.letter : STEP_TIME.word;
      gsap.set(units, { clipPath: UNWRITTEN, opacity: .45 });
      tl.to(units, { clipPath: WRITTEN, opacity: 1, duration: step * 3, ease: 'none', stagger: step, clearProps: 'clipPath,opacity' }, t);
      if (el.matches('.plan-list li')) { gsap.set(el, { '--star': 0 }); tl.to(el, { '--star': 1, duration: .3, ease: 'power1.out' }, t); } // each star with its own line
      t += units.length * step + GAP;
      if (el.matches('.plan-name')) rule(tl, el, t); // the rule under the name, once it is written
    }
    return tl;
  };

  return { write, split };
})();
