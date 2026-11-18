---
name: TheNyala
description: Nyala, the brand spirit, on the client's rust paper with its embossed ornamental frame, for tarot and birth-chart readings, recorded or live.
colors:
  paper: "#8f3f20"
  ink: "#2a0c07"
  cream: "#f6f0e6"
  cream-text: "rgba(246, 240, 230, 0.95)"
  cream-muted: "rgba(240, 233, 222, 0.9)"
  cream-rule: "rgba(240, 232, 220, 0.38)"
  shadow: "rgba(26, 6, 3, 0.6)"
  panel: "rgba(48, 14, 8, 0.84)"
  field: "rgba(36, 10, 6, 0.55)"
  button-fill: "rgba(36, 10, 6, 0.62)"
  scrollbar-thumb: "#a35a41"
  scrollbar-track: "#3a1209"
  error-line: "#f0a596"
  error-text: "#f4b3a6"
  parchment: "#e6d5b1"
  parchment-leaf: "#ece2cc"
  card-ink: "#6e1f12"
  scroll-ink: "#3a2215"
  scroll-ink-muted: "#6e4a33"
  reviews-ground: "#632813"
typography:
  display:
    fontFamily: "Anaktoria, Georgia, Times New Roman, serif"
    fontSize: "clamp(26px, 1.8vw + 1.3vh, 44px)"
    fontWeight: 400
    lineHeight: 1.18
    letterSpacing: "0.005em"
  wordmark:
    fontFamily: "Anaktoria, Georgia, Times New Roman, serif"
    fontSize: "clamp(26px, 1.2vw + 1.2vh, 36px)"
    fontWeight: 400
    lineHeight: 1
  wordmark-compact:
    fontFamily: "Anaktoria, Georgia, Times New Roman, serif"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1
  body:
    fontFamily: "Hanken Grotesk, Manrope, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Hanken Grotesk, Manrope, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    letterSpacing: "0.01em"
  page-title:
    fontFamily: "Anaktoria, Georgia, Times New Roman, serif"
    fontSize: "clamp(34px, 2.4vw + 1.2vh, 54px)"
    fontWeight: 400
    lineHeight: 1.12
  lede:
    fontFamily: "Anaktoria, Georgia, Times New Roman, serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.45
  lede-section:
    fontFamily: "Anaktoria, Georgia, Times New Roman, serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.5
  lede-compact:
    fontFamily: "Anaktoria, Georgia, Times New Roman, serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.45
  price:
    fontFamily: "Anaktoria, Georgia, Times New Roman, serif"
    fontSize: "25px"
    fontWeight: 400
  form-title:
    fontFamily: "Anaktoria, Georgia, Times New Roman, serif"
    fontSize: "30px"
    fontWeight: 400
    lineHeight: 1.15
  date-numeral:
    fontFamily: "Anaktoria, Georgia, Times New Roman, serif"
    fontSize: "48px"
    fontWeight: 400
    lineHeight: 1
  date-numeral-compact:
    fontFamily: "Anaktoria, Georgia, Times New Roman, serif"
    fontSize: "36px"
    fontWeight: 400
    lineHeight: 1
  card-body:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "14.5px"
    fontWeight: 400
    lineHeight: 1.5
  section-title:
    fontFamily: "Anaktoria, Georgia, Times New Roman, serif"
    fontSize: "23px"
    fontWeight: 400
  caption:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "12.5px"
    fontWeight: 400
  micro:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 500
  button-label:
    fontFamily: "Anaktoria, Georgia, Times New Roman, serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1
  nav-label:
    fontFamily: "Anaktoria, Georgia, Times New Roman, serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1
rounded:
  hairline: "3px"
  card: "6px"
  service-card: "0"
spacing:
  edge: "clamp(18px, 3.2vw, 52px)"
components:
  button-framed:
    backgroundColor: "{colors.button-fill}"
    textColor: "{colors.cream}"
    height: "54px"
    typography: "{typography.button-label}"
  button-framed-hover:
    backgroundColor: "rgba(36, 10, 6, 0.4)"
    textColor: "{colors.cream}"
  nav-link:
    backgroundColor: "{colors.button-fill}"
    textColor: "{colors.cream}"
    height: "42px"
    typography: "{typography.nav-label}"
  offer-price:
    textColor: "{colors.cream}"
    typography: "{typography.price}"
  intake-box:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.cream}"
    rounded: "{rounded.card}"
---

# Design System: TheNyala

## Overview

### Type, buttons, and scroll response — 17 November 2026

Anaktoria now sets the wordmark, display headings, and page titles as well as the existing introductions, prices, and framed button labels. Hanken Grotesk remains on compact descriptions and form controls for legibility. The original Nyala font file remains in `assets/fonts/` but is no longer loaded for active headings; the pages preload Anaktoria instead.

The ornamental button fill is slightly lighter: general framed actions use 55% of the original dark fill, and the cream landing hero uses 68% to preserve text contrast. The frame artwork stays unchanged.

