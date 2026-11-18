# Derive vector masks from the supplied border's enclosed silhouette.
# Original PNGs are read only. Three SVG viewBoxes match CSS border-image slices.
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
using System.Text;
public static class IntakeMask {
  public static string Build(string source) {
    using (var bitmap = new Bitmap(source)) {
      int w = bitmap.Width, h = bitmap.Height;
      if(w!=1455 || h!=2000) throw new Exception("Update the SVG viewBoxes and CSS slices for this border's dimensions.");
      var data = bitmap.LockBits(new Rectangle(0,0,w,h), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
      var pixels = new byte[data.Stride*h];
      Marshal.Copy(data.Scan0,pixels,0,pixels.Length);
      bitmap.UnlockBits(data);
      var ink = new bool[w*h];
      for(int y=0;y<h;y++) for(int x=0;x<w;x++) ink[y*w+x]=pixels[y*data.Stride+x*4+3]>48;
      // Bridge tiny antialiasing gaps before finding the transparent exterior.
      var wall = new bool[w*h];
      for(int y=0;y<h;y++) for(int x=0;x<w;x++) if(ink[y*w+x])
        for(int dy=-2;dy<=2;dy++) for(int dx=-2;dx<=2;dx++) {
          int xx=x+dx, yy=y+dy;
          if(xx>=0 && xx<w && yy>=0 && yy<h) wall[yy*w+xx]=true;
        }
      var outside = new bool[w*h]; var queue = new int[w*h]; int head=0,tail=0;
      for(int y=0;y<h;y++) for(int x=0;x<w;x++) if(x==0||y==0||x==w-1||y==h-1) {
        int p=y*w+x; if(!wall[p]&&!outside[p]) { outside[p]=true; queue[tail++]=p; }
      }
      while(head<tail) {
        int p=queue[head++], x=p%w,y=p/w;
        int[] neighbors={x>0?p-1:-1,x<w-1?p+1:-1,y>0?p-w:-1,y<h-1?p+w:-1};
        foreach(int n in neighbors) if(n>=0&&!wall[n]&&!outside[n]) { outside[n]=true;queue[tail++]=n; }
      }
      if(outside[(h/2)*w+w/2]) throw new Exception("Border has an open contour: center is outside.");
      // Return to the original stroke edge after the temporary gap bridging.
      var fill=new bool[w*h];
      for(int y=2;y<h-2;y++) for(int x=2;x<w-2;x++) {
        bool inside=true;
        for(int dy=-2;dy<=2&&inside;dy++) for(int dx=-2;dx<=2;dx++)
          if(outside[(y+dy)*w+x+dx]) { inside=false;break; }
        fill[y*w+x]=inside||ink[y*w+x];
      }
      // Scanline runs describe a vector silhouette, not an altered bitmap.
      var path=new StringBuilder();
      for(int y=0;y<h;y++) {
        int x=0;
        while(x<w) {
          while(x<w&&!fill[y*w+x]) x++;
          int start=x;
          while(x<w&&fill[y*w+x]) x++;
          if(x>start) path.Append("M").Append(start).Append(' ').Append(y).Append('h').Append(x-start).Append("v1H").Append(start).Append('z');
        }
      }
      return path.ToString();
    }
  }
}
'@
$taskRoot = Split-Path $PSScriptRoot
$taskSource = Join-Path $taskRoot 'assets/Intake Form/Border For Intake.png'
$taskPathData = [IntakeMask]::Build($taskSource)
$taskSlices = @(
  @{ Name = 'top'; Y = 0; Height = 600 },
  @{ Name = 'middle'; Y = 600; Height = 800 },
  @{ Name = 'bottom'; Y = 1400; Height = 600 }
)
foreach ($taskSlice in $taskSlices) {
  $taskSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 ' + $taskSlice.Y + ' 1455 ' + $taskSlice.Height + '" preserveAspectRatio="none"><path fill="white" d="' + $taskPathData + '"/></svg>'
  $taskOutput = Join-Path $taskRoot ('assets/Intake Form/mask-' + $taskSlice.Name + '.svg')
  [IO.File]::WriteAllText($taskOutput, $taskSvg, [Text.UTF8Encoding]::new($false))
}
Write-Output 'Created three vector masks from the original intake border.'
