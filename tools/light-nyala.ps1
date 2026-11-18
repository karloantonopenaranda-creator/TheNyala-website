# Lights the rebuilt Nyala to sit in the hero forest (assets/forest.jpg), which is backlit by a hazy
# yellow-green glow above and falls to dark green below:
#   1. a slight green ambient cast from the canopy,
#   2. atmospheric haze mixed in, sampled from the forest at each height (bright near her head, dark low down),
#   3. a warm rim light along her inner edge from the backlight, strongest at the top.
# Usage (from the project folder), after tools\rebuild-nyala.ps1:
#   powershell -File tools\light-nyala.ps1
#   ffmpeg -i tools\nyala-lit.png -c:v libwebp -lossless 1 -compression_level 6 assets\nyala-lit.webp
param([string]$In = (Join-Path $PSScriptRoot "nyala-rebuilt.png"),
      [string]$Out = (Join-Path $PSScriptRoot "nyala-lit.png"))
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System; using System.Drawing; using System.Drawing.Imaging; using System.Runtime.InteropServices;
public static class NyalaLight {
  static float[] BoxBlur(float[] a, int W, int H, int r, int passes) {
    float[] src = (float[])a.Clone(), tmp = new float[a.Length];
    for (int p = 0; p < passes; p++) {
      for (int y = 0; y < H; y++) { double s = 0; for (int x = -r; x <= r; x++) s += src[Math.Max(0, Math.Min(W - 1, x)) + y * W];
        for (int x = 0; x < W; x++) { tmp[x + y * W] = (float)(s / (2 * r + 1)); s += src[Math.Min(W - 1, x + r + 1) + y * W] - src[Math.Max(0, x - r) + y * W]; } }
      for (int x = 0; x < W; x++) { double s = 0; for (int y = -r; y <= r; y++) s += tmp[x + Math.Max(0, Math.Min(H - 1, y)) * W];
        for (int y = 0; y < H; y++) { src[x + y * W] = (float)(s / (2 * r + 1)); s += tmp[x + Math.Min(H - 1, y + r + 1) * W] - tmp[x + Math.Max(0, y - r) * W]; } }
    }
    return src;
  }
  static double Lerp(double a, double b, double t) { return a + (b - a) * t; }
  // haze colour and amount down her height (v = 0 at her horns, 1 at her feet), from the forest around her
  static void Haze(double v, out double r, out double g, out double b, out double amt) {
    double[] vs = { 0, .3, .55, .8, 1 };
    double[,] col = { {190,205,140}, {150,190,125}, {50,120,92}, {32,80,55}, {30,64,30} };
    double[] am = { .09, .08, .06, .05, .04 };
    int k = 0; while (k < 3 && v > vs[k + 1]) k++;
    double t = Math.Max(0, Math.Min(1, (v - vs[k]) / (vs[k + 1] - vs[k])));
    r = Lerp(col[k,0], col[k+1,0], t); g = Lerp(col[k,1], col[k+1,1], t); b = Lerp(col[k,2], col[k+1,2], t); amt = Lerp(am[k], am[k+1], t);
  }
  public static string Run(string inPath, string outPath) {
    var img = new Bitmap(inPath); int W = img.Width, H = img.Height;
    var bmp = new Bitmap(W, H, PixelFormat.Format32bppArgb);
    using (var g = Graphics.FromImage(bmp)) g.DrawImage(img, 0, 0, W, H);
    img.Dispose();
    var bd = bmp.LockBits(new Rectangle(0, 0, W, H), ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
    int st = bd.Stride; byte[] px = new byte[st * H]; Marshal.Copy(bd.Scan0, px, 0, px.Length);
    float[] al = new float[W * H];
    for (int y = 0; y < H; y++) for (int x = 0; x < W; x++) al[x + y * W] = px[y * st + x * 4 + 3] / 255f;
    int rr = Math.Max(2, W / 190); // thin rim band, about half a percent of her width
    float[] bl = BoxBlur(al, W, H, rr, 3);
    float[] bn = BoxBlur(al, W, H, rr * 2, 2); // wider blur for the edge direction
    for (int y = 0; y < H; y++) {
      double v = (double)y / (H - 1), hr, hg, hb, amt; Haze(v, out hr, out hg, out hb, out amt);
      double rimW = v < .3 ? 1 : v < .7 ? Lerp(1, .25, (v - .3) / .4) : Lerp(.25, .05, (v - .7) / .3);
      for (int x = 0; x < W; x++) {
        int o = y * st + x * 4; double a = al[x + y * W]; if (a <= 0) continue;
        double b = px[o], g = px[o + 1], r = px[o + 2];
        r *= .93; g *= .95; b *= .86;                                         // light filtered through the canopy
        r = Lerp(r, hr, amt); g = Lerp(g, hg, amt); b = Lerp(b, hb, amt);     // a little atmospheric haze
        // backlit rim: only along her outline, strongest where the edge faces up toward the glow
        int xl = Math.Max(0, x - 1), xr = Math.Min(W - 1, x + 1), yu = Math.Max(0, y - 1), yd = Math.Min(H - 1, y + 1);
        double gx = bn[xr + y * W] - bn[xl + y * W], gy = bn[x + yd * W] - bn[x + yu * W], gl = Math.Sqrt(gx * gx + gy * gy);
        double facing = gl > 1e-4 ? Math.Max(0, Math.Min(1, (gy / gl) * .9 + .3)) : .3; // outward normal is -gradient; up-facing => gy > 0
        double edge = Math.Max(0, Math.Min(1, (1 - bl[x + y * W]) * 2.4)) * facing * rimW * .5;
        r += 255 * edge; g += 222 * edge; b += 140 * edge;                    // warm golden light, added
        px[o] = (byte)Math.Round(Math.Max(0, Math.Min(255, b))); px[o + 1] = (byte)Math.Round(Math.Max(0, Math.Min(255, g))); px[o + 2] = (byte)Math.Round(Math.Max(0, Math.Min(255, r)));
      }
    }
    Marshal.Copy(px, 0, bd.Scan0, px.Length); bmp.UnlockBits(bd);
    bmp.Save(outPath, ImageFormat.Png); bmp.Dispose();
    return String.Format("{0}x{1}, rim radius {2}px", W, H, rr);
  }
}
'@
[NyalaLight]::Run($In, $Out)
