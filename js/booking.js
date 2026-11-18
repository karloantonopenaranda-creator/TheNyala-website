(() => {
  /* ---------- Booking intake form ---------- */
  // Fields follow the client's intake spec: each reading shows only what it needs (elements carry data-for="<keys>"),
  // hidden fields are disabled so they're neither validated nor sent. The Digital Tarot Reading has three formats: one
  // question or three (key "tarot", with data-q picking the question fields), sent as a PDF with an audio recording, or
  // the live 30-minute session (key "session").
  // A card's "Choose this reading" button on the home page links here with ?reading=tarot|chart|combo, which preselects
  // that reading (the older ?reading=session still works).
  const form = document.getElementById('intake');
  const box = form.closest('.book-scroll'); // the intake box scrolls inside itself on wider screens
  const panel = form.querySelector('.intake-panel');
  const summary = document.getElementById('form-summary');
  const readingError = document.getElementById('reading-error');
  const NAMES = { tarot: 'Digital Tarot Reading', chart: 'Birth Chart Reading', combo: 'Birth Chart + Tarot Reading' };
  const FORMATS = { one: 'One question (PDF and audio)', three: 'Three questions (PDF and audio)', session: 'Live 30-minute session' };
  // the line under "Begin Your Reading" in the glade panel follows the chosen reading (same words as its card)
  const PANE = {
    tarot: 'Digital Tarot Reading: one or three questions, sent as a PDF with an audio recording, or a live 30-minute session by video call.',
    chart: 'Birth Chart Reading: your natal chart, read from the moment you were born and sent as a PDF with an audio recording.',
    combo: 'Birth Chart + Tarot Reading: your chart and the cards together, in a live session of 60 to 70 minutes by video call.',
  };
  const paneSub = document.getElementById('pane-sub');

  // Each message names what's missing and how to put it right
  const MESSAGES = {
    name: 'Please enter the name you would like your reader to use.',
    email: ['Please enter your email address so your reader can confirm the details with you.', 'That email address looks incomplete. Check it has an @ and a domain, like name@example.com.'],
    dob: ['Please enter your date of birth.', 'Your date of birth can\'t be in the future. Please check the year.'],
    birth_time: 'Please enter your birth time. If you\'re not sure, give your best guess and set the confidence low.',
    birthplace: 'Please enter where you were born: city, region and country.',
    reason: 'Please share your main reason for booking, even in a sentence.',
    situation: 'Please describe your current situation, even briefly.',
    question: 'Please write your question.',
    question_1: 'Please write your first question.', question_2: 'Please write your second question.', question_3: 'Please write your third question.',
    questions: 'Please write the questions you\'d like to bring.',
    areas: 'Please choose at least one area to explore.',
    preferred_date: 'Please choose a preferred date for your reading.',
  };

  let tried = false; // errors only appear once the visitor has tried to send

  // ----- which fields belong to the chosen reading and tarot format
  function apply() {
    const picked = form.querySelector('[name=reading]:checked');
    if (!picked) return;
    const format = form.querySelector('[name=tarot_format]:checked').value;
    const key = picked.value === 'tarot' && format === 'session' ? 'session' : picked.value;
    panel.hidden = false;
    paneSub.textContent = PANE[picked.value];
    document.getElementById('reading-nudge').hidden = true;
    readingError.textContent = '';
    form.querySelectorAll('[data-for]').forEach(el => { el.hidden = !el.dataset.for.split(' ').includes(key); });
    form.querySelectorAll('[data-q]').forEach(el => { el.hidden = el.dataset.q !== format; });
    // anything inside a hidden part is disabled: not validated, not sent
    form.querySelectorAll('.intake-panel input, .intake-panel textarea').forEach(el => { el.disabled = !!el.closest('[hidden]'); });
    form.querySelectorAll('.chips').forEach(g => { g.nextElementSibling.disabled = !!g.closest('[hidden]'); });
    if (tried) validate(false);
  }
  form.querySelectorAll('[name=reading], [name=tarot_format]').forEach(r => r.addEventListener('change', apply));

  // ----- birth time confidence readout
  const conf = document.getElementById('conf'), confOut = document.getElementById('conf-out');
  conf.addEventListener('input', () => { confOut.textContent = conf.value; });

  // ----- latest allowed date of birth is today
  const today = new Date(), pad = n => String(n).padStart(2, '0');
  form.querySelector('[name=dob]').max = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  // ----- priority chips: the order you tap them is the order of importance; tap again to remove
  form.querySelectorAll('.chips').forEach(group => {
    const order = [];
    const value = Object.assign(document.createElement('input'), { type: 'hidden', name: group.dataset.name });
    group.after(value);
    const render = () => {
      group.querySelectorAll('button').forEach(b => {
        const i = order.indexOf(b);
        b.setAttribute('aria-pressed', i > -1);
        if (i > -1) { b.dataset.rank = i + 1; b.setAttribute('aria-label', `${b.textContent}, choice ${i + 1}`); }
        else { delete b.dataset.rank; b.removeAttribute('aria-label'); }
      });
      value.value = order.map((b, i) => `${i + 1}. ${b.textContent}`).join('; ');
      if (tried) validate(false);
    };
    group.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      const i = order.indexOf(b); i > -1 ? order.splice(i, 1) : order.push(b); render();
    }));
    render();
  });

  // ----- preferred date: a month calendar for every reading with tarot in it. The earliest date is tomorrow (the reader
  // prepares from the intake first) and the latest six months ahead; the reader confirms the exact time by email.
  // The value is sent as YYYY-MM-DD. Arrow keys move by day and week, Page Up/Down by month, Home/End to the week's ends.
  const LONG_PARTS = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const LONG = { format: d => LONG_PARTS.formatToParts(d).filter(p => p.type !== 'literal').map(p => p.value).join(' ') }; // "Friday 30 October 2026"
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const fromIso = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  form.querySelectorAll('.datepick').forEach(pick => {
    const value = pick.querySelector('input'), days = pick.querySelector('.datepick-days'), title = pick.querySelector('.datepick-month');
    const readout = pick.querySelector('.datepick-picked'), [prev, next] = pick.querySelectorAll('.datepick-nav');
    const [num, dayName, monthName] = pick.querySelectorAll('.datepick-show span');
    const min = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const max = new Date(today.getFullYear(), today.getMonth() + 6, today.getDate());
    const monthOf = d => new Date(d.getFullYear(), d.getMonth(), 1);
    const MONTH = new Intl.DateTimeFormat('en-GB', { month: 'long' }), WEEKDAY = new Intl.DateTimeFormat('en-GB', { weekday: 'long' });
    // weeks start on the visitor's usual first day (Monday or Sunday, from their browser's region)
    const loc = new Intl.Locale(navigator.language || 'en-GB'), info = (loc.getWeekInfo ? loc.getWeekInfo() : loc.weekInfo) || { firstDay: 1 };
    const weekStart = info.firstDay % 7; // 0 = Sunday … 6 = Saturday
    const SHORT = new Intl.DateTimeFormat('en-GB', { weekday: 'short' });
    pick.querySelector('.datepick-week').innerHTML = [...Array(7)].map((_, i) => `<span>${SHORT.format(new Date(2026, 0, 4 + (weekStart + i) % 7)).slice(0, 2)}</span>`).join(''); // 4 Jan 2026 is a Sunday
    let view = monthOf(min), chosen = '', focusDay = min;
    function render() {
      title.innerHTML = `${MONTH.format(view)} <span>${view.getFullYear()}</span>`;
      const y = view.getFullYear(), m = view.getMonth(), lead = (view.getDay() - weekStart + 7) % 7;
      let html = '<span></span>'.repeat(lead);
      for (let d = 1, n = new Date(y, m + 1, 0).getDate(); d <= n; d++) {
        const day = new Date(y, m, d), key = iso(day);
        html += `<button type="button" data-iso="${key}" aria-label="${LONG.format(day)}" aria-pressed="${key === chosen}" tabindex="${key === iso(focusDay) ? 0 : -1}"${day < min || day > max ? ' disabled' : ''}${key === iso(today) ? ' class="is-today"' : ''}>${d}</button>`;
      }
      days.innerHTML = html;
      prev.disabled = view <= monthOf(min); next.disabled = view >= monthOf(max);
      if (!days.querySelector('[tabindex="0"]:not(:disabled)')) { const b = days.querySelector('button:not(:disabled)'); if (b) b.tabIndex = 0; } // one tab stop per month
    }
    const show = d => { focusDay = d < min ? min : d > max ? max : d; view = monthOf(focusDay); render(); days.querySelector(`[data-iso="${iso(focusDay)}"]`).focus(); };
    prev.addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); render(); });
    next.addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); render(); });
    days.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b || b.disabled) return;
      chosen = value.value = b.dataset.iso;
      const day = fromIso(chosen);
      readout.textContent = `Chosen: ${LONG.format(day)}`; // for screen readers; the panel shows it large
      num.textContent = day.getDate(); dayName.textContent = WEEKDAY.format(day); monthName.textContent = `${MONTH.format(day)} ${day.getFullYear()}`;
      pick.classList.add('has-date');
      show(day);
      if (tried) validate(false);
    });
    days.addEventListener('keydown', e => {
      const b = e.target.closest('button'); if (!b) return;
      const d = fromIso(b.dataset.iso), step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
      let to;
      if (step) to = new Date(d.getFullYear(), d.getMonth(), d.getDate() + step);
      else if (e.key === 'PageUp' || e.key === 'PageDown') { // the same day next or last month, or that month's last day
        const t = new Date(d.getFullYear(), d.getMonth() + (e.key === 'PageUp' ? -1 : 1), 1);
        to = new Date(t.getFullYear(), t.getMonth(), Math.min(d.getDate(), new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate()));
      } else if (e.key === 'Home' || e.key === 'End') {
        const off = (d.getDay() - weekStart + 7) % 7;
        to = new Date(d.getFullYear(), d.getMonth(), d.getDate() + (e.key === 'Home' ? -off : 6 - off));
      }
      if (to) { e.preventDefault(); show(to); }
    });
    render();
  });

  // ----- validation
  const errorFor = el => { // one message slot per field (the three questions share one)
    const host = el.closest('.qlist') || el.closest('.field');
    let e = host.querySelector(':scope > .field-error');
    if (!e) host.append(e = Object.assign(document.createElement('p'), { className: 'field-error', id: `field-error-${++errorFor.n}` }));
    return e;
  };
  errorFor.n = 0;
  function problem(el) {
    const v = el.value.trim(), m = MESSAGES[el.name];
    if (el.name === 'email') return !v ? m[0] : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? m[1] : '';
    if (el.name === 'dob') return !v ? m[0] : v > el.max ? m[1] : '';
    return el.required && !v ? m : '';
  }
  function validate(moveFocus) {
    let first = null, count = 0;
    form.querySelectorAll('.intake-panel input[required], .intake-panel textarea[required]').forEach(el => {
      const msg = el.disabled ? '' : problem(el), err = errorFor(el);
      if (el.closest('.qlist')) { // the three questions share one message slot
        const slot = el.closest('.qlist'); if (!slot._msgs) slot._msgs = {};
        slot._msgs[el.name] = msg; err.textContent = Object.values(slot._msgs).find(Boolean) || '';
      } else err.textContent = msg;
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (msg) { el.setAttribute('aria-describedby', err.id); count++; first ??= el; } else el.removeAttribute('aria-describedby');
    });
    form.querySelectorAll('.chips').forEach(group => {
      const hidden = group.nextElementSibling, err = errorFor(group);
      const msg = !hidden.disabled && !hidden.value ? MESSAGES.areas : '';
      err.textContent = msg; group.classList.toggle('is-invalid', !!msg);
      if (msg) { count++; first ??= group.querySelector('button'); }
    });
    form.querySelectorAll('.datepick').forEach(pick => {
      const value = pick.querySelector('input'), err = errorFor(pick);
      const msg = !value.disabled && !value.value ? MESSAGES.preferred_date : '';
      err.textContent = msg; pick.classList.toggle('is-invalid', !!msg);
      if (msg) { count++; first ??= pick.querySelector('.datepick-days [tabindex="0"]'); }
    });
    summary.textContent = count ? `${count === 1 ? 'One detail is' : `${count} details are`} missing or need a look. They're marked above.` : '';
    if (moveFocus && first) first.focus();
    return !count;
  }
  form.addEventListener('input', e => { if (tried && e.target.matches('input, textarea')) validate(false); });

  // ----- send
  form.addEventListener('submit', e => {
    e.preventDefault();
    const reading = form.querySelector('[name=reading]:checked');
    if (!reading) { readingError.textContent = 'Please choose a reading first.'; form.querySelector('[name=reading]').focus(); return; }
    tried = true;
    if (!validate(true)) return;
    const data = Object.fromEntries(new FormData(form));
    // the live readings (the tarot session and the combined reading) get a video call; the others a PDF with an audio recording
    const live = data.reading === 'combo' || data.tarot_format === 'session';
    const when = data.preferred_date ? LONG.format(fromIso(data.preferred_date)) : '';
    if (data.reading === 'tarot') data.tarot_format = FORMATS[data.tarot_format]; else delete data.tarot_format;
    data.reading = NAMES[data.reading];
    // TODO before launch: send `data` to the reader (email or a form service such as Formspree or Netlify Forms)
    console.log('Intake ready to send', data);
    document.getElementById('thanks-name').textContent = data.name;
    document.getElementById('thanks-reading').textContent = data.reading;
    document.getElementById('thanks-next').textContent = live
      ? `Your reader will read it before your session and email you to confirm a time for your video call${when ? ` on your preferred date, ${when}` : ''}.`
      : `Your reader will read it and email you to confirm when your PDF and audio recording will be ready${when ? `, with your preferred date, ${when}, in mind` : ''}.`;
    form.hidden = true;
    const thanks = document.getElementById('thanks');
    thanks.hidden = false; thanks.focus({ preventScroll: true });
    box.scrollTop = 0; box.parentElement.scrollIntoView({ block: 'start' }); // the box's own scroll on wider screens, the page on phones
  });

  // ----- preselect from the home page's cards
  let pre = new URLSearchParams(location.search).get('reading');
  if (pre === 'session') { pre = 'tarot'; form.querySelector('[name=tarot_format][value=session]').checked = true; }
  const preInput = pre && form.querySelector(`[name=reading][value="${CSS.escape(pre)}"]`);
  if (preInput) { preInput.checked = true; apply(); }
})();
