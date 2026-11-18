---
version: 1
slug: "book-html"
primary_target: "book.html"
related_targets: []
---

# Begin Your Reading (booking intake)

Current shared background (9 November 2026): use `assets/Background/Orange Background.png` directly, centered with cover and no repetition. This supersedes older `paper.jpg` / `Background/12.png` references. The landing collage and masked cream intake paper remain separate.

Updated 9 November 2026: the user requested the border and background from `assets/Intake Form/` for the form panel.

## Current appearance

- `.page-booking .book-main` is transparent. Its `::before` uses the original `Bg inside the border.png`, clipped to the border silhouette by three SVG masks; `::after` draws `Border For Intake.png`. This exposes terracotta outside the ornamental edges instead of showing a rectangular sheet. Both layers ignore pointer input. Preserve both source files.
- The masks are generated from the original border's alpha outline by `tools/build-intake-mask.ps1`. Their top/middle/bottom slices align with the border using `--intake-frame-band`. Mask only the background, never the form controls.
- The border uses 600-pixel top and bottom source slices, extending the straight center vertically. Desktop decorative bands are 160px and content is inset 164px vertically, 64px horizontally. On phones the bands are 130px and outer insets are 134px top, 130px bottom, and 34px horizontally; the inner scroll wrapper adds its own small padding.
- The desktop form scrolls within the clear middle of its frame. At 980px and below, the whole page scrolls and the border extends with the form height.
- Preserve The Nyala Font, Anaktoria, and Hanken Grotesk. Dark rust text, muted brown hints, pale inputs, warm selected options, dark red validation messages, and a rust submit button suit the cream paper. Inputs use 16px text and light native date/time controls.
- Keep the outer terracotta paper, left-hand Nyala illustration, home link, and introductory copy. This change does not affect the landing collage or Readings and Offerings.

## Behavior and constraints

The three reading choices and tarot formats reveal only the relevant questions. Query-string choices remain preselected. Ranked chips, birth-time confidence, preferred-date calendar, inline validation, and confirmation remain unchanged. The reader confirms timing by email. Intake delivery is still an existing pre-launch integration task; this styling change does not add a backend.

## Verification

Chrome checked at 320x700, 390x844, 768x1024, 1024x768, and 1440x900 across tarot, chart, and combined reading routes. Both uploaded assets load; document and form scroll widths fit. Desktop and phone screenshots confirm clear text and decorative-border spacing. Calendar selection, ranked chips, and required-field validation were exercised at 390px and 1440px. Selected dates and error messages remain readable on the light paper.


Randomized orange-paper decoration: `js/paper-symbols.js` adds 18 embossed symbols on desktop and eight at 640px and below. Placements, sizes, angles, and opacity vary on each page load, then stay fixed while scrolling. Original artwork colors are preserved. The clipped, aria-hidden layer ignores pointer events and stays below page content, including the landing collage and shaped intake paper. Desktop and phone previews confirmed no horizontal overflow.
