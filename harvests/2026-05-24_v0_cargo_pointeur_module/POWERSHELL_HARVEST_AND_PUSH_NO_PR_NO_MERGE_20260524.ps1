<#
LOI onboarding harvest script — v0 cargo-pointeur-module for mine loading and delivery checkpoints
Date: 2026-05-24
Purpose: use the v0 ZIP already stored in this harvest/raw folder, extract it for CC review, create a harvest branch commit, and push that branch only.
Constraints: no PR, no merge, no deploy, no loi-cockpit mutation, no runtime persona/RBAC mutation.

Execution model:
1. The authoritative ZIP source remains harvests\2026-05-24_v0_cargo_pointeur_module\raw\cargo-pointeur-module.zip.
2. Downloads is not used as a source.
3. To avoid OneDrive branch-switch locks in the working repository, this script commits and pushes from a temporary clone.
4. This script pushes only branch harvest/v0-cargo-pointeur-module-20260524.
#>

$ErrorActionPreference = "Stop"
$env:GIT_PAGER = "cat"

# --- Paths ---
$Workspace = "C:\Users\SAMSUNG\OneDrive - Premium Logistics\02_Projects\DASHBOARD COCKPIT PL"
$SourceRepo = Join-Path $Workspace "loi-onboarding"
$ZipFileName = "cargo-pointeur-module.zip"
$HarvestName = "2026-05-24_v0_cargo_pointeur_module"
$SourceHarvestDir = Join-Path $SourceRepo "harvests\$HarvestName"
$SourceRawDir = Join-Path $SourceHarvestDir "raw"
$SourceZipPath = Join-Path $SourceRawDir $ZipFileName
$Branch = "harvest/v0-cargo-pointeur-module-20260524"
$CommitMessage = "harvest(onboarding): add v0 cargo pointeur module prototype"
$TempRoot = Join-Path $env:TEMP "loi-onboarding-cargo-pointeur-module-harvest"
$TempRepo = Join-Path $TempRoot "loi-onboarding"

function Invoke-Git {
    & git -c gc.auto=0 -c maintenance.auto=false @Args
}

# --- Preflight checks ---
if (!(Test-Path -LiteralPath $SourceRepo)) {
    throw "loi-onboarding repo not found: $SourceRepo"
}
if (!(Test-Path -LiteralPath (Join-Path $SourceRepo ".git"))) {
    throw "Source is not a Git repository: $SourceRepo"
}
if (!(Test-Path -LiteralPath $SourceRawDir)) {
    throw "Raw harvest folder not found: $SourceRawDir"
}
if (!(Test-Path -LiteralPath $SourceZipPath)) {
    throw "ZIP not found. Expected authoritative harvest ZIP here only: $SourceZipPath"
}

$OriginUrl = Invoke-Git -C $SourceRepo config --get remote.origin.url
if (!$OriginUrl) {
    throw "Could not read origin URL from source repo: $SourceRepo"
}

Write-Host "[INFO] Source repository:" $SourceRepo
Write-Host "[INFO] Authoritative ZIP:" $SourceZipPath
Write-Host "[INFO] Temporary clone:" $TempRepo
Write-Host "[INFO] Target branch:" $Branch

