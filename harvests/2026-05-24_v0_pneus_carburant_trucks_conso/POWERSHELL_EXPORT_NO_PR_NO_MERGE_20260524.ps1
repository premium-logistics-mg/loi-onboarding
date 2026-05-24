<#
LOI onboarding harvest script — v0 pneus/carburant for trucks.conso
Date: 2026-05-24
Purpose: use the v0 ZIP already stored in this harvest/raw folder, extract it for CC review, and create a local Git commit.
Constraints: no PR, no merge, no loi-cockpit mutation, no runtime persona/RBAC mutation.

Before running:
1. Authoritative ZIP source is harvest\raw\dashboard-pneus-carburant(2).zip. Downloads is fallback only.
2. Confirm the loi-onboarding repo path.
3. Review git status before committing.
#>

$ErrorActionPreference = "Stop"

# --- Paths ---
$Workspace = "C:\Users\SAMSUNG\OneDrive - Premium Logistics\02_Projects\DASHBOARD COCKPIT PL"
$Repo = Join-Path $Workspace "loi-onboarding"
$ZipFileName = "dashboard-pneus-carburant(2).zip"
$DownloadsZipPath = Join-Path $env:USERPROFILE "Downloads\$ZipFileName"
$HarvestName = "2026-05-24_v0_pneus_carburant_trucks_conso"
$HarvestDir = Join-Path $Repo "harvests\$HarvestName"
$RawDir = Join-Path $HarvestDir "raw"
$ExtractDir = Join-Path $RawDir "export"
$ZipPath = Join-Path $RawDir $ZipFileName

# --- Preflight checks ---
if (!(Test-Path -LiteralPath $Repo)) {
    throw "loi-onboarding repo not found: $Repo"
}
if (!(Test-Path -LiteralPath (Join-Path $Repo ".git"))) {
    throw "Target is not a Git repository: $Repo"
}
if (!(Test-Path -LiteralPath $ZipPath)) {
    if (Test-Path -LiteralPath $DownloadsZipPath) {
        New-Item -ItemType Directory -Force -Path $RawDir | Out-Null
        Copy-Item -LiteralPath $DownloadsZipPath -Destination $ZipPath -Force
        Write-Host "[INFO] ZIP copied from Downloads fallback to harvest/raw: $ZipPath"
    } else {
        throw "ZIP not found. Expected authoritative harvest ZIP here: $ZipPath. Fallback also missing: $DownloadsZipPath"
    }
}

Set-Location -LiteralPath $Repo
Write-Host "[INFO] Repository:" (Get-Location)
Write-Host "[INFO] Current Git status before harvest:"
git status --short

# --- Create isolated harvest branch; no PR and no merge are performed by this script ---
$Branch = "harvest/v0-pneus-carburant-trucks-conso-20260524"
$ExistingBranch = git branch --list $Branch
if ($ExistingBranch) {
    git switch $Branch
} else {
    git switch -c $Branch
}

# --- Create harvest folder ---
New-Item -ItemType Directory -Force -Path $RawDir | Out-Null
New-Item -ItemType Directory -Force -Path $ExtractDir | Out-Null

# --- Extract a readable source snapshot for CC from the authoritative harvest ZIP ---
$ZipDest = $ZipPath

# Clean previous extracted snapshot if rerunning.
Get-ChildItem -LiteralPath $ExtractDir -Force | Remove-Item -Recurse -Force
Expand-Archive -LiteralPath $ZipDest -DestinationPath $ExtractDir -Force

# --- Create minimal harvest README if not already created by Manus ---
$ReadmePath = Join-Path $HarvestDir "README.md"
if (!(Test-Path -LiteralPath $ReadmePath)) {
@"
# Harvest — v0 pneus/carburant for trucks.conso

[FAIT] This folder is an onboarding harvest for CC review. It is not a production merge into loi-cockpit.

[FAIT] Candidate email: `trucks.conso@premiumlogistics.mg`.

[HYPOTHÈSE] Candidate PersonaId: `trucks-conso-001`, under `meca-001` Maintenance Manager.

[À CONFIRMER] Kenny/CC must validate persona ID, RBAC, and event model before runtime integration.
"@ | Set-Content -LiteralPath $ReadmePath -Encoding UTF8
}

# --- Stage and commit locally ---
git add -- "harvests/$HarvestName"
Write-Host "[INFO] Git diff staged summary:"
git diff --cached --stat

$CommitMessage = "harvest(onboarding): add v0 pneus carburant trucks conso prototype"
$HasStagedChanges = git diff --cached --quiet; $LastExitCode
if ($LastExitCode -eq 0) {
    Write-Host "[INFO] Nothing to commit. Harvest files already staged/committed or unchanged."
} else {
    git commit -m $CommitMessage
}

Write-Host "[DONE] Harvest prepared locally on branch: $Branch"
Write-Host "[INFO] No PR created. No merge performed. No loi-cockpit runtime file modified."
Write-Host "[OPTIONAL] If you only want to push the harvest branch without PR, run: git push -u origin $Branch"
