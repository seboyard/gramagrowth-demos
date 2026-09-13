# Instala el perfil, la skill y el cron de prospección de Gramagrowth en Hermes.
# Idempotente: se puede correr de nuevo para actualizar la skill y el SOUL.
#
#   powershell -ExecutionPolicy Bypass -File hermes\instalar.ps1
#   powershell -ExecutionPolicy Bypass -File hermes\instalar.ps1 -ConCron
#
# No envía nada ni cambia el perfil `default`. Lo único que toca fuera del
# perfil `grama` es la lista de jobs del cron, y sólo si se pasa -ConCron.

param([switch]$ConCron)

$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$hermesHome = if ($env:HERMES_HOME) { $env:HERMES_HOME } else { Join-Path $env:LOCALAPPDATA 'hermes' }
$perfil = Join-Path $hermesHome 'profiles\grama'

Write-Host "Repo:        $repo"
Write-Host "HERMES_HOME: $hermesHome"

# 1. Perfil propio, separado del `default` (que tiene otra personalidad).
$perfiles = (& hermes profile list 2>&1) -join "`n"
if ($perfiles -notmatch '\bgrama\b') {
  & hermes profile create grama
} else {
  Write-Host 'Perfil grama ya existe.'
}
New-Item -ItemType Directory -Force (Join-Path $perfil 'skills') | Out-Null

# 2. SOUL.md y skill: se copian desde el repo, que es la fuente de verdad.
Copy-Item (Join-Path $repo 'hermes\profiles\grama\SOUL.md') (Join-Path $perfil 'SOUL.md') -Force
$skillDestino = Join-Path $perfil 'skills\gramagrowth-prospector'
if (Test-Path $skillDestino) { Remove-Item $skillDestino -Recurse -Force }
Copy-Item (Join-Path $repo 'hermes\skills\gramagrowth-prospector') $skillDestino -Recurse
Write-Host 'SOUL.md y skill gramagrowth-prospector instalados en el perfil grama.'

# 3. Cron, sólo si se pide. El prompt del job semanal sale del archivo
#    versionado; el job de sincronización es un script sin LLM.
if ($ConCron) {
  New-Item -ItemType Directory -Force (Join-Path $hermesHome 'scripts') | Out-Null
  Copy-Item (Join-Path $repo 'hermes\scripts\sincronizar_gramagrowth.py') (Join-Path $hermesHome 'scripts\sincronizar_gramagrowth.py') -Force
  $jobsSync = (& hermes -p grama cron list 2>&1) -join "`n"
  if ($jobsSync -notmatch 'grama-sync-hermes') {
    & hermes -p grama cron create '0 */6 * * *' --name grama-sync-hermes --no-agent --script sincronizar_gramagrowth.py --deliver telegram
    Write-Host 'Cron grama-sync-hermes creado (cada 6 horas, sin LLM).'
  }
  $jobs = (& hermes -p grama cron list 2>&1) -join "`n"
  if ($jobs -match 'grama-prospeccion-semanal') {
    Write-Host 'El job grama-prospeccion-semanal ya existe. Bórralo con `hermes -p grama cron remove` si quieres recrearlo.'
  } else {
    $prompt = (Get-Content (Join-Path $repo 'hermes\cron\prospeccion-semanal.md') -Raw) -split '---', 2 | Select-Object -Last 1
    & hermes -p grama cron create '0 7 * * 1' --name grama-prospeccion-semanal --skill gramagrowth-prospector --workdir $repo --deliver telegram $prompt.Trim()
    Write-Host 'Cron creado. Revisa con: hermes -p grama cron list'
  }
}

Write-Host ''
Write-Host 'Prueba manual recomendada antes de activar el cron:'
Write-Host "  cd $repo"
Write-Host '  node scripts/descubrir.mjs --zona Valdivia --rubro gimnasios'
Write-Host '  hermes -p grama chat -Q --skills gramagrowth-prospector -q "Redacta el lote valdivia-gimnasios-<fecha>: los 10 mejores. Termina con promover.mjs --dry-run y reporta."'
