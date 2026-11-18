(() => {

  /* ---------- Hero: size Nyala to the window ---------- */
  // As large as the window allows: her horns stay clear of the top, and her body clears the headline
  // (sideways, or by ending above it). Her star face stays on the page's centre line (see .nyala in CSS).
  const hero = document.querySelector('.hero'), nyala = hero.querySelector('.nyala');
  const inkBox = el => { const rg = document.createRange(); rg.selectNodeContents(el); return rg.getBoundingClientRect(); };
  function fitNyala() {
    const r = hero.getBoundingClientRect(), top = r.height * .05, aspect = 143 / 436;
    const lines = [...hero.querySelectorAll('.hero-copy > *')].map(inkBox); // the words themselves, not their column
    const copyTop = Math.min(...lines.map(b => b.top)) - r.top, copyRight = Math.max(...lines.map(b => b.right)) - r.left;
    let h = r.height * .82;
    while (h > r.height * .45 && top + h > copyTop - 12 && r.width / 2 - .6 * aspect * h < copyRight + 28) h -= 4;
    nyala.style.top = `${top}px`; nyala.style.height = `${h}px`;
  }
  let resizeTimer;
  addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(fitNyala, 120); });
  fitNyala();

  /* ---------- Live moon phase ---------- */
  const syn = 29.530588853, ref = Date.UTC(2000, 0, 6, 18, 14);
  const age = (((Date.now() - ref) / 864e5) % syn + syn) % syn, ph = age / syn;
  const names = ['New Moon','Waxing Crescent','First Quarter','Waxing Gibbous','Full Moon','Waning Gibbous','Last Quarter','Waning Crescent'];
  const notes = ['Plant a quiet intention.','Nurture what you started.','Act. Push through resistance.','Refine and trust the process.','Release, celebrate, illuminate.','Share what you have learned.','Let go of what no longer fits.','Rest, reflect, surrender.'];
  const idx = Math.floor((ph * 8) + .5) % 8;
  document.getElementById('moonName').textContent = names[idx];
  document.getElementById('moonNote').textContent = notes[idx];
  const illum = (1 - Math.cos(ph * 2 * Math.PI)) / 2, rx = Math.abs(1 - 2 * illum) * 8, waxing = ph < .5;
  const sweepOuter = waxing ? 1 : 0, sweepInner = (illum > .5) === waxing ? 1 : 0;
  document.getElementById('moonLit').setAttribute('d',
    `M12 4 A8 8 0 0 ${sweepOuter} 12 20 A${rx} 8 0 0 ${sweepInner} 12 4Z`);

  /* ---------- Daily card ---------- */
  const arcana = [
    ['0','The Fool','✧','A leap of faith is asking for you. Begin before you feel ready, because curiosity is your compass today.'],
    ['I','The Magician','∞','Everything you need is already on the table. Focus your will and make something real.'],
    ['II','The High Priestess','☾','The answer is quieter than the noise. Trust what you sense but can\'t yet explain.'],
    ['III','The Empress','♀','Abundance grows where there is care. Tend to your body, your home and your creativity.'],
    ['IV','The Emperor','♈︎','Structure is a form of love. Set the boundary and keep the promise to yourself.'],
    ['VI','The Lovers','♡','A choice of the heart is in front of you. Align what you want with what you value.'],
    ['VII','The Chariot','⟡','Momentum is yours if you steer with intention. Hold both reins.'],
    ['VIII','Strength','♌︎','Gentleness is the strongest force in the room. Meet the wild thing with patience.'],
    ['IX','The Hermit','✶','Step back to see clearly. Solitude today is a lantern, not a wall.'],
    ['X','Wheel of Fortune','☸','Cycles are turning in your favour. Stay open to an unexpected door.'],
    ['XIV','Temperance','△','Blend, balance, slow down. The middle path is the magical one today.'],
    ['XVII','The Star','✦','Hope returns quietly. You are being restored; let yourself be refilled.'],
    ['XVIII','The Moon','☽','Not everything is as it appears. Move gently through uncertainty and trust your intuition.'],
    ['XIX','The Sun','☉','Joy, clarity, warmth. Let yourself be seen exactly as you are.'],
    ['XXI','The World','◯','A chapter completes. Honour how far you\'ve come before you begin again.'],
  ];
  const deck = document.getElementById('deck'), reading = document.getElementById('reading');
  function deal() {
    deck.innerHTML = ''; deck.classList.remove('done'); reading.classList.remove('show');
    const pool = [...arcana].sort(() => Math.random() - .5).slice(0, 3);
    pool.forEach(([num, name, glyph, msg]) => {
      const el = document.createElement('button');
      el.className = 'tcard'; el.setAttribute('aria-label', 'Choose this card');
      el.innerHTML = `<div class="face back"><svg viewBox="0 0 40 40" style="color:#f0d29a"><use href="#emblem"/></svg></div>
        <div class="face front"><span class="num">${num}</span><span class="glyph">${glyph}</span><span class="name">${name}</span></div>`;
      el.onclick = () => {
        if (deck.classList.contains('done')) return;
        el.classList.add('flipped'); deck.classList.add('done');
        reading.querySelector('h3').textContent = name;
        reading.querySelector('p').textContent = msg;
        reading.classList.add('show');
      };
      deck.appendChild(el);
    });
  }
  document.getElementById('reshuffle').onclick = deal;
  deal();

  /* ---------- Header bar on scroll ---------- */
  const header = document.querySelector('header');
  const onScroll = () => header.classList.toggle('scrolled', scrollY > 30);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Intake form ---------- */
  const form = document.getElementById('intake');
  const body = form.querySelector('.intake-body');
  const err = document.getElementById('formError');

  // Show only the sections listed in data-for for the chosen reading; disable hidden inputs
  function applyType(type) {
    body.hidden = false;
    form.querySelectorAll('[data-for]').forEach(el => { el.hidden = !el.dataset.for.split(' ').includes(type); });
    form.querySelectorAll('input:not([name=reading]), textarea').forEach(el => { el.disabled = !!el.closest('[hidden]'); });
    form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
    err.textContent = '';
  }
  form.querySelectorAll('[name=reading]').forEach(r => r.addEventListener('change', () => applyType(r.value)));

  const conf = document.getElementById('conf');
  conf.addEventListener('input', () => { document.getElementById('confOut').textContent = conf.value; });

  // Priority chips: pick order = priority; tapping again removes and re-ranks
  form.querySelectorAll('.chips').forEach(group => {
    const order = [];
    const hidden = Object.assign(document.createElement('input'), { type: 'hidden', name: group.dataset.name });
    group.after(hidden);
    const render = () => {
      group.querySelectorAll('button').forEach(b => {
        const i = order.indexOf(b);
        b.setAttribute('aria-pressed', i > -1);
        i > -1 ? b.dataset.rank = i + 1 : delete b.dataset.rank;
      });
      hidden.value = order.map((b, i) => `${i + 1}. ${b.textContent}`).join('; ');
      group.classList.remove('invalid');
    };
    group.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      const i = order.indexOf(b);
      i > -1 ? order.splice(i, 1) : order.push(b);
      render();
    }));
    render();
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let first = null;
    form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
    if (!form.querySelector('[name=reading]:checked')) { err.textContent = 'Please choose a reading.'; return; }
    form.querySelectorAll('input:enabled, textarea:enabled').forEach(el => {
      if (el.type !== 'hidden' && !el.checkValidity()) { el.classList.add('invalid'); first ??= el; }
    });
    form.querySelectorAll('.chips').forEach(group => {
      const h = group.nextElementSibling;
      if (!h.disabled && !h.value) { group.classList.add('invalid'); first ??= group.querySelector('button'); }
    });
    if (first) { err.textContent = 'Please fill in the highlighted fields.'; first.focus(); return; }

    const data = Object.fromEntries(new FormData(form));
    // TODO: send `data` to the booking backend / form service (e.g. Formspree, Netlify Forms, email)
    console.log('Intake submitted', data);
    document.getElementById('thanksName').textContent = data.name;
    form.hidden = true;
    document.getElementById('thanks').hidden = false;
  });

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  document.getElementById('yr').textContent = new Date().getFullYear();
})();