# --- Create a clean temporary clone to avoid switching branches inside OneDrive working tree ---
if (Test-Path -LiteralPath $TempRoot) {
    Remove-Item -LiteralPath $TempRoot -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $TempRoot | Out-Null

Invoke-Git clone $OriginUrl $TempRepo
Set-Location -LiteralPath $TempRepo
Invoke-Git fetch origin

$RemoteBranchExists = Invoke-Git ls-remote --heads origin $Branch
if ($RemoteBranchExists) {
    Write-Host "[INFO] Remote harvest branch already exists; checking it out for update."
    Invoke-Git switch -c $Branch --track "origin/$Branch"
} else {
    Invoke-Git rev-parse --verify --quiet "origin/main" | Out-Null
    if ($LastExitCode -eq 0) {
        $BaseRef = "origin/main"
    } else {
        Invoke-Git rev-parse --verify --quiet "origin/master" | Out-Null
        if ($LastExitCode -eq 0) {
            $BaseRef = "origin/master"
        } else {
            $BaseRef = "HEAD"
        }
    }
    Write-Host "[INFO] Creating isolated harvest branch from base:" $BaseRef
    Invoke-Git switch -c $Branch $BaseRef
}

# --- Copy the source harvest folder into the temporary clone ---
$TempHarvestParent = Join-Path $TempRepo "harvests"
$TempHarvestDir = Join-Path $TempHarvestParent $HarvestName
$TempRawDir = Join-Path $TempHarvestDir "raw"
$TempExtractDir = Join-Path $TempRawDir "export"
$TempZipPath = Join-Path $TempRawDir $ZipFileName

New-Item -ItemType Directory -Force -Path $TempHarvestParent | Out-Null
if (Test-Path -LiteralPath $TempHarvestDir) {
    Remove-Item -LiteralPath $TempHarvestDir -Recurse -Force
}
Copy-Item -LiteralPath $SourceHarvestDir -Destination $TempHarvestParent -Recurse -Force

if (!(Test-Path -LiteralPath $TempZipPath)) {
    throw "ZIP copy failed. Expected in temp clone: $TempZipPath"
}

# --- Extract readable source snapshot for CC from authoritative harvest ZIP ---
New-Item -ItemType Directory -Force -Path $TempExtractDir | Out-Null
Get-ChildItem -LiteralPath $TempExtractDir -Force | Remove-Item -Recurse -Force
Expand-Archive -LiteralPath $TempZipPath -DestinationPath $TempExtractDir -Force

# --- Harvest README for CC ---
$ReadmePath = Join-Path $TempHarvestDir "README.md"
@"
# Harvest — v0 cargo-pointeur-module for mine loading and delivery checkpoints

[FAIT] This folder is an onboarding harvest for CC review.

[FAIT] Source v0 link: https://v0.app/chat/cargo-pointeur-module-oFhBrBt7UQ8

[FAIT] Authoritative ZIP source in this harvest: `raw/cargo-pointeur-module.zip`.

[FAIT] Scope requested by Kenny: Cargo Pointeur mobile module for mine loading site and delivery site checkpoints to feed the Exploitation Manager.

[FAIT] Intended workflow coverage: mission queue, mine loading confirmation, delivery/unloading confirmation, anomaly report, mission timeline, and Exploitation Manager feed preview.

[FAIT] Guardrail: this harvest does not merge, deploy, mutate loi-cockpit, or activate runtime RBAC/personas.

[À CONFIRMER] CC must validate final route, component mapping, field event schema, offline sync assumptions, actor identity, and production integration path before any merge/deploy.

[À CONFIRMER] Kenny must validate whether Cargo Pointeur is one role covering both mine loading and delivery sites, or two separate field roles.
"@ | Set-Content -LiteralPath $ReadmePath -Encoding UTF8

# Keep source working folder readable too, without changing branches.
Copy-Item -LiteralPath $ReadmePath -Destination (Join-Path $SourceHarvestDir "README.md") -Force

# --- Stage and commit in temporary clone ---
Invoke-Git add -- "harvests/$HarvestName"
Write-Host "[INFO] Git diff staged summary:"
Invoke-Git --no-pager diff --cached --stat

Invoke-Git diff --cached --quiet
if ($LastExitCode -eq 0) {
    Write-Host "[INFO] Nothing to commit. Harvest files already committed or unchanged."
} else {
    Invoke-Git commit -m $CommitMessage
}

# --- Push harvest branch only; no PR, no merge, no deploy ---
Invoke-Git push -u origin $Branch

Write-Host "[DONE] Harvest branch pushed: $Branch"
Write-Host "[INFO] No PR created. No merge performed. No deploy triggered by this script."
Write-Host "[INFO] CC can now review harvests/$HarvestName from the pushed branch."
Write-Host "[INFO] Temporary clone used for push:" $TempRepo
