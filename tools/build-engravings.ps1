# Cuts the engraving (caterpillar, chrysalis, butterfly) out of each of the client's service cards (ServicesCards/6-8.png,
# 2000x2500) for the pricing columns in Readings and Offerings. Each crop is turned into a transparent image in the
# cards' own ink: the cream paper (green channel 228) becomes fully clear and the ink (#6e1f12, green 31) fully solid,
# with everything between kept as soft partial ink, so the engraving sits cleanly on any paper. Saved as lossless WebP with alpha.
# Usage (from the project folder): powershell -ExecutionPolicy Bypass -File tools\build-engravings.ps1
$root = Split-Path $PSScriptRoot
$out = Join-Path $root "assets\engravings"
New-Item -ItemType Directory -Force $out | Out-Null
$cuts = @(
  @{ src = "6"; name = "caterpillar"; crop = "640:260:680:440";  scale = "480:-2" },
  @{ src = "7"; name = "chrysalis";   crop = "420:600:790:545";  scale = "-2:320" },
  @{ src = "8"; name = "butterfly";   crop = "1080:650:460:490"; scale = "520:-2" }
)
$ink = "r=110:g=31:b=18:a='clip((228-g(X,Y))*1.294,0,255)'"
foreach ($c in $cuts) {
  $in = Join-Path $root "ServicesCards\$($c.src).png"
  $dest = Join-Path $out "$($c.name).webp"
  ffmpeg -y -v error -i $in -vf "crop=$($c.crop),format=rgba,geq=$ink,scale=$($c.scale):flags=lanczos" -c:v libwebp -lossless 1 -compression_level 6 $dest
}
