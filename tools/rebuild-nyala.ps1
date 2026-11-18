# Rebuilds Nyala's flat-colour artwork at high resolution with crisp, smooth region boundaries.
# Each source pixel gets soft membership in a few colour regions (background from alpha; hair, two skin tones,
# heart, star from colour, split between the two nearest region colours to keep anti-aliasing coverage).
# Memberships are upsampled with Catmull-Rom; each high-res sample takes the strongest region, so boundaries
# land on smooth sub-pixel curves. Flat regions get their mean colour; hair keeps its black-to-red gradient
# by interpolating colour from hair pixels only. Supersampled, then box-filtered for anti-aliased edges.
# Usage (from the project folder):
#   powershell -File tools\rebuild-nyala.ps1
#   ffmpeg -i tools\nyala-rebuilt.png -c:v libwebp -lossless 1 -compression_level 6 assets\nyala.webp
# Keep the WebP lossless: lossy WebP stores colour at half resolution and softens the edges between regions.
param([int]$Scale = 12, [int]$Down = 3,
      [string]$In = (Join-Path $PSScriptRoot "..\assets\nyala.png"),
      [string]$Out = (Join-Path $PSScriptRoot "nyala-rebuilt.png"))
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System; using System.Drawing; using System.Drawing.Imaging; using System.Runtime.InteropServices;
public static class NyalaRebuild {
  static void CR(double t, double[] w) { // Catmull-Rom weights for taps -1..2
    double t2 = t * t, t3 = t2 * t;
    w[0] = -0.5 * t3 + t2 - 0.5 * t; w[1] = 1.5 * t3 - 2.5 * t2 + 1; w[2] = -1.5 * t3 + 2 * t2 + 0.5 * t; w[3] = 0.5 * t3 - 0.5 * t2;
  }
  public static string Run(string inPath, string outPath, int S, int down) {
    var srcImg = new Bitmap(inPath); int W = srcImg.Width, H = srcImg.Height;
    var bmp = new Bitmap(W, H, PixelFormat.Format32bppArgb);
    using (var g = Graphics.FromImage(bmp)) g.DrawImage(srcImg, 0, 0, W, H);
    srcImg.Dispose();
    var bd = bmp.LockBits(new Rectangle(0, 0, W, H), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
    int st = bd.Stride; byte[] px = new byte[st * H]; Marshal.Copy(bd.Scan0, px, 0, px.Length); bmp.UnlockBits(bd); bmp.Dispose();

    // region colours: 0 background, 1 hair (two anchor colours), 2 light skin, 3 shaded skin, 4 heart, 5 star
    double[,] C = { {34,33,33}, {56,20,14}, {228,180,145}, {207,148,113}, {240,70,68}, {252,240,100} };
    int[] map = { 1, 1, 2, 3, 4, 5 }; const int K = 6;
    float[] m = new float[K * W * H];
    double[] sr = new double[K], sg = new double[K], sb = new double[K], sn = new double[K];
    float[] hr = new float[W * H], hg = new float[W * H], hb = new float[W * H];
    for (int y = 0; y < H; y++) for (int x = 0; x < W; x++) {
      int o = y * st + x * 4, i = x + y * W; double a = px[o + 3] / 255.0, b = px[o], gg = px[o + 1], r = px[o + 2];
      m[i] = (float)(1 - a);
      hr[i] = (float)r; hg[i] = (float)gg; hb[i] = (float)b;
      if (a <= 0) continue;
      // model the pixel as a blend of two region colours: pick the pair whose blend line passes closest to it
      int bi = 0, bj = 0; double bt = 0, bres = 1e18;
      for (int ci = 0; ci < 6; ci++) for (int cj = ci; cj < 6; cj++) {
        double ex = C[cj,0] - C[ci,0], ey = C[cj,1] - C[ci,1], ez = C[cj,2] - C[ci,2], ll = ex * ex + ey * ey + ez * ez;
        double t = ll > 0 ? ((r - C[ci,0]) * ex + (gg - C[ci,1]) * ey + (b - C[ci,2]) * ez) / ll : 0;
        t = Math.Max(0, Math.Min(1, t));
        double qx = r - C[ci,0] - t * ex, qy = gg - C[ci,1] - t * ey, qz = b - C[ci,2] - t * ez, res = qx * qx + qy * qy + qz * qz;
        if (res < bres - 1e-9) { bres = res; bi = ci; bj = cj; bt = t; }
      }
      int k1 = map[bi], k2 = map[bj];
      m[k1 * W * H + i] += (float)(a * (1 - bt)); m[k2 * W * H + i] += (float)(a * bt);
      int kc = bt < 0.5 ? k1 : k2; double dc = Math.Sqrt(bres) + (bt < 0.5 ? bt : 1 - bt) * 255;
      if (a > 0.98 && dc < 30) { sr[kc] += r; sg[kc] += gg; sb[kc] += b; sn[kc]++; }
    }
    double[,] flat = new double[K, 3];
    for (int k = 1; k < K; k++) { if (sn[k] > 0) { flat[k,0] = sr[k] / sn[k]; flat[k,1] = sg[k] / sn[k]; flat[k,2] = sb[k] / sn[k]; } }

    int Wo = W * S / down, Ho = H * S / down;
    var outBmp = new Bitmap(Wo, Ho, PixelFormat.Format32bppArgb);
    var od = outBmp.LockBits(new Rectangle(0, 0, Wo, Ho), ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
    int ost = od.Stride; byte[] op = new byte[ost * Ho];
    double[] wx = new double[4], wy = new double[4], val = new double[K];
    int N = W * H;
    for (int Y = 0; Y < Ho; Y++) for (int X = 0; X < Wo; X++) {
      double ar = 0, ag = 0, ab = 0, aa = 0;
      for (int sy = 0; sy < down; sy++) for (int sx = 0; sx < down; sx++) {
        double fx = (X * down + sx + 0.5) / S - 0.5, fy = (Y * down + sy + 0.5) / S - 0.5;
        int ix = (int)Math.Floor(fx), iy = (int)Math.Floor(fy);
        CR(fx - ix, wx); CR(fy - iy, wy);
        Array.Clear(val, 0, K);
        for (int j = 0; j < 4; j++) {
          int yy = iy - 1 + j;
          for (int q = 0; q < 4; q++) {
            int xx = ix - 1 + q; double w = wx[q] * wy[j];
            if (xx < 0 || yy < 0 || xx >= W || yy >= H) { val[0] += w; continue; }
            int i = xx + yy * W;
            for (int k = 0; k < K; k++) val[k] += w * m[k * N + i];
          }
        }
        int best = 0; for (int k = 1; k < K; k++) if (val[k] > val[best]) best = k;
        if (best == 0) continue;
        double cr, cg, cb;
        if (best == 1) { // hair: smooth colour from hair pixels only
          double tw = 0; cr = cg = cb = 0;
          for (int j = -1; j <= 2; j++) for (int q = -1; q <= 2; q++) {
            int xx = ix + q, yy = iy + j; if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
            int i = xx + yy * W; double hm = m[N + i]; if (hm < 0.5) continue;
            double dx = fx - xx, dy = fy - yy, w = Math.Exp(-(dx * dx + dy * dy) / 0.8) * hm;
            cr += w * hr[i]; cg += w * hg[i]; cb += w * hb[i]; tw += w;
          }
          if (tw > 0) { cr /= tw; cg /= tw; cb /= tw; } else { cr = flat[1,0]; cg = flat[1,1]; cb = flat[1,2]; }
        } else { cr = flat[best,0]; cg = flat[best,1]; cb = flat[best,2]; }
        ar += cr; ag += cg; ab += cb; aa += 1;
      }
      int oo = Y * ost + X * 4;
      if (aa > 0) {
        op[oo] = (byte)Math.Round(ab / aa); op[oo + 1] = (byte)Math.Round(ag / aa); op[oo + 2] = (byte)Math.Round(ar / aa);
        op[oo + 3] = (byte)Math.Round(255.0 * aa / (down * down));
      }
    }
    Marshal.Copy(op, 0, od.Scan0, op.Length); outBmp.UnlockBits(od);
    outBmp.Save(outPath, ImageFormat.Png); outBmp.Dispose();
    return String.Format("{0}x{1} -> {2}x{3}; hair {4:0},{5:0},{6:0} skin {7:0},{8:0},{9:0} / {10:0},{11:0},{12:0} heart {13:0},{14:0},{15:0} star {16:0},{17:0},{18:0}",
      W, H, Wo, Ho, flat[1,0], flat[1,1], flat[1,2], flat[2,0], flat[2,1], flat[2,2], flat[3,0], flat[3,1], flat[3,2], flat[4,0], flat[4,1], flat[4,2], flat[5,0], flat[5,1], flat[5,2]);
  }
}
'@
$sw = [System.Diagnostics.Stopwatch]::StartNew()
[NyalaRebuild]::Run($In, $Out, $Scale, $Down)
"took {0:0.0}s" -f $sw.Elapsed.TotalSeconds
