# Uploaded tarot artwork on the website

These are web-sized copies of the client's own PNG artwork. The originals are preserved. Each output has a `.webp.json` provenance note; no illustration is generated or redrawn.

| Web file | Source under `assets/` | Placement |
|---|---|---|
| `the-fool.webp` | `ColoredCards/Untitled51_20261026131303.png` | Left card of the readings-introduction fan |
| `the-high-priestess.webp` | `ColoredCards/Untitled51_20261030155039.png` | Front card of the fan |
| `wheel-of-fortune.webp` | `ColoredCards/Untitled51_20261102215546.png` | Right card of the fan |
| `embossed-magician.webp` | `EmbossedSymbols/The Magician.png` | Original upright left-hand hero card |
| `embossed-high-priestess.webp` | `EmbossedSymbols/The High Priestess.png` | Original upright right-hand hero card |
| `embossed-fool.webp` | `EmbossedSymbols/The Fool.png` | Active in the overlapping hero background |
| `embossed-hermit.webp` | `EmbossedSymbols/The Hermit.png` | Active in the overlapping hero background |
| `embossed-wheel.webp` | `EmbossedSymbols/The Wheel of Fortune.png` | Active in the overlapping hero background |
| `embossed-temperance.webp` | `EmbossedSymbols/Temperance.png` | Active in the overlapping hero background |
| `embossed-strength.webp` | `EmbossedSymbols/The Strength.png` | Active in the overlapping hero background |
| `embossed-empress.webp` | `EmbossedSymbols/The Empress.png` | Larger impression beneath the central motif |
| `embossed-lovers.webp` | `EmbossedSymbols/The Lovers.png` | Lower-center background |
| `embossed-chariot.webp` | `EmbossedSymbols/The Chariot.png` | Upper-center background |
| `embossed-justice.webp` | `EmbossedSymbols/Justice.png` | Lower-left background |

Run `powershell -ExecutionPolicy Bypass -File tools/build-deck-assets.ps1` from the project folder to rebuild. Requires ffmpeg. Colored outputs are 480×720; embossed outputs range from 280×420 to 600×900. Conversion uses Lanczos resizing and WebP quality 90, retaining original colors and transparency.

The fan is decorative, static, and lazy-loaded. It is not a daily draw or a choice of service. The existing cream lace service cards still carry all reading names and delivery details. Eleven embossed figures at 60% group opacity form a clipped background beneath Nyala and the hero text. At 1100px and below, six smaller figures remain at 50% group opacity. They use no color or contrast filter, and overlaps are intentional. The colored fan stacks below the introduction at 900px and below.

Other uploaded tarot cards and background color variants remain available in their original folders for future use. The website uses the approved terracotta paper from `assets/Background/12.png`.
