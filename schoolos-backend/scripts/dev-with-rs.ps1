$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Path $PSScriptRoot -Parent
$mongoBin = "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe"
$dataPath = Join-Path $projectRoot ".mongo-rs\data"
$logDir = Join-Path $projectRoot ".mongo-rs\log"
$logPath = Join-Path $logDir "mongod.log"
$mongoUrl = "mongodb://127.0.0.1:27018"

function Resolve-Mongosh {
  $cmd = Get-Command mongosh -ErrorAction SilentlyContinue
  if ($cmd) {
    return $cmd.Source
  }

  $knownPaths = @(
    "C:\Users\$env:USERNAME\AppData\Local\Programs\mongosh\mongosh.exe",
    "C:\Program Files\MongoDB\mongosh\bin\mongosh.exe"
  )

  foreach ($path in $knownPaths) {
    if (Test-Path $path) {
      return $path
    }
  }

  throw "mongosh not found. Install with: winget install --id MongoDB.Shell -e"
}

if (-not (Test-Path $mongoBin)) {
  throw "mongod not found at: $mongoBin"
}

New-Item -ItemType Directory -Force -Path $dataPath | Out-Null
New-Item -ItemType Directory -Force -Path $logDir | Out-Null

$mongoListening = Get-NetTCPConnection -LocalPort 27018 -State Listen -ErrorAction SilentlyContinue
if (-not $mongoListening) {
  Write-Host "Starting MongoDB replica-set instance on port 27018..." -ForegroundColor Cyan
  Start-Process -FilePath $mongoBin -ArgumentList @(
    "--dbpath", $dataPath,
    "--logpath", $logPath,
    "--port", "27018",
    "--bind_ip", "127.0.0.1",
    "--replSet", "rs0"
  ) -WindowStyle Hidden
  Start-Sleep -Seconds 2
}

$mongosh = Resolve-Mongosh

$status = & $mongosh $mongoUrl --quiet --eval "try { rs.status().ok } catch (e) { 0 }"
if ($status -notmatch "1") {
  Write-Host "Initializing replica set rs0..." -ForegroundColor Yellow
  & $mongosh $mongoUrl --quiet --eval "rs.initiate({_id:'rs0',members:[{_id:0,host:'127.0.0.1:27018'}]})" | Out-Null
  Start-Sleep -Seconds 1
}

$finalStatus = (& $mongosh $mongoUrl --quiet --eval "try { rs.status().ok } catch (e) { 0 }").ToString().Trim()
if ($finalStatus -ne "1") {
  throw "Replica set is not healthy. rs.status().ok=$finalStatus"
}

Write-Host "MongoDB replica set is ready (rs0 on 27018)." -ForegroundColor Green
Write-Host "Starting backend dev server..." -ForegroundColor Green

Set-Location $projectRoot
npm run dev