Scroll writing (revised 2026-11-18: the client asked for the pages to look as if they are being written or drawn while scrolling): `js/section-transitions.js` writes and draws each piece onto the paper as it comes into view (the hero headline and introduction on load, the readings introduction, each pricing leaf, the reviews introduction and each review story). Headings are written letter by letter (0.025s apart) and other text word by word (0.03s apart), each stroke inked in from left to right over three strokes' time, in reading order through the piece; headings split into letters carry an `aria-label` with their text. On the pricing leaves the paper fades in first, the double frame (inline SVG) is drawn round it (1.8s), the rules are drawn out from their stars, the Vitruvian circle, square and triangle are drawn in turn (`stroke-dashoffset` with `pathLength="1"`), the axes are pricked in and the engraving is sketched in on a slant (a moving mask); the embossed card and corner points are pressed in last. Buttons and the review scrolls are drawn across (a clip from left to right); avatars and list stars fade in with their lines; the colored decks fade in (rising 14px with motion allowed). These are in-place reveals, so they also play with reduced motion. Pieces arriving together start 0.12s apart; each plays once and then stays. Every animation fills backwards only, so nothing is left behind afterwards. The video itself stays sharp throughout the scroll; `js/hero-video.js` only manages playback.

### Landing video — 17 November 2026

Sharpness correction: the first web copy was downscaled to 1280×720 at CRF 26, which softened the fine linework when enlarged on desktop. The active `nyala-hero.mp4` is now encoded at the source's full 1920×1080 resolution, CRF 18, without audio. It is approximately 38 MB; the original source is approximately 78 MB. `index.html` uses a versioned URL to bypass cached copies of the old lower-resolution file. Browser playback check confirmed 1920px video width, time advancing, and off-screen pause/resume. The static poster still covers loading and blocked autoplay. This supersedes the earlier 1280×720 derivative specification below.

The landing hero now plays the supplied `assets/Background/The Nyala Website Video.mp4` using a silent optimized derivative, `assets/Background/nyala-hero.mp4` (1280×720, H.264, full 60-second duration, approximately 3.6 MB). Rebuild using `tools/build-hero-video.ps1`; the original 78 MB upload is preserved. The video autoplays muted, loops, and plays inline on phones. `js/hero-video.js` pauses playback when off-screen or the tab is hidden and resumes on return. The existing collage remains as poster and fallback. Video sits behind the unchanged live text and buttons; it uses the existing desktop 16:9 composition and phone illustration area with a faded lower edge. No other section background changes. Chrome desktop and phone checks confirmed advancing playback, muted/inline/loop settings, off-screen pause/resume, and no horizontal overflow. The local server now serves video MIME types and byte ranges for media playback.

### Reviews in the home-page flow — 9 November 2026

Reviews background update: use the original `assets/Background/Dark Brown Background.png` only on the full-width `.reviews-section`, centered with cover and no repetition. (2026-11-18: the dark paper sits on `.reviews-section::before`, starting 160px above the section and faded in with a mask over its first 280px, so the orange Readings paper blends into it with no hard edge; `.readings` sits above that layer so the fade never covers its buttons.) An inner `.reviews-main` retains the 1320px content limit and existing responsive padding. Cream typography, placeholder cards, and layout stay unchanged. The opaque dark paper covers the shared orange background and its embossed layer within this section. Landing and Readings backgrounds are unchanged. Verified full-width coverage and no horizontal overflow at 320, 390, 768, and 1440px. This supersedes the orange-background description in the previous integration notes below.

Reviews now lives at `index.html#reviews`, after Readings and Offerings. The home page has three sections: landing, readings, and reviews. The navigation uses a same-page anchor. Preserve the review introduction, colored card fan, three cream placeholder panels, and closing link back to readings. Use an h2 section heading and h3 card headings; the home page retains a single h1. The orange paper and scattered embossed symbols continue behind the section. Cards stack on phones. `reviews.html` is a compatibility redirect to `index.html#reviews` with a fallback link, not a second copy of the content. Reviews remain clearly marked coming soon; no testimonials or ratings have been invented. This supersedes previous standalone-review-page rules. Checked anchor navigation at 320, 390, and 1440px and the old URL redirect at 768px, with no horizontal overflow.

### Active orange background — 9 November 2026

Use the original `assets/Background/Orange Background.png` directly for the shared orange areas: Readings and Offerings, reviews, and the booking page surrounding the shaped intake paper. `body::before` displays it centered with `cover` and no repetition. This replaces the older cropped `assets/paper.jpg` tile and supersedes the historical `Background/12.png` references below. No build step is needed. Preserve the landing collage and the intake's masked cream paper.

Randomized relief: `js/paper-symbols.js` adds a decorative fixed layer above the orange paper and behind all page content. Each page load shuffles the eleven original embossed WebP assets into 18 jittered placements, varying size, rotation (up to 28 degrees), and opacity. At 640px and below, show eight smaller symbols with separately distributed phone positions. Positions remain stable during scrolling and resizing; only a new page load reshuffles them. Keep the original artwork colors and transparency with no filters. Group opacity is 55% desktop, 42% phone, with individual opacity from 70–100%. Overlap and partial edge cropping are intentional. The layer is clipped, hidden from accessibility APIs, and ignores pointer events. The opaque landing collage and masked intake paper cover it. Browser checks on all three pages at 390px and 1440px confirmed loaded symbols, no horizontal overflow, and clear content layering.

### Active intake stationery — 9 November 2026

The booking form panel now uses the original files in `assets/Intake Form/`: `Bg inside the border.png` for the cream paper and `Border For Intake.png` for the rust ornamental frame. Apply both only to `.page-booking .book-main`; the surrounding terracotta paper and left-hand Nyala illustration stay unchanged.

