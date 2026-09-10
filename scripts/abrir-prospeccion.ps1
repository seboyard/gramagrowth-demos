$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$targetUrl = 'http://127.0.0.1:4173/prospectar/'

function Test-GramagrowthServer {
  try {
    $response = Invoke-WebRequest -UseBasicParsing -Uri $targetUrl -TimeoutSec 1
    return $response.StatusCode -eq 200
  }
  catch {
    return $false
  }
}

if (-not (Test-GramagrowthServer)) {
  Start-Process -FilePath 'npm.cmd' `
    -ArgumentList @('run', 'serve') `
    -WorkingDirectory $projectRoot `
    -WindowStyle Hidden

  $serverReady = $false
  for ($attempt = 0; $attempt -lt 24; $attempt += 1) {
    Start-Sleep -Milliseconds 250
    if (Test-GramagrowthServer) {
      $serverReady = $true
      break
    }
  }

  if (-not $serverReady) {
    Add-Type -AssemblyName PresentationFramework
    [System.Windows.MessageBox]::Show(
      'No se pudo iniciar Gramagrowth. Confirma que Node.js está instalado e inténtalo nuevamente.',
      'Gramagrowth',
      'OK',
      'Error'
    ) | Out-Null
    exit 1
  }
}

Start-Process -FilePath $targetUrl
