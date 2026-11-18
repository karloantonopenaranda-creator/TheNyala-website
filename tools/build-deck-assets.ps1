# Web-sized copies of the client's illustrations. Originals remain untouched.
# Run from any directory: powershell -File tools/build-deck-assets.ps1
param([string[]]$Only = @())
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot
$destination = Join-Path $root 'assets/deck'
New-Item -ItemType Directory -Force $destination | Out-Null
$artworks = @(
  @{ Source = 'ColoredCards/Untitled51_20261026131303.png'; Name = 'the-fool'; Width = 480 },
  @{ Source = 'ColoredCards/Untitled51_20261030155039.png'; Name = 'the-high-priestess'; Width = 480 },
  @{ Source = 'ColoredCards/Untitled51_20261102215546.png'; Name = 'wheel-of-fortune'; Width = 480 },
  @{ Source = 'EmbossedSymbols/The Magician.png'; Name = 'embossed-magician'; Width = 600 },
  @{ Source = 'EmbossedSymbols/The High Priestess.png'; Name = 'embossed-high-priestess'; Width = 600 },
  @{ Source = 'EmbossedSymbols/The Fool.png'; Name = 'embossed-fool'; Width = 320 },
  @{ Source = 'EmbossedSymbols/The Hermit.png'; Name = 'embossed-hermit'; Width = 280 },
  @{ Source = 'EmbossedSymbols/The Wheel of Fortune.png'; Name = 'embossed-wheel'; Width = 400 },
  @{ Source = 'EmbossedSymbols/Temperance.png'; Name = 'embossed-temperance'; Width = 320 },
  @{ Source = 'EmbossedSymbols/The Strength.png'; Name = 'embossed-strength'; Width = 280 },
  @{ Source = 'EmbossedSymbols/The Empress.png'; Name = 'embossed-empress'; Width = 460 },
  @{ Source = 'EmbossedSymbols/The Lovers.png'; Name = 'embossed-lovers'; Width = 360 },
  @{ Source = 'EmbossedSymbols/The Chariot.png'; Name = 'embossed-chariot'; Width = 320 },
  @{ Source = 'EmbossedSymbols/Justice.png'; Name = 'embossed-justice'; Width = 340 }
)
foreach ($artwork in $artworks) {
  if ($Only.Count -gt 0 -and $artwork.Name -notin $Only) { continue }
  $source = Join-Path $root "assets/$($artwork.Source)"
  $output = Join-Path $destination "$($artwork.Name).webp"
  & ffmpeg -y -v error -i $source -vf "scale=$($artwork.Width):-2:flags=lanczos" -c:v libwebp -quality 90 -compression_level 6 $output
  if ($LASTEXITCODE -ne 0) { throw "Could not convert $source" }
  @{
    source = "assets/$($artwork.Source)"
    provenance = 'Client-supplied artwork; resized and WebP-encoded only, with original colors and transparency preserved.'
    build = 'tools/build-deck-assets.ps1'
  } | ConvertTo-Json | Set-Content -Encoding UTF8 "$output.json"
}
