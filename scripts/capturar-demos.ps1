# Genera la captura móvil de cada demo para la portada de /presentacion/.
# Usa Edge en modo headless contra el servidor local (npm run serve).
#
#   powershell -ExecutionPolicy Bypass -File scripts\capturar-demos.ps1            # sólo las que faltan
#   powershell -ExecutionPolicy Bypass -File scripts\capturar-demos.ps1 -Todas     # rehace todas
#   powershell -ExecutionPolicy Bypass -File scripts\capturar-demos.ps1 valdilum   # una en particular

param([switch]$Todas, [string]$Solo)

$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$edge = @("$env:ProgramFiles (x86)\Microsoft\Edge\Application\msedge.exe", "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $edge) { throw 'No se encontró Microsoft Edge.' }
$base = if ($env:GRAMAGROWTH_PORT) { "http://127.0.0.1:$env:GRAMAGROWTH_PORT" } else { 'http://127.0.0.1:4173' }
try { Invoke-WebRequest -Uri "$base/clientes/" -UseBasicParsing -TimeoutSec 5 | Out-Null } catch { throw "El servidor local no responde en $base. Corre npm run serve." }

$capturas = Join-Path $repo 'presentacion\capturas'
New-Item -ItemType Directory -Force $capturas | Out-Null

$demos = Get-ChildItem (Join-Path $repo 'clientes') -Directory | Select-Object -ExpandProperty Name
if ($Solo) { $demos = $demos | Where-Object { $_ -eq $Solo } }

foreach ($slug in $demos) {
  $salida = Join-Path $capturas "$slug.png"
  if ((Test-Path $salida) -and -not $Todas -and -not $Solo) { continue }
  Write-Host "Capturando $slug…"
  # 780x2600 es el tamaño de las capturas existentes: ancho de celular, alto
  # suficiente para portada + cotizador. El aviso de muestra sale en la captura,
  # que es lo honesto.
  # Edge escribe avisos internos por stderr aunque todo salga bien; no son error.
  $previo = $ErrorActionPreference
  $ErrorActionPreference = 'SilentlyContinue'
  & $edge --headless=new --disable-gpu --hide-scrollbars --window-size=780,2600 --screenshot="$salida" "$base/clientes/$slug/" 2>&1 | Out-Null
  $ErrorActionPreference = $previo
  Start-Sleep -Milliseconds 500
  if (-not (Test-Path $salida)) { Write-Warning "No se generó $salida" }
}
Write-Host 'Listo. Las capturas se usan en /presentacion/?id=<prospecto>.'
