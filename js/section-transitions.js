// Writes and draws each home-page section onto the paper as it comes into view (see "Scroll writing" in
// css/style.css). Headings are written letter by letter and other text word by word, each stroke inked in from left
// to right, in reading order through the piece. On the pricing leaves the paper is laid down first, its frame is drawn
// round it, the Vitruvian lines are drawn and the engraving sketched in; buttons and the review scrolls are drawn
// across. Pieces arriving together start a moment apart. Each piece plays once and then stays.
(() => {
  if (!('IntersectionObserver' in window)) return;

  const PIECES = [
    '.hero--collage .hero-frame', '.readings .pricing-intro', '.readings .deck-fan', '.readings .offer',
    '.reviews-section .reviews-intro-copy', '.reviews-section .deck-fan', '.reviews-section .review-story',
  ].join(', ');
  // the steps inside a piece, in document order: text to write, and blocks that are drawn as a whole
  const STEPS = 'h1, h2, h3, p, li, .plan-numeral, .plan-emblem, .plan-includes, .hero-cta, .story-avatar, .story-scroll';
  const BLOCKS = '.plan-emblem, .hero-cta, .story-scroll'; // drawn as a whole: nothing inside is written separately
  const LETTERS = 'h1, h2, h3, .plan-numeral'; // written letter by letter; the rest word by word
  const STEP_TIME = { letter: .025, word: .03 }; // seconds between strokes
  const BLOCK_TIME = { 'plan-emblem': .5, 'plan-includes': .25, 'hero-cta': .3, 'story-avatar': .25, 'story-scroll': .4 }; // drawing runs on while the next line is written
  const GAP = .05; // a breath between one line of text and the next
  const STAGGER = .12; // seconds between pieces that arrive together

  // Wraps each word (or each letter, in words that never break) in a span that can be inked in; returns the count.
  const split = (el, byLetter) => {
    let count = 0;
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
                letter.className = 'ink-unit'; letter.textContent = ch; letter.style.setProperty('--i', count++);
                word.append(letter);
              }
            } else {
              word.className = 'ink-unit'; word.textContent = part; word.style.setProperty('--i', count++);
            }
            frag.append(word);
          }
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE && !child.matches('br, svg, img')) {
          walk(child);
        }
      }
    };
    walk(el);
    return count;
  };

  const prepare = piece => {
    let t = piece.matches('.plan') ? .35 : 0; // the leaf's paper is laid down first
    for (const el of piece.querySelectorAll(STEPS)) {
      const inBlock = el.parentElement.closest(BLOCKS);
      if ((inBlock && piece.contains(inBlock)) || el.closest('.story-paper')) continue;
      el.style.setProperty('--t', `${t.toFixed(2)}s`);
      const block = Object.keys(BLOCK_TIME).find(name => el.classList.contains(name));
      if (block) { el.classList.add('ink-block'); t += BLOCK_TIME[block]; continue; }
      const byLetter = el.matches(LETTERS);
      if (byLetter && /^H\d$/.test(el.tagName)) el.setAttribute('aria-label', el.innerText.replace(/\s+/g, ' ').trim());
      const n = split(el, byLetter);
      if (!n) continue;
      const step = byLetter ? STEP_TIME.letter : STEP_TIME.word;
      el.classList.add('ink-text');
      el.style.setProperty('--step', `${step}s`);
      t += n * step + GAP;
      el.style.setProperty('--t-end', `${t.toFixed(2)}s`);
    }
  };

  const pieces = [...document.querySelectorAll(PIECES)];
  if (!pieces.length) return;
  for (const piece of pieces) {
    if (piece.matches('.deck-fan')) { piece.classList.add('section-reveal'); continue; } // the colored decks just fade in
    piece.classList.add('ink-piece');
    prepare(piece);
  }

  const inOrder = (a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
  const observer = new IntersectionObserver(entries => {
    entries.filter(e => e.isIntersecting).map(e => e.target).sort(inOrder).forEach((el, n) => {
      el.style.setProperty('--d', `${(n * STAGGER).toFixed(2)}s`);
      el.classList.add('is-visible');
      observer.unobserve(el);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });

  document.documentElement.classList.add('has-section-transitions');
  for (const el of pieces) observer.observe(el);
})();