Paper silhouette refinement: the panel itself is transparent. Its `::before` holds the paper, masked to the actual border outline using `mask-top.svg`, `mask-middle.svg`, and `mask-bottom.svg`. This removes the rectangular paper outside the ornaments. The mask bands share `--intake-frame-band` with the border, so they align as the form grows. Only the paper is masked; the controls retain normal layout and interaction. Regenerate the vector silhouettes with `powershell -ExecutionPolicy Bypass -File tools/build-intake-mask.ps1` if the supplied border changes. Original PNGs remain untouched. Desktop and phone screenshots confirm the cut edge and no horizontal overflow.

The border is a pointer-transparent pseudo-element, with top and bottom slices of 600 source pixels and a vertically extending center. Desktop border bands are 160px, with 164px top/bottom content clearance; phones use 130px bands and 134px top / 130px bottom clearance. Desktop form content scrolls inside the frame; at 980px and below the page scrolls normally and the frame extends with the form.

Preserve all fonts and form behavior. Use dark rust text, muted brown helper text, pale fields, warm selected states, and dark red errors. Input text is 16px; date/time controls use the light color scheme. The primary submit button is rust with cream text. These rules supersede earlier dark-panel styles described below. Checked 320, 390, 768, 1024, and 1440px; calendar selection, ranked chips, and empty-form validation remain functional. No form backend changes.

### Active landing background — 9 November 2026

Landing alignment refinement: desktop now preserves the original collage's 16:9 proportions instead of using a viewport-height cover crop. Copy starts at 56% of the hero width and 9.8% of that width from the top, with 5% right clearance. Headline (3vw), description (1.6vw), action (3.6vw tall), and spacing scale with the artwork. This removes the previous capped copy width and font sizes that caused the text to shrink relative to the image when zooming out. At 1000px and below, use the stacked illustration and centered text layout, with a 24–36px headline, 20px description, and 54px button. Preserve browser zoom and natural scrolling; do not lock the viewport or disable scaling. Checked 320, 390, 768, 1024, 1440, 1920, and 2880px CSS viewports, including expanded viewports equivalent to desktop zoom-out. This supersedes the earlier aspect-ratio breakpoint and cropped desktop positioning below.

The user selected `assets/Background/The Nyla x Vitruvian Man.png` for the landing hero only. The filename spells Nyla without the second "a". Use this original collage on `.hero--collage::before`, with dark rust text and the existing font families and framed primary button. Desktop copy occupies the open upper-right area; at 1000px and below or aspect ratios of 3:2 and narrower, the artwork sits above centered copy and fades into cream paper. The hero's light background ends at the Readings and Offerings boundary.

The collage already includes Nyala, so the separate animated circle and embossed card overlays are no longer rendered on the landing hero. `js/hero-motion.js` remains available for the previous composition but is not loaded. Readings, its colored fan and lace service cards, reviews, and booking retain the terracotta `assets/paper.jpg` background. Do not regenerate the shared paper assets from the new collage.

This section supersedes the earlier framed-hero, centered-circle, embossed-field, and home-motion rules below, which describe previous iterations. Verified the collage at 320, 390, 768, 1280, 1440, and 1920px, with no horizontal overflow. Computed styles confirm Readings still exposes the shared terracotta paper.

### Centered composition — 9 November 2026

The user requested a layout refinement while preserving every font and artwork file. The hero now follows one centered vertical sequence: Vitruvian Nyala, headline, short introduction, and framed primary button. This replaces the lower-left copy and detached lower-right action. The original artwork, fonts, terracotta, animation, services, and booking destinations remain. Navigation uses simple Anaktoria text links so the primary button has greater emphasis; Readings and Reviews are both visible on phones.

### Selected background — 9 November 2026

The active background is the client's warm terracotta `assets/Background/12.png`, chosen and approved to replace the darker rust variant. `tools/build-paper.ps1` explicitly selects this file and creates both `assets/paper-frame.jpg` and the plain `assets/paper.jpg` tile, preserving its original colors. All three pages share this paper. The fallback color is `#8f3f20`; cream type and dark rust controls remain. The home-page frame, artwork placement, and responsive layout are unchanged. Desktop and phone previews of home, reviews, and booking were checked after the change.


### Uploaded tarot artwork integration — 9 November 2026

Reference matching: the user's close-up shows a faint, fine-lined impression in the paper. Set the entire embossed field to 60% opacity on desktop and 50% at 1100px and below. Preserve the original relief, sharp detail, and overlapping layout; no added filters or outlines.

Current direction: the user requested more embossed symbols as background design and explicitly allowed overlap. Use eleven original relief illustrations in a clipped layer behind Nyala and the hero copy. Preserve natural RGB and alpha; do not restore the rejected bright outlines or visibility filters.

The existing two-section home page and separate booking page remain the layout. The user's colored tarot cards and embossed symbols now extend the paper theme:

