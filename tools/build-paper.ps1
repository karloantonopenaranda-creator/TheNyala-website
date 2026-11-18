# Builds the page backgrounds from assets/Background/12.png (1920x1080 terracotta paper with an
# embossed ornamental frame and a rounded label at the top left):
#   assets/paper-frame.jpg  the whole design, for the home page's first screen; css/style.css draws it with border-image,
#                           so the frame's sides (500px of the source each) keep their shape and only the plain middle stretches
#   assets/paper.jpg        a plain patch of the same paper from inside the frame (860x700 at 540,210), tiled behind
#                           everything else; the paper is lit evenly enough that the tiles meet without a visible seam
# Usage (from the project folder): powershell -ExecutionPolicy Bypass -File tools\build-paper.ps1
param([string]$Source = 'assets/Background/12.png')
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot
$src = Join-Path $root $Source
if (-not (Test-Path -LiteralPath $src -PathType Leaf)) { throw "Background image not found: $src" }
ffmpeg -y -v error -i $src -q:v 3 (Join-Path $root "assets\paper-frame.jpg")
if ($LASTEXITCODE -ne 0) { throw 'Could not build the framed background.' }
ffmpeg -y -v error -i $src -vf "crop=860:700:540:210" -q:v 3 (Join-Path $root "assets\paper.jpg")
if ($LASTEXITCODE -ne 0) { throw 'Could not build the tiled background.' }
foreach ($name in @('paper-frame.jpg', 'paper.jpg')) {
  @{
    source = $Source
    provenance = 'Client-supplied terracotta background; original colors preserved, encoded as JPEG. No AI-generated artwork.'
    transform = $(if ($name -eq 'paper.jpg') { '860x700 crop at x=540, y=210' } else { 'Full 1920x1080 design' })
    build = 'tools/build-paper.ps1'
  } | ConvertTo-Json | Set-Content -Encoding UTF8 (Join-Path $root "assets/$name.json")
}
