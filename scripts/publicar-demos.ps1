# Publica las demos de clientes/ en la rama gh-pages (raíz = un directorio por
# cliente, como espera datos/config.json → publicBase).
#
#   powershell -ExecutionPolicy Bypass -File scripts\publicar-demos.ps1          # prepara el commit en gh-pages, no sube
#   powershell -ExecutionPolicy Bypass -File scripts\publicar-demos.ps1 -Push    # además hace git push origin gh-pages
#
# Trabaja en un worktree temporal para no tocar la rama actual.

param([switch]$Push)

$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $repo
$worktree = Join-Path ([IO.Path]::GetTempPath()) "gramagrowth-gh-pages-$(Get-Date -Format yyyyMMddHHmmss)"

git fetch origin gh-pages --quiet
git worktree add --quiet $worktree origin/gh-pages
try {
  Set-Location $worktree
  git checkout --quiet -B gh-pages origin/gh-pages
  $publicadas = @()
  foreach ($dir in Get-ChildItem (Join-Path $repo 'clientes') -Directory) {
    $destino = Join-Path $worktree $dir.Name
    if (Test-Path $destino) { Remove-Item $destino -Recurse -Force }
    Copy-Item $dir.FullName $destino -Recurse
    $publicadas += $dir.Name
  }
  # La galería de /clientes/ pide la lista a la API local; en Pages no existe.
  # Se deja el index que ya tiene la rama (lo mantiene otro flujo).
  git add -A
  if ((git status --porcelain) -eq $null) {
    Write-Host 'gh-pages ya estaba al día. Nada que publicar.'
  } else {
    git commit --quiet -m "Publica demos: $($publicadas -join ', ')"
    Write-Host "Commit en gh-pages con $($publicadas.Count) demos."
    if ($Push) {
      git push origin gh-pages
      Write-Host 'Publicado. Las URL quedan en <publicBase>/<slug>/ en unos minutos.'
    } else {
      Write-Host 'No se subió. Revisa y corre con -Push para publicar.'
    }
  }
} finally {
  Set-Location $repo
  git worktree remove --force $worktree
}