- **Hero:** eleven embossed cards (Magician, High Priestess, Fool, Hermit, Wheel of Fortune, Temperance, Strength, Empress, Lovers, Chariot, Justice) form a full background pattern. Retain the original Magician and High Priestess positions and add varied sizes and rotations around and behind them. Overlap with each other, the frame, and Nyala is intentional. The copy and actions remain above the background. At 1100px and below, show six smaller cards at 50% group opacity, clipped at the hero edges.
- **Readings introduction:** a static three-card fan uses The Fool (left), The High Priestess (front), and Wheel of Fortune (right), in the client's original colors. It sits beside the heading and lede above the existing service-card row. The fan occupies a 300×260px area on desktop and 240×230px at 1100px and below; at 900px and below it stacks beneath the introduction. Outer cards tilt by 17 degrees, while the center card remains upright.
- **Service cards:** since 2026-11-18 shown as pricing columns (see "Pricing columns"), each keeping its card's engraving; earlier, all three cream card designs (shown without their lace border since 2026-11-17, with rounded corners), their delivery information, prices, and booking links. The decorative tarot cards do not represent different services or a daily draw. On narrow screens the single service-card column is centered.
- **Accessibility:** all added artwork is decorative, has empty alt text, and sits inside an `aria-hidden` container. It has no pointer events or controls. Image dimensions reserve space; the colored cards load lazily.
- **Production assets:** `tools/build-deck-assets.ps1` creates fourteen WebP files in `assets/deck/` and a source/provenance JSON file for each. Colored cards are 480×720; embossed symbols range from 280×420 to 600×900. Original PNGs in `assets/ColoredCards/` and `assets/EmbossedSymbols/` remain untouched.

The embossed cards are background texture, not isolated foreground objects. Overlap is approved; preserve the visual priority of the cream Nyala motif, text, and controls.

### Landing artwork update — 9 November 2026

Sizing refinement: Nyala is centered horizontally above the copy in normal document flow. Desktop diameter is min(38svh, 42vw, 480px). At 900px and below it is min(78vw, 40svh, 380px), with 104px top padding instead of a viewport-centered empty gap. Artwork-to-copy spacing is 28px; copy-to-button spacing is 24px desktop and 22px mobile. The hero grows with its content on short screens.

The landing hero uses the client's Vitruvian Nyala artwork from `assets/Nyala Symbols/A space for tarot readings, birth charts, and cosmic guidance designed to help you understand yourself a little deeper. (9).png`. A circular CSS crop isolates the main motif and a CSS filter displays its linework in cream on the rust paper; the original file is preserved. The motif is centered above the headline, with its existing float and cursor tilt. The booking page retains its original figure and motion. `index.html` no longer loads the old `js/main.js` fitting script.

**Creative North Star: "Nyala on the Paper"**

The site is a piece of old stationery. Its ground is the client's own rust-red paper: flecked, lightly worn, and on the first screen pressed with an embossed Art Nouveau frame whose rounded label at the top left holds the wordmark. The cream Vitruvian Nyala motif is the central focus, with subtle embossed tarot symbols beside it. Colored tarot illustrations introduce the readings; cream lace service cards, scrolled button frames, and cream type carry the interface.

The mood is quiet and keepsake-like. The paper and the client's illustrations carry the colour; the interface stays cream and sparse. Only the home-page Nyala moves; the embossed background and colored cards stay static. The booking figure retains its slow float.

The site has three pages, including the draft Reviews page (`reviews.html`). The home page (`index.html`) scrolls through two sections on the same paper: the first screen, the client's framed design (on wide screens), then Readings and Offerings (`#readings`), the client's three lace cards. Each card leads to Begin Your Reading (`book.html`), the intake form on a focused page of its own: browsing flows on one page, the task gets a quiet one. Daily Card and the earlier About content remain parked in `_parked/`; the About navigation link is removed. Reviews now has its own draft page in the current design. The forest painting, its butterflies and the ivy vines of the earlier version were retired with it (client decision, 2026-10-30); the vines script is kept in `_parked/js/`.

**Key Characteristics:**
- The client's rust paper as the ground, with its embossed frame and label framing the first screen on wide screens
- Vitruvian Nyala large and centered in cream linework, supported by dark embossed symbols on desktop
- The Nyala Font, a hand-drawn storybook script, for the wordmark and headlines; Anaktoria, a calligraphic Garamond-style serif, for secondary titles, prices, intro lines and button labels; a light grotesk for the form
- The client's original colored tarot illustrations, cream service cards, and ornamental button frames laid on the paper
- Gentle motion on the home-page Nyala; static background artwork. The booking-page Nyala retains its own float.

## Colors

Rust paper and warm cream, with deep rust-brown for anything that needs to sit darker than the paper.

### Primary
- **Cream** (cream): all interface type, rules, borders, the chosen states and the "Send my intake" fill. It matches the cream service cards and the button frames, and is the only UI colour.

### Neutral
- **Paper** (paper): the client's rust paper, shown while its texture loads; the texture itself is `assets/paper.jpg`.
- **Ink** (ink): deep rust-brown, the dark text on cream (the "Send my intake" label, chip badges, the chosen calendar day).
- **Cream Text / Cream Muted** (cream-text, cream-muted): headings and the lede; secondary copy at lower strengths of the same cream.
- **Cream Rule** (cream-rule): the text-selection highlight. Hairlines and borders use the same cream at 12–30%.
- **Shadow** (shadow): a warm near-black for text shadows and drop shadows, never a cool grey.
- **Panel / Field / Button Fill** (panel, field, button-fill): deep rust-brown at 84%, 40–55% and 62%: the booking box, the form's inputs, choices and calendar, and the fill inside the button frames.
- **Scrollbar** (scrollbar-thumb on scrollbar-track): the page's scrollbar in the paper's own reds.

