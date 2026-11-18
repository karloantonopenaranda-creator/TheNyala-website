// A fresh arrangement on each page load; fixed positions while reading/scrolling.
// The opaque landing collage and masked intake paper sit above this layer.
(() => {
  const cards = [
    'magician', 'high-priestess', 'fool', 'hermit', 'wheel', 'temperance',
    'strength', 'empress', 'lovers', 'chariot', 'justice'
  ];
  const random = (min, max) => min + Math.random() * (max - min);
  const shuffle = values => {
    const result = [...values];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };
  const field = document.createElement('div');
  field.className = 'paper-symbols';
  field.setAttribute('aria-hidden', 'true');
  const deck = [...shuffle(cards), ...shuffle(cards)];
  const desktopCells = shuffle(Array.from({ length: 20 }, (_, i) => i));
  const phoneCells = shuffle(Array.from({ length: 8 }, (_, i) => i));
  for (let i = 0; i < 18; i++) {
    const image = document.createElement('img');
    image.src = `assets/deck/embossed-${deck[i]}.webp`;
    image.alt = '';
    image.decoding = 'async';
    image.draggable = false;
    const cell = desktopCells[i];
    image.style.setProperty('--symbol-x', `${(cell % 5 + random(.05, 1.05)) * 20}%`);
    image.style.setProperty('--symbol-y', `${(Math.floor(cell / 5) + random(.05, 1.05)) * 25}%`);
    image.style.setProperty('--symbol-size', `${random(8, 15)}vw`);
    image.style.setProperty('--symbol-angle', `${random(-28, 28)}deg`);
    image.style.setProperty('--symbol-opacity', random(.7, 1).toFixed(2));
    if (i < 8) {
      const mobileCell = phoneCells[i];
      image.style.setProperty('--phone-x', `${(mobileCell % 2 + random(.05, .95)) * 50}%`);
      image.style.setProperty('--phone-y', `${(Math.floor(mobileCell / 2) + random(.05, .95)) * 25}%`);
      image.style.setProperty('--phone-size', `${random(22, 36)}vw`);
    }
    field.append(image);
  }
  document.body.prepend(field);
})();
