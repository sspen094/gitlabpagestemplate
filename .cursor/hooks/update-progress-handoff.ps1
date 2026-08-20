# Windows wrapper for Cursor stop hook — invokes update_handoff.py from repo venv or PATH.
$ErrorActionPreference = "Stop"
$repoRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$hook = Join-Path $PSScriptRoot "update_handoff.py"
$venvPython = Join-Path $repoRoot ".venv\Scripts\python.exe"

if (Test-Path $venvPython) {
    & $venvPython $hook
    exit $LASTEXITCODE
}

foreach ($cmd in @("python", "python3", "py")) {
    if (Get-Command $cmd -ErrorAction SilentlyContinue) {
        & $cmd $hook
        exit $LASTEXITCODE
    }
}

Write-Error "No Python found for update_handoff.py"
exit 1