### Named Rules
**The Artwork Carries the Colour Rule.** Colour comes from the client's paper, colored tarot illustrations, booking-page Nyala, and cream service cards. The interface adds no accent colour, glow or tint: it is cream, with deep rust-brown where something must sit darker than the paper. Preserve the uploaded cards' colors and embossed symbols' dark relief.

**The No-Accent-Button Rule.** The primary action is the client's cream ornamental frame filled with deep rust-brown, not a coloured button. The one exception is the booking form's final "Send my intake", which is filled with cream (still no accent colour) because it closes the whole flow.

**The Coral Is for Errors Rule.** Coral (error-line, error-text) marks form errors and nothing else.

## Typography

**Display Font:** The Nyala Font (`assets/fonts/TheNyalaFont-Regular.ttf`, made with Calligraphr; falls back to Hanken Grotesk)
**Secondary Font:** Anaktoria 6.31 by George Douros (`assets/fonts/Anaktoria.ttf`; falls back to Georgia, then any serif)
**Body Font:** Hanken Grotesk (with Manrope, system-ui)

**Character:** A hand-drawn monoline script with spiral curls at the stroke ends sets the brand voice in the wordmark and headlines; Anaktoria, a calligraphic Garamond-style serif (from Garamond's "Grecs du roi" and the First Folio Shakespeare), is the storybook voice one level down and the lettering of the client's cards; a quiet neo-grotesk carries the form.

### Hierarchy
- **Wordmark** (The Nyala Font 400, line-height 1): in the paper's label on the framed first screen, sized with the frame (54px of the 1920×1080 design, about 43px on a 861px-tall window) and centred in the label; otherwise "TheNyala" at the top left on the edge, clamp(26px, 1.2vw + 1.2vh, 36px), 24px on phones, level with the menu.
- **Display** (The Nyala Font 400, clamp(26px, 1.8vw + 1.3vh, 44px), 1.18): the hero headline, two balanced lines. The script runs wide, so it is set smaller than a grotesk would be.
- **Lede** (Anaktoria 400, 18px, 1.45, max 44ch; 16px on phones): the line under the hero headline, and the glade's line under "Begin Your Reading". The readings section's lede is 19px (lede-section).
- **Secondary titles** (Anaktoria 400): the prices under the cards (25px), "Your intake" (30px), the form's section titles such as "About you" (23px), and the chosen day's number in the date picker (48px; 36px on phones; lining figures).
- **Button and menu labels** (Anaktoria 400, line-height 1): the framed buttons at 19px (button-label), the framed menu links at 17px (nav-label), matching the client's lettered button sample.
- **Label** (Hanken Grotesk 400, 14px, +0.01em): form labels and other small interface text.

### Named Rules
**The Script Is a Voice Rule.** The Nyala Font sets only the wordmark and headlines. It has no digits, hyphen, dashes, & / or brackets, and its curls blur at small sizes, so body copy, labels, buttons and anything with numbers stay out of it. It has one weight; never let the browser fake bold or light versions of it (`font-synthesis: none`).

**The Secondary Voice Rule.** Anaktoria sets the titles one level below the script headings, the prices, the short intro lines, the big date number, and the labels inside the ornamental frames (the framed buttons and menu links, at 17px and up; client decision 2026-10-30, after their lettered button sample). Never form labels, fields, chips, lists or the filled "Send my intake": it has a single weight and a calligraphic, italic-like hand, so small interface text stays in Hanken Grotesk. Never fake other weights (`font-synthesis: none`). Its contextual alternates are switched off (`font-variant-ligatures: no-contextual`), because they swap in swash word endings that read as stray dots at text sizes. Its figures are old-style by default; use lining figures (`font-variant-numeric: lining-nums`) where a number stands alone and large.

**The No-Kicker Rule.** No eyebrow or kicker labels above headings. The headline speaks for itself.

## Layout

The home page scrolls through two sections. The plain paper (`assets/paper.jpg`, tiled at 860×700) is fixed behind every page. The hero uses at least 100svh on desktop and content height on phones and tablets up to 900px. The menu scrolls away with it. "Find Your Path" and "Readings" glide down to the readings (instant with reduced motion).

**The framed first screen (signature)**, on screens at least 1280px wide, 700px high, and at least 3:2 (wide enough for the wordmark in the label and the menu beside it): the hero is the client's whole 1920×1080 design (`assets/paper-frame.jpg`), drawn as a `border-image`. The frame's sides, 500px of the source each (the label, the corner scrolls and the twisted side vines), keep their true shape, scaled by the window's height; only the plain middle (the straight top and bottom rules and the paper) stretches, so the frame fits any width without distorting. Everything is placed in units of the design's own pixels (`--k`, one source pixel at this height):
- **Wordmark:** centred in the label, at (260, 120).
- **Menu:** level with the label (centred at 120), its right end 470 in from the right edge, inside the frame and clear of the top-right corner scrolls.
- **Headline, lede and button:** centered in a column up to 620px wide beneath Nyala. The existing brand headline is 28–40px desktop, 24–34px at 900px and below; line height is 1.22. Anaktoria introductory text is 20px desktop and 19px mobile. Its shorter sentence introduces the service; delivery formats remain explained in the readings section. The button follows the copy. No absolute positioning of text.
- **Nyala:** centered horizontally above the headline. CSS controls its size and 6-second float; `js/hero-motion.js` adds mouse tilt. The embossed field is a separate background layer spanning the whole hero, with more symbols positioned toward the outer areas to leave the middle clearer.

**Elsewhere** (narrower or taller windows, or windows shorter than 700px), the hero uses plain paper with the wordmark at the top left and navigation at the top right. All sizes use the same artwork-to-copy-to-action sequence. The hero grows vertically to fit the content; phones do not reserve a full empty viewport.

**At 900px and below:**
- **Reading zone:** has a 24px inset and stacks into one column, the button under the copy.
- **Navigation:** Readings and Reviews remain visible as text links; the placeholder Daily Card link is hidden.

**Readings and Offerings section:** on the plain paper, in a 1320px column with 110px above and 120px below. The title and lede sit left of the colored card fan, followed by the three service cards in one row with 44px gaps. At 900px and below the fan stacks below the introduction and service cards form a centered column (up to 440px wide, 56px apart). Phone section padding is 84px above and 96px below.

## Elevation & Depth

The paper is the flat ground; things laid on it cast soft, warm shadows (shadow colour, never grey). The home-page Nyala is cream linework with no shadow, like a print on the paper; the booking figure keeps her own flat colours. The lace cards cast a shadow that follows the lace (`drop-shadow(0 16px 22px rgba(26, 6, 3, .45))`), so it falls through their cut-outs; the button frames carry a small one that follows their shape (`drop-shadow(0 2px 3px rgba(26, 6, 3, .5))`); the booking box has a deep soft shadow (`0 24px 60px rgba(26, 6, 3, .5)`).

### Named Rules
**The Primary Figure Rule.** Nyala remains the hero's focal point. The dark embossed figures support her without crossing her circle or the text. Colored tarot cards belong in the readings introduction.

## Shapes

The UI uses 1px cream rules and 3px radii on form controls. The UI's own panels are near-square too (6px). The embossed frame of the paper and the scrolled ends of the button frames are the client's artwork, not UI shapes. The service cards have 18px rounded corners (client request, 2026-11-17). There are no pill shapes.

## Reviews page draft

`reviews.html` uses the same rust paper, cream typography, ornamental navigation, and original colored tarot-card fan. Its header links home, to Readings, and to Reviews; Reviews has `aria-current="page"`. The introduction reads "Words after a reading" and explicitly says reviews are coming soon.

**Review stories (home page, client request 2026-11-18).** The home page's Reviews section shows three "stories", one per reading (Digital Tarot Reading, Birth Chart Reading, Birth Chart + Tarot), side by side above 900px and stacked below. Each has a round avatar (a cream placeholder silhouette on deep rust, ringed in cream like a story circle; the ring dims once that story has been opened) with the reading's name in Anaktoria and a rolled scroll beside it. The scroll is drawn in CSS as old paper (revised 2026-11-18 after the first version read as cartoonish): two rolled-up ends of parchment with their spirals showing at either side, lying almost on top of each other and sealed with a matte, unevenly pressed wax seal bearing the brand's four-point star; the sheet has a fine fibre grain and broad faint stains (SVG noise), edges darkened with handling and a slightly ragged outline (the `#story-rough` displacement filter in `index.html`, applied to the paper layer only so the writing stays crisp), and the review is written in Anaktoria in dark ink; and a "Tap the scroll to open it" hint. Tapping it unrolls the scroll downward (the paper grows between the rods over 1s, so the lower rod travels down and the seal lifts away) to show the review on cream paper with shaded edges; tapping either rod rolls it back up. Built as a disclosure: the top rod is a button with `aria-expanded` and an `aria-label` naming the action and reading, and the rolled paper is `inert` (`js/review-stories.js`). The unroll also plays with reduced motion, since it is the scroll opening in place, the action the visitor asked for. Content stays placeholder copy with "Review coming soon": no fabricated quotes, names, photos, ratings, or results; replace each avatar and text only with a real, permission-approved review. (The separate draft `reviews.html` keeps the earlier letter-style panels below and is not linked from the site.)

On the draft `reviews.html`: three cream letter-style panels represent Digital Tarot Reading, Birth Chart Reading, and Birth Chart + Tarot. They use dark rust text, a fine double border, and a small decorative star. Each contains descriptive placeholder copy and "Review coming soon", with no fabricated quotes, names, ratings, or results. The panels form three columns above 900px and one column below. The card fan stacks under the introduction on narrower screens. An invitation links back to `index.html#readings`, and the footer returns home.

The draft is marked `noindex`. Replace placeholders with real approved reviews before removing that tag. No review collection form or storage is implemented. This page does not alter the home-page hero or service-card layout.

## Components

### Buttons (signature)
- **The frame is the client's artwork** (supplied 2026-10-30, `Buttons/10.png`): a cream (#fbfaf6) double rule between two scrolled, fleur-tipped ends. `assets/button-frame.webp` is that frame with the sample's "Daily Card" lettering removed. It is drawn as a `border-image` on `::after`: the ends keep their shape and the rules stretch to any width. Each end is .578 of the button's height wide, so the frame never distorts; the label sits between the ends.
- **Framed button (primary action):** 54px tall; cream label in Anaktoria 19px with a soft warm text shadow, plus a four-point star icon that turns a quarter-turn on hover. The whole frame, scrolled ends included, is filled with deep rust-brown (rgb 36, 10, 6 at 62%): `assets/button-fill.webp`, the frame's own silhouette built by the same script and sliced the same way, so the fill always matches the frame at any width. Used for "Find Your Path", "Choose this reading" (full width under each card) and "Back to the home page".
- **Hover / Focus:** the fill lightens to 40%, eased with `cubic-bezier(.16, 1, .3, 1)`. Focus shows a 1px cream outline offset 4px.
- **Under the reading cards** ("Choose this reading", `.offer-cta`): a lighter fill at 25%, 14% on hover (client request, 2026-11-18), so the paper shows through the frame; the cream label stays clearly readable on the orange paper.
- **Not framed:** the form's controls (reading choices, format switch, chips, calendar arrows) and the filled "Send my intake" keep their own near-square styles.

### Navigation
- At the top right, level with the paper's label on framed screens. Home links use Anaktoria 19px, a minimum 44px target height, and 28px gaps, with an underline on hover or focus. At 900px and below use 17px type and 16px gaps; show Readings and Reviews. Only home navigation loses its decorative button frames; the primary button and other pages retain theirs.

### Dynamic Vitruvian Nyala (home page)

Nyala animates automatically, as requested by the user. There is no animation button or saved on/off preference. CSS floats the circular motif upward by up to 12px over a 6-second ease-in-out cycle; at 1100px and below the lift is 8px. Mouse movement adds a tilt of at most 2 degrees per axis, resetting when the pointer leaves.

For reduced-motion preferences, use a smaller automatic float over 8 seconds (6px desktop, 4px on narrow screens) and disable cursor tilt. This explicitly replaces the earlier static default and opt-in control. Touch input does not tilt the image or affect scrolling. `js/hero-motion.js` pauses motion outside the viewport and in hidden tabs. CSS provides the float even without JavaScript. The source PNG and background artwork remain intact.

### Floating Nyala (booking page only)
- **Motion:** Nyala floats up from her fitted spot and settles back: 3% of her height (about 20–25px) over a 4s ease-in-out cycle. She never goes lower than her fitted spot, so her clearance from the headline holds at every point of the float.
- **Reduced motion** (for example Windows with Animation effects off): a softer float, 2% of her height (about 13–16px) over 5s.

### Offer Card
- **Pricing columns** (2026-11-18; the client asked for a reference pricing-table layout, then for it to match the Vitruvian, antique theme of the hero collage, the cards and the embossed symbols): one leaf of aged parchment per reading. Each leaf has three parts that line up across the row through `grid-template-rows: subgrid`:
  - **The leaf:** parchment `#ece2cc` with the shared `--grain` and `--stains` textures (the stains softened to light foxing by a 55% parchment wash), handled edges (inset warm shadows), a ragged outline (`filter: url(#story-rough)`, the same as the review scrolls) and a drop shadow on the page. An inked double frame (3px double, rust at 50%) sits 12px in, with a small compass point (ring and dot) on each corner. A faint embossed tarot card (`assets/deck/embossed-*.webp`, 34%, multiply) is pressed into the lower corner, part-hidden: The Magician (tarot), The Wheel of Fortune (birth chart), Temperance (both blended).
  - **Head:** a Roman numeral (I, II, III; Anaktoria 17px, spaced) and the reading's name (Anaktoria 27px, the cards' ink `#6e1f12`), over a short inked rule with a star.
  - **Top:** the engraving from the client's card (caterpillar, chrysalis, butterfly; cut out by `tools/build-engravings.ps1` into transparent WebP in the cards' ink) drawn over Vitruvian construction lines (a circle, square and triangle with dashed axes, an inline SVG `<symbol id="vitruvian">`, rust at 42%), then who it's for (Anaktoria 18px), the price (Anaktoria 32px, `--night`; "Price coming soon" until set), the format (Anaktoria 16px, `#6e4a33`) and the full-width framed button (fill 82%, 66% on hover).
  - **What's included:** under an inked divider with a star, a title (Anaktoria 20px, ink) and a list in Anaktoria 17px, each item marked with a small rust star; notes under an item at 14.5px. No sans serif inside the leaves. The wording follows the booking form.
