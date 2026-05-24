<#
LOI onboarding harvest script — v0 fuel-logging-mobile for trucks.conso
Date: 2026-05-24
Purpose: use the v0 ZIP already stored in this harvest/raw folder, extract it for CC review, create a harvest branch commit, and push that branch only.
Constraints: no PR, no merge, no deploy, no loi-cockpit mutation, no runtime persona/RBAC mutation.

Before running:
1. Authoritative ZIP source is harvest\raw\fuel-logging-mobile.zip.
2. Downloads is fallback only.
3. This script pushes only branch harvest/v0-fuel-logging-mobile-trucks-conso-20260524.
#>

$ErrorActionPreference = "Stop"
$env:GIT_PAGER = "cat"

# --- Paths ---
$Workspace = "C:\Users\SAMSUNG\OneDrive - Premium Logistics\02_Projects\DASHBOARD COCKPIT PL"
$Repo = Join-Path $Workspace "loi-onboarding"
$ZipFileName = "fuel-logging-mobile.zip"
$DownloadsZipPath = Join-Path $env:USERPROFILE "Downloads\$ZipFileName"
$HarvestName = "2026-05-24_v0_fuel_logging_mobile_trucks_conso"
$HarvestDir = Join-Path $Repo "harvests\$HarvestName"
$RawDir = Join-Path $HarvestDir "raw"
$ExtractDir = Join-Path $RawDir "export"
$ZipPath = Join-Path $RawDir $ZipFileName
$Branch = "harvest/v0-fuel-logging-mobile-trucks-conso-20260524"
$CommitMessage = "harvest(onboarding): add v0 fuel logging mobile prototype"

# --- Preflight checks ---
if (!(Test-Path -LiteralPath $Repo)) {
    throw "loi-onboarding repo not found: $Repo"
}
if (!(Test-Path -LiteralPath (Join-Path $Repo ".git"))) {
    throw "Target is not a Git repository: $Repo"
}

New-Item -ItemType Directory -Force -Path $RawDir | Out-Null
New-Item -ItemType Directory -Force -Path $ExtractDir | Out-Null

if (!(Test-Path -LiteralPath $ZipPath)) {
    if (Test-Path -LiteralPath $DownloadsZipPath) {
        Copy-Item -LiteralPath $DownloadsZipPath -Destination $ZipPath -Force
        Write-Host "[INFO] ZIP copied from Downloads fallback to harvest/raw: $ZipPath"
    } else {
        throw "ZIP not found. Expected authoritative harvest ZIP here: $ZipPath. Fallback also missing: $DownloadsZipPath"
    }
}

Set-Location -LiteralPath $Repo
Write-Host "[INFO] Repository:" (Get-Location)
Write-Host "[INFO] Current Git status before harvest:"
git --no-pager status --short

# --- Create or reuse isolated harvest branch; no PR, no merge, no deploy ---
$ExistingBranch = git branch --list $Branch
if ($ExistingBranch) {
    git switch $Branch
} else {
    git switch -c $Branch
}

# --- Extract readable source snapshot for CC from authoritative harvest ZIP ---
Get-ChildItem -LiteralPath $ExtractDir -Force | Remove-Item -Recurse -Force
Expand-Archive -LiteralPath $ZipPath -DestinationPath $ExtractDir -Force

# --- Harvest README for CC ---
$ReadmePath = Join-Path $HarvestDir "README.md"
@"
# Harvest — v0 fuel-logging-mobile for trucks.conso

[FAIT] This folder is an onboarding harvest for CC review.

[FAIT] Source v0 link: https://v0.app/chat/fuel-logging-mobile-lFHWddMS7Ue

[FAIT] Authoritative ZIP source in this harvest: `raw/fuel-logging-mobile.zip`.

[FAIT] Intended candidate persona approved by Kenny: `trucks-conso-001` / `trucks.conso@premiumlogistics.mg`.

[FAIT] Scope: fuel logging mobile capture flow for the pneus/carburant cockpit.

[FAIT] Guardrail: this harvest does not merge, deploy, mutate loi-cockpit, or activate runtime RBAC.

[À CONFIRMER] CC must validate final component mapping, route, event model, and production integration path before any merge/deploy.
"@ | Set-Content -LiteralPath $ReadmePath -Encoding UTF8

# --- Stage and commit ---
git add -- "harvests/$HarvestName"
Write-Host "[INFO] Git diff staged summary:"
git --no-pager diff --cached --stat

git diff --cached --quiet
if ($LastExitCode -eq 0) {
    Write-Host "[INFO] Nothing to commit. Harvest files already committed or unchanged."
} else {
    git commit -m $CommitMessage
}

# --- Push harvest branch only; no PR, no merge, no deploy ---
git push -u origin $Branch

Write-Host "[DONE] Harvest branch pushed: $Branch"
Write-Host "[INFO] No PR created. No merge performed. No deploy triggered by this script."
Write-Host "[INFO] CC can now review harvests/$HarvestName from the pushed branch."
