# Web playback copy; preserves the original uploaded video.
$ErrorActionPreference = 'Stop'
$taskRoot = Split-Path $PSScriptRoot
ffmpeg -y -v error -i (Join-Path $taskRoot 'assets/Background/The Nyala Website Video.mp4') -map 0:v:0 -an -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -movflags +faststart (Join-Path $taskRoot 'assets/Background/nyala-hero.mp4')
if ($LASTEXITCODE -ne 0) { throw 'Could not build the landing video.' }