- **No highlighted column** (client decision): all three are equal. No billing switch.

### Intake Form (`book.html`)
- **Layout (signature):** a focused page with no menu, on the plain paper. On the left, the glade sits directly on the paper: the wordmark at the top (linking home), Nyala floating in the middle and "Begin Your Reading" in the brand font at the bottom. The glade is a column, so Nyala and the heading can never overlap, and the page is exactly one screen tall (40px margins above and below), so the glade never moves. The line under the heading follows the chosen reading, in the same words as its card. On the right, the intake is a bordered deep rust-brown box (panel: up to 620px wide, 84% with a 12px blur, 1px cream border at 22%, 6px radius, deep soft shadow) laid on the paper and as tall as the glade; the form scrolls inside it, with a thin cream scrollbar (30%) on a clear track. It is headed "Your intake" with "Not sure which reading? Compare them" linking back to the readings on the home page. At 980px and below the glade sits above the box and the box grows with the form (no scroll box inside a scrolling page on touch screens).
- **Flow:** "Your reading" (three choice buttons; a card on the home page preselects one through `?reading=tarot|chart|combo`, and the older `?reading=session` opens the tarot session format). Before a reading is chosen, three numbered steps explain what happens next. Once one is chosen, only the sections that reading needs appear, following the client's intake spec. Fields in hidden sections are disabled, so they are neither checked nor sent.
- **Send:** a full-width cream-filled button with ink text; the error summary sits under it.
- **Reading choices:** deep rust-brown buttons (field at 50%) with an open ring that fills with a cream dot when chosen; the chosen one gets a cream border and a light fill.
- **Fields:** a section title per group, labels at 14px 500, "optional" marked on the few optional fields, hints in caption size. Inputs are deep rust-brown (field, 55%) with a 1px cream border at 24% and a 3px radius; focus brightens the border and adds a soft 3px cream ring.
- **Priority chips:** near-square (3px) buttons; the order they are tapped is the order of importance, shown as a small numbered cream badge, and tapping again removes one and renumbers the rest.
- **Preferred date:** every reading with tarot in it (all three tarot formats and the combined reading, not the Birth Chart Reading) has a "Your reading date" group: a full-width deep rust-brown panel (field, 55%; 1px cream border at 24%; 6px radius, like the inputs) with the month on the left and the chosen day on the right, behind a hairline divider. The month name (16px, 500, with the year muted) sits on the left of the header with two 30px hairline arrow buttons grouped on the right; weekday initials are in caption size. Open days are near-square (3px) tiles in a 7-column grid with a faint cream fill (7%) and hairline (14%); days that can't be chosen (past, today, beyond six months) are bare and dim, and today carries a small dot. The chosen day fills with cream with ink text, like the chip badges. The right column shows it large: the day number in Anaktoria at 48px with lining figures, the weekday (15px, 500) and the month and year (muted); before a choice it says "No date yet". On phones the chosen day sits under the month, number beside the words (Anaktoria, 36px). The week starts on the visitor's regional first day, and the date is sent as YYYY-MM-DD.
- **Tarot formats:** a segmented switch on the Digital Tarot Reading ("One question", "Three questions", "Live 30-minute session"), stacked on phones, with a hint that the question formats come as a PDF with an audio recording and the session is live by video call. The question formats ask for the current situation, the question or questions and a focus; the session asks for questions, ranked areas and anything else, as in the spec.
- **Errors:** checked only after the first attempt to send, then live as the visitor types. Each message names what is missing and how to fix it, in error-text coral under the field, with the field's border in error-line coral; a summary beside the button counts them and focus moves to the first.
- **Thank you:** the form is replaced by a panel ("Thank you" in the brand font) naming the reading and the visitor, and saying what happens next: for the live readings (the tarot session and Birth Chart + Tarot Reading), the reader confirms a time for the video call; for the others, when the PDF and audio recording will be ready. Its "Back to the home page" button returns home.

