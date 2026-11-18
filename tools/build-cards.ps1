# Builds the web versions of the client's service cards (ServicesCards/6-8.png, 2000x2500) for the Readings and
# Offerings section. The lace border is left out (client decision, 2026-11-17): each card is cropped to its plain cream
# panel, which sits at the same place on all three (x 366-1633, y 270-2229; this crop keeps 16px inside that, so no lace
# remains), scaled to 900px wide and saved as WebP. Its corners are rounded in css/style.css.
# Usage (from the project folder): powershell -ExecutionPolicy Bypass -File tools\build-cards.ps1
$cards = @{ "6" = "tarot"; "7" = "chart"; "8" = "combo" }
$root = Split-Path $PSScriptRoot
New-Item -ItemType Directory -Force (Join-Path $root "assets\cards") | Out-Null
foreach ($n in $cards.Keys) {
  $in = Join-Path $root "ServicesCards\$n.png"
  $out = Join-Path $root "assets\cards\$($cards[$n]).webp"
  ffmpeg -y -v error -i $in -vf "crop=1236:1928:382:286,scale=900:-2:flags=lanczos" -c:v libwebp -quality 90 -compression_level 6 $out
}
