# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

The landing artwork is now a silent looping background video from the supplied Nyala MP4, with the existing collage as a fallback. It autoplays inline on phones and pauses off-screen. It adds no controls or changes to the reading/booking flow.

The current visual treatment uses Anaktoria for the wordmark and main headings, a lighter fill on framed actions, and a gentle blur and fade as the Readings and Reviews content enters view. The video itself remains sharp. Reduced motion preferences disable the section transition. Form controls retain the sans serif font for readability.

Current page structure: `index.html` contains the landing hero, Readings and Offerings, and Reviews as consecutive scrollable sections. Reviews navigation targets `#reviews`; `reviews.html` redirects to that section for old links. Booking remains on `book.html`. Review content is still a clearly labeled draft awaiting real client feedback.

Reviews uses the supplied `assets/Background/Dark Brown Background.png` as its section background, fading in softly from the orange above. This overrides the shared orange paper only within Reviews.

The intake form's visual surface uses the supplied cream paper and ornamental rust border in `assets/Intake Form/`, with dark text and light fields. This styling is limited to the form panel; reading choices, conditional questions, validation, and existing submission behavior remain unchanged.

## Stack

Static HTML/CSS/JS (`index.html`, `book.html`, `css/style.css`, `js/booking.js`, `js/hero-motion.js`, `assets/`). The home page uses CSS for artwork placement and a gentle float, plus `js/hero-motion.js` for mouse tilt and motion preferences; the old `js/main.js` fitting script is retained but not loaded. No framework or required build step; optional PowerShell tools prepare web assets.

## Users

People seeking personal guidance through tarot and astrology who want to book a one-to-one reading. They arrive curious or at a crossroads (love, work, a decision, a life chapter), want to understand what each reading offers, and then book by filling in an intake form.

## Product Purpose

TheNyala is a tarot reading and birth-chart (astrology charting) business. The website explains the readings and lets a visitor choose one and submit the intake details the reader needs before the session. Success means a visitor confidently picks the right reading and completes the intake.

## Positioning

Readings are one-to-one, prepared in advance from a structured intake (birth details, questions, focus areas in priority order), rather than instant or automated readings. Each is delivered either as a written reading (PDF) with an audio recording, or live by video call.

## Operating Context

- Delivery (from the client's service cards, 2026-10-30): **Digital Tarot Reading** as a PDF with an audio recording (the one- and three-question formats) or a live 30-minute video session; **Birth Chart Reading** as a PDF with an audio recording; **Birth Chart + Tarot Reading** as a live video session of 60 to 70 minutes. The mapping of the one- and three-question formats to PDF and audio is inferred from the card, not stated by the client.
- Booking starts with the intake form; the reader reviews it, then confirms by email a time for the video call, or when the PDF and audio recording will be ready.
- Intake fields per reading (source: the client's "4.3 Intake Form" spec):
  - **One Question Tarot / Three Question Tarot:** preferred name, pronouns (optional), email, current situation, question (one) or questions (three), anything to focus on.
  - **Birth Chart Reading:** preferred name, email, date of birth, birthplace (city, region, country), exact birth time, birth time confidence (1-10), main reason for booking, main areas to explore (choices and priority), anything else.
  - **30-Minute Tarot Session:** preferred name, pronouns (optional), email, questions, main areas to explore (choices and priority), anything else.
  - **Birth Chart + Tarot:** basic details, plus the birth chart fields and the tarot fields (current situation, questions, main areas, focus).

## Capabilities and Constraints

- Official offering (confirmed 2026-10-29, renamed on the client's own service cards 2026-10-30), shown as three pricing columns (since 2026-11-18) carrying each card's engraving, formats and what's included (earlier: the client's three card images; their lace border left out since 2026-11-17): **Digital Tarot Reading** (in three formats: one question, three questions, or a live 30-minute session), **Birth Chart Reading**, and **Birth Chart + Tarot Reading**. The client merged the 30-Minute Tarot Session into the tarot card; each format keeps its own intake fields from the spec above.
- **Prices: undecided.** Show "Price coming soon" placeholders until the client provides prices. No reading is highlighted as "most popular" (client decision).
- The intake form is built (`book.html`) but submissions are not yet sent anywhere: it shows the thank-you without delivering the answers (open decision: email or a form service).
- The "main areas to explore" choice lists were drafted, not supplied by the client (open decision).
- The site has three pages: a draft reviews page (`reviews.html`), a scrollable home page (`index.html`) with the landing hero and then the readings and pricing (`#readings`), and the booking intake form on its own page (`book.html`). The Digital Tarot Reading intake offers its three formats (one question, three questions, live 30-minute session). Every reading with tarot in it (the three tarot formats and Birth Chart + Tarot Reading) asks for a preferred date, from tomorrow up to six months ahead; the reader confirms it by email. This is the first step towards booking through a GoHighLevel calendar. A daily one-card draw exists only in `_parked/` for now; the moon-phase readout was removed at the client's request.

- Reviews are a draft presentation only: three clearly marked placeholders, one for each reading type. No client quotes, identities, ratings, or aggregate review scores are available. There is no review submission form. About was removed from navigation; Reviews is linked from the home page on desktop and phones.

## Brand Commitments

- Approved backgrounds: `assets/Background/The Nyla x Vitruvian Man.png` for the landing hero only; `assets/Background/Orange Background.png` directly for Readings and Offerings, reviews, and the booking page. The intake form uses its own masked cream paper. Original files are retained.

- The orange background carries a subtle randomized scatter of existing embossed symbols. This is decorative only, with no card-drawing behavior or controls. It changes on page load and remains still while browsing.

- The home page keeps two sections: the supplied Nyala collage with headline, short introduction, and Find Your Path button, then Readings and Offerings with three pricing columns (one per reading, each with its card's engraving). The collage includes the figure, replacing the separate animated circle and embossed overlays. Fonts remain unchanged; Readings and Reviews links remain visible on phones. The colored tarot fan still accompanies the readings introduction. Decorative artwork does not add interactive readings or services.
- Name: **TheNyala**.
- **Nyala is the brand spirit / mascot**, not the reader. She is an illustrated figure: very long black hair, two curved horns, a glowing four-point star in place of a face, holding a red heart. The actual reader is a real person whose name is not yet provided.
- Logo files: `assets/logo-original.png` (on rust background), `assets/logo.png` (transparent cut-out, about 143×436 px, low resolution), `assets/favicon.png`.

## Evidence on Hand

- No testimonials, client names, reader name, reader bio, reader photo, or prices yet. Do not fabricate any of these; use clearly marked placeholders.
- No photography. Client-supplied artwork includes the rust paper and alternate backgrounds (`assets/Background/`), three service cards (`ServicesCards/`), ornamental button frame (`Buttons/`), Vitruvian Nyala (`assets/Nyala Symbols/`), colored tarot illustrations (`assets/ColoredCards/`), and embossed tarot symbols (`assets/EmbossedSymbols/`). Selected tarot illustrations are served as web-sized copies from `assets/deck/`; the original PNGs remain intact.

## Product Principles

1. Choosing the right reading should feel calm and guided, never pushy or fear-based.
2. The intake asks only for what each reading actually needs.
3. Honesty over mystique: no invented proof, prices, or predictions.
4. Nyala is the brand's presence; the human reader is the service.
