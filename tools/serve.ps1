# Serves the TheNyala site at http://localhost:8080/ using Windows' built-in HttpListener (no installs needed).
# Usage (from the project folder):  powershell -NoProfile -ExecutionPolicy Bypass -File tools\serve.ps1 [-Port 8080]
# Stop it with Ctrl+C, or close the window.
#
# Requests are answered side by side (a small pool of workers), and files are streamed from disk rather than read
# whole. A ranged request for the hero video gets at most 2 MB at a time, so the browser asks for the rest as it plays.
# Before this, the server answered one request at a time and sent the whole 38 MB video in one go; while the browser
# slowly took it in, every other file (button frames, scripts) waited, and the server could hang.
param([int]$Port = 8080, [int]$Workers = 8)
$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "TheNyala is running at http://localhost:$Port/  (Ctrl+C to stop)"

$handle = {
  param($ctx, $root)
  $types = @{
    '.html' = 'text/html; charset=utf-8'; '.css' = 'text/css; charset=utf-8'; '.js' = 'text/javascript; charset=utf-8'
    '.json' = 'application/json'; '.md' = 'text/markdown; charset=utf-8'; '.svg' = 'image/svg+xml'
    '.png' = 'image/png'; '.jpg' = 'image/jpeg'; '.jpeg' = 'image/jpeg'; '.webp' = 'image/webp'; '.ico' = 'image/x-icon'
    '.ttf' = 'font/ttf'; '.otf' = 'font/otf'; '.woff' = 'font/woff'; '.woff2' = 'font/woff2'
    '.mp4' = 'video/mp4'; '.webm' = 'video/webm'
  }
  $maxRange = 2MB
  $req = $ctx.Request; $res = $ctx.Response; $file = $null
  try {
    $rel = [Uri]::UnescapeDataString($req.Url.AbsolutePath.TrimStart('/'))
    if ($rel -eq '' -or $rel.EndsWith('/')) { $rel += 'index.html' }
    $path = [System.IO.Path]::GetFullPath((Join-Path $root $rel))
    if (-not $path.StartsWith($root, [StringComparison]::OrdinalIgnoreCase) -or -not (Test-Path -LiteralPath $path -PathType Leaf)) {
      $bytes = [System.Text.Encoding]::UTF8.GetBytes("Not found: /$rel")
      $res.StatusCode = 404; $res.ContentLength64 = $bytes.Length
      if ($req.HttpMethod -ne 'HEAD') { $res.OutputStream.Write($bytes, 0, $bytes.Length) }
      return
    }
    $ext = [System.IO.Path]::GetExtension($path).ToLower()
    $res.ContentType = $(if ($types.ContainsKey($ext)) { $types[$ext] } else { 'application/octet-stream' })
    $res.Headers['Cache-Control'] = 'no-cache'
    $res.Headers['Accept-Ranges'] = 'bytes'
    $file = [System.IO.File]::Open($path, 'Open', 'Read', 'ReadWrite')
    $length = $file.Length; $start = 0; $count = $length
    if ($req.Headers['Range'] -match '^bytes=(\d+)-(\d*)$') {
      $start = [long]$Matches[1]
      $end = $(if ($Matches[2]) { [Math]::Min([long]$Matches[2], $length - 1) } else { $length - 1 })
      $end = [Math]::Min($end, $start + $maxRange - 1)
      if ($start -gt $end) {
        $res.StatusCode = 416; $res.Headers['Content-Range'] = "bytes */$length"; $count = 0
      } else {
        $res.StatusCode = 206; $count = $end - $start + 1
        $res.Headers['Content-Range'] = "bytes $start-$end/$length"
      }
    }
    $res.ContentLength64 = $count
    if ($req.HttpMethod -ne 'HEAD' -and $count -gt 0) {
      [void]$file.Seek($start, 'Begin')
      $buffer = New-Object byte[] 65536; $left = $count
      while ($left -gt 0) {
        $n = $file.Read($buffer, 0, [int][Math]::Min($buffer.Length, $left))
        if ($n -le 0) { break }
        $res.OutputStream.Write($buffer, 0, $n); $left -= $n
      }
    }
  } catch {
    try { $res.StatusCode = 500 } catch {}
  } finally {
    if ($file) { $file.Dispose() }
    try { $res.OutputStream.Close() } catch {}
  }
}

$pool = [RunspaceFactory]::CreateRunspacePool(1, $Workers); $pool.Open()
$jobs = New-Object System.Collections.ArrayList
try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    Write-Host ("{0} /{1}" -f $ctx.Request.HttpMethod, $ctx.Request.Url.AbsolutePath.TrimStart('/'))
    $ps = [PowerShell]::Create(); $ps.RunspacePool = $pool
    [void]$ps.AddScript($handle).AddArgument($ctx).AddArgument($root)
    [void]$jobs.Add([pscustomobject]@{ PS = $ps; Handle = $ps.BeginInvoke() })
    foreach ($job in @($jobs | Where-Object { $_.Handle.IsCompleted })) {
      try { [void]$job.PS.EndInvoke($job.Handle) } catch {}
      $job.PS.Dispose(); $jobs.Remove($job)
    }
  }
} finally { $listener.Stop(); $pool.Close() }