### The Paper (signature)
- **Source:** the client's 1920×1080 design in `assets/Background/12.png` (terracotta paper with an embossed Art Nouveau frame and a rounded label at the top left). `tools/build-paper.ps1` saves the whole design as `assets/paper-frame.jpg` (about 190 KB, preloaded only on screens that show it) and a plain 860×700 patch from inside the frame as the tile `assets/paper.jpg` (about 50 KB). The paper is evenly lit, so the tiles meet the framed design and each other without a visible seam. Re-run the script if the client updates the design; if the frame moves, update the positions in the framed first-screen rules of `css/style.css` in the current CSS hero rules.

### Service Card Images
- **Source:** the client's `ServicesCards/6.png`, `7.png` and `8.png` (2000×2500). `tools/build-cards.ps1` crops each to its plain cream panel inside the lace border (1236×1928 at 382,286, keeping 16px inside the panel so no lace remains), scales it to 900×1404 and saves `assets/cards/tarot.webp`, `chart.webp` and `combo.webp` (WebP, quality 90, about 65–135 KB each, lazy-loaded). Re-run it if the client updates a card.

### Figure (booking page)
- **Nyala:** `assets/nyala.webp` (572×1744, lossless, 75 KB), rebuilt from `assets/nyala.png` (the logo with its thin internal slits filled) by `tools/rebuild-nyala.ps1`: her colour regions are redrawn at 12× with crisp, smooth boundaries, flat fills and her hair gradient kept. Keep it lossless (lossy WebP softens colour edges). `assets/nyala-lit.webp` and `tools/light-nyala.ps1` lit her for the retired forest and are no longer used.

## Do's and Don'ts

### Do:
- **Do** keep interface type in cream: The Nyala Font for the wordmark and headlines, Anaktoria for secondary titles, prices, intro lines and framed labels, Hanken Grotesk at weights 300–500 for the form.
- **Do** keep the client's frame whole: content sits inside its vines and rules and never crosses its corner scrolls or label.
- **Do** let reading zones on the first screen sit directly on the paper, with no boxes, cards or corner brackets around them (the brackets were removed at the client's request, 2026-10-30). Where content genuinely needs a container (the booking box), use the deep rust-brown panel. The offer cards are the client's own lace artwork.
- **Do** use warm shadows (shadow colour) for anything laid on the paper.

### Don't:
- **Don't** add glows, particles, or extra decorations beyond the approved embossed background on the first screen.
- **Don't** use gradient text, kicker labels or coloured accent buttons in this world.
- **Don't** place copy over Nyala; size her so she clears the headline.
- **Don't** recolour or redraw the client's artwork (paper, cards, button frame).
- **Don't** bring back the parked sections' old styles (Plus Jakarta Sans headings, pill buttons, rounded cards, shimmer text) or the retired forest, butterflies and vines without the client asking; rebuild returning sections in this system.
