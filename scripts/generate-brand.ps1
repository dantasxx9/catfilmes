Add-Type -AssemblyName System.Drawing
$assetRoot = Join-Path $PSScriptRoot '../assets'
function Write-Mark($name, $size, $transparent, $monochrome) {
  $bitmap = [System.Drawing.Bitmap]::new($size, $size)
  $canvas = [System.Drawing.Graphics]::FromImage($bitmap)
  $canvas.SmoothingMode = 'AntiAlias'
  if ($transparent) { $canvas.Clear([System.Drawing.Color]::Transparent) } else { $canvas.Clear([System.Drawing.ColorTranslator]::FromHtml('#0B1220')) }
  $ink = if ($monochrome) { '#FFFFFF' } else { '#FFBE55' }
  $brush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml($ink))
  $pen = [System.Drawing.Pen]::new($brush, $size * 0.055)
  $canvas.DrawArc($pen, [single]($size*.25), [single]($size*.25), [single]($size*.5), [single]($size*.5), 45, 270)
  $triangle = [System.Drawing.PointF[]]@([System.Drawing.PointF]::new($size*.47,$size*.36),[System.Drawing.PointF]::new($size*.47,$size*.64),[System.Drawing.PointF]::new($size*.67,$size*.5))
  $canvas.FillPolygon($brush,$triangle)
  $bitmap.Save((Join-Path $assetRoot $name),[System.Drawing.Imaging.ImageFormat]::Png)
  $pen.Dispose(); $brush.Dispose(); $canvas.Dispose(); $bitmap.Dispose()
}
Write-Mark 'icon.png' 1024 $false $false
Write-Mark 'android-icon-foreground.png' 1024 $true $false
Write-Mark 'android-icon-monochrome.png' 1024 $true $true
Write-Mark 'splash-icon.png' 512 $true $false
Write-Mark 'favicon.png' 64 $false $false
