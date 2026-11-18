# Builds the ornamental button frame from the client's sample (Buttons/10.png, 1455x2000, a cream frame with
# "Daily Card" lettered inside), plus a matching fill for behind the label:
#   1. clears the lettering (everything between the frame's inner rules, x 364-1090, y 890-1108, where only the
#      lettering sits) and crops to the frame (1063x296 at 196,852),
#   2. assets/button-frame.webp: that frame scaled to 180px tall, lossless WebP,
#   3. assets/button-fill.webp: the frame's whole shape (its outline with everything inside it, the scrolled ends
#      included) as a solid dark silhouette, the same size, so the fill always lines up with the frame.
# css/style.css stretches both round each button with border-image: the scrolled ends (168px of the source each
# side, 104px after scaling) keep their shape and the middle stretches.
# Usage (from the project folder): powershell -ExecutionPolicy Bypass -File tools\build-frame.ps1
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System; using System.Collections.Generic; using System.Drawing; using System.Drawing.Imaging; using System.Runtime.InteropServices;
public static class FrameFill {
  // grows (or, with grow = false, shrinks) a mask by a disc of radius r
  static bool[] Morph(bool[] m, int W, int H, int r, bool grow) {
    var o = new bool[m.Length]; var disc = new List<int[]>();
    for (int dy = -r; dy <= r; dy++) for (int dx = -r; dx <= r; dx++) if (dx * dx + dy * dy <= r * r) disc.Add(new[] { dx, dy });
    for (int y = 0; y < H; y++) for (int x = 0; x < W; x++) {
      bool v = !grow;
      foreach (var d in disc) { int X = x + d[0], Y = y + d[1]; bool s = X >= 0 && Y >= 0 && X < W && Y < H && m[X + Y * W];
        if (grow && s) { v = true; break; } if (!grow && !s) { v = false; break; } }
      o[x + y * W] = v;
    }
    return o;
  }
  // the frame's silhouette: everything inside its outer outline, the open curls of the scrolled ends included.
  // A point is inside when a stroke lies in each of the eight compass directions from it: the band above and below
  // the rules stays clear, the ends fill right out to their curls and tips, and the small pockets that open
  // outwards between the curls (which a row-and-column test alone would catch) stay clear too.
  public static void Build(string inPath, string outPath, int close, int inset, int R, int G, int B) {
    var bmp = new Bitmap(inPath); int W = bmp.Width, H = bmp.Height;
    var d = bmp.LockBits(new Rectangle(0, 0, W, H), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
    var px = new byte[d.Stride * H]; Marshal.Copy(d.Scan0, px, 0, px.Length); bmp.UnlockBits(d); bmp.Dispose();
    var m = new bool[W * H];
    for (int y = 0; y < H; y++) for (int x = 0; x < W; x++) m[x + y * W] = px[y * d.Stride + x * 4 + 3] > 40;
    m = Morph(Morph(m, W, H, close, true), W, H, close, false);
    var fill = new bool[W * H];
    for (int i = 0; i < fill.Length; i++) fill[i] = true;
    int[][] dirs = { new[] { 1, 0 }, new[] { -1, 0 }, new[] { 0, 1 }, new[] { 0, -1 }, new[] { 1, 1 }, new[] { -1, -1 }, new[] { 1, -1 }, new[] { -1, 1 } };
    foreach (var dir in dirs) { // seen[p] = a stroke at p or anywhere further along -dir, built in one sweep
      int dx = dir[0], dy = dir[1]; var seen = new bool[W * H];
      for (int j = 0; j < H; j++) { int y = dy > 0 ? j : H - 1 - j;
        for (int k = 0; k < W; k++) { int x = dx > 0 ? k : (dx < 0 ? W - 1 - k : k), X = x - dx, Y = y - dy;
          seen[x + y * W] = m[x + y * W] || (X >= 0 && Y >= 0 && X < W && Y < H && seen[X + Y * W]); } }
      for (int i = 0; i < fill.Length; i++) fill[i] = fill[i] && seen[i];
    }
    for (int i = 0; i < fill.Length; i++) fill[i] = fill[i] || m[i];
    if (inset > 0) fill = Morph(fill, W, H, inset, false); // keep the fill's edge just under the frame's strokes
    var o = new Bitmap(W, H, PixelFormat.Format32bppArgb);
    var od = o.LockBits(new Rectangle(0, 0, W, H), ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
    var ob = new byte[od.Stride * H];
    for (int y = 0; y < H; y++) for (int x = 0; x < W; x++) { int k = y * od.Stride + x * 4;
      ob[k] = (byte)B; ob[k + 1] = (byte)G; ob[k + 2] = (byte)R; ob[k + 3] = (byte)(fill[x + y * W] ? 255 : 0); }
    Marshal.Copy(ob, 0, od.Scan0, ob.Length); o.UnlockBits(od); o.Save(outPath, ImageFormat.Png); o.Dispose();
  }
}
'@
$root = Split-Path $PSScriptRoot
$frame = Join-Path $env:TEMP "nyala-button-frame.png"
$fill = Join-Path $env:TEMP "nyala-button-fill.png"
ffmpeg -y -v error -i (Join-Path $root "Buttons\10.png") -vf "drawbox=x=364:y=890:w=727:h=219:color=black@0:t=fill:replace=1,crop=1063:296:196:852" $frame
ffmpeg -y -v error -i $frame -vf "scale=-2:180:flags=lanczos" -c:v libwebp -lossless 1 -compression_level 6 (Join-Path $root "assets\button-frame.webp")
[FrameFill]::Build($frame, $fill, 4, 2, 36, 10, 6)
ffmpeg -y -v error -i $fill -vf "scale=-2:180:flags=lanczos" -c:v libwebp -lossless 1 -compression_level 6 (Join-Path $root "assets\button-fill.webp")
Remove-Item $frame, $fill
