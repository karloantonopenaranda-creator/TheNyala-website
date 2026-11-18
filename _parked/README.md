# Parked sections

A full copy of the site as it was on 2026-10-28, before the live `index.html` was trimmed to the landing screen only.

It contains the sections that were removed from the live page, all still working:

- Daily card (draw one of three Major Arcana cards)
- Readings and prices (placeholder services and prices)
- How it works (three steps)
- Meet your reader (placeholder bio and portrait)
- Client reviews (placeholder quotes)
- Booking intake form (five reading types, conditional fields, priority chips; not yet connected to any backend)
- Footer

Open `_parked/index.html` in a browser to see it. Its sections below the hero still use the older forest-and-cream styling and will need restyling into the current design before they return to the live page.

## `pages/`

`pricing.html` as it was on 2026-10-29, when Readings and Offerings was a separate page. It now lives as the second section of the home page (`index.html#readings`). It's kept for reference only: it points at the live `css/` and `js/` with paths that no longer resolve from here, so it won't render properly. (The booking page, `book.html`, was parked here briefly and is live again.)
