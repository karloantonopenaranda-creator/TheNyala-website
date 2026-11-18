---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Home page: Nyala collage, then terracotta readings

Current type and motion (17 November 2026): Anaktoria sets the wordmark and main headings. The framed action fill is lighter while its original artwork remains. When scrolling between Landing, Readings, and Reviews, incoming section content fades and comes into focus. The video stays sharp and section backgrounds do not move. Reduced motion disables the transition. The main text and button keep their responsive placement.

Active landing media (17 November 2026): use `assets/Background/nyala-hero.mp4`, generated from `The Nyala Website Video.mp4` by `tools/build-hero-video.ps1`. Preserve the source upload. The full 60-second 1280×720 H.264 derivative has no audio and is approximately 3.6 MB. Autoplay muted, loop, playsinline; existing collage is poster/fallback. `js/hero-video.js` pauses off-screen and hidden-tab playback. Keep the existing desktop artwork coordinates and mobile faded illustration region, with live text above the video layer. Other backgrounds remain unchanged. Desktop and phone playback and responsive geometry verified.

Sharpness update (17 November 2026): the active derivative is 1920×1080 H.264 at CRF 18, approximately 38 MB, preserving thin source lines. The previous 1280×720 / CRF 26 version caused desktop blur. `index.html` uses `nyala-hero.mp4?v=2` for cache refresh. Browser playback confirmed full-resolution video and off-screen pause/resume. The original upload remains untouched.

Current flow: landing hero → Readings and Offerings → Reviews. Reviews is a labeled section at `#reviews`, linked by the home navigation. Preserve the existing coming-soon review cards and invitation back to `#readings`; use h2/h3 heading hierarchy. The former `reviews.html` redirects here. Desktop and phone navigation and layout checked after integration.

Reviews now uses the original `assets/Background/Dark Brown Background.png` across the full section width, with content constrained by an inner `.reviews-main`. This replaces the orange/embossed background only within Reviews. The landing collage and orange Readings section remain unchanged.

Current shared background (9 November 2026): use `assets/Background/Orange Background.png` directly, centered with cover and no repetition. This supersedes older `paper.jpg` / `Background/12.png` references. The landing collage and masked cream intake paper remain separate.

Updated 9 November 2026. The user requested the supplied "The Nyala x Vitruvian Man" background for the landing hero only, explicitly excluding Readings and Offerings.

## Current design

- Use the original `assets/Background/The Nyla x Vitruvian Man.png` on `.hero--collage::before`. Preserve the source file. The filename spells Nyla without the second "a".
- The collage already contains Nyala. Do not add the previous separate circle, embossed-card overlays, or ornamental terracotta frame over it. The old hero-motion script is retained but not loaded.
- Use Anaktoria for the wordmark and display headings. Dark rust headline, introduction, wordmark, and navigation contrast with the light paper. The primary button retains its cream frame and uses a lighter dark fill.
- Desktop uses the collage's original 16:9 aspect ratio without cover cropping. Anchor copy at 56% from the left and 9.8% of hero width from the top, with 5% right clearance. Scale headline (3vw), description (1.6vw), button (3.6vw high), and spacing with the artwork, preserving the composition on zoom-out. At widths up to 1000px, place the illustration above centered copy; fade its bottom into cream paper. Mobile uses a 24–36px headline, 20px description, and 54px button. Do not disable browser zoom.
- Keep all new background and color rules scoped to the hero and home header. The shared body paper, Readings and Offerings, colored fan, three lace cards, booking destinations, reviews, and booking page are unchanged.
- Navigation: Readings, Daily Card (placeholder), Reviews; show Readings and Reviews on phones. About remains removed.
- Never use the new collage as input to `build-paper.ps1`: that script supplies the shared terracotta background from `assets/Background/12.png`.

## Verification

Chrome checked at 320x568, 390x844, 768x1024, 1280x720, 1440x900, and 1920x1080. No horizontal overflow. Visual review confirmed the responsive collage and readable text. Computed styles show the collage only on the hero; Readings remains transparent over the shared `assets/paper.jpg` terracotta layer. Original booking links remain.

Randomized orange-paper decoration: `js/paper-symbols.js` adds 18 embossed symbols on desktop and eight at 640px and below. Placements, sizes, angles, and opacity vary on each page load, then stay fixed while scrolling. Original artwork colors are preserved. The clipped, aria-hidden layer ignores pointer events and stays below page content, including the landing collage and shaped intake paper. Desktop and phone previews confirmed no horizontal overflow.
