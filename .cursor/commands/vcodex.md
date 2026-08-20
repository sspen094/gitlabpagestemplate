# Verification + Codex (`/v+codex`)

Extends [`/v`](v.md) with an optional **read-only Codex diff review** after success criteria pass.

## Phase 1 — Cursor (required)

Complete all steps in `v.md`. **Stop before Codex** if any applicable SC-xx/DP-xx fails.

## Phase 2 — Codex (optional)

When Phase 1 passes and Codex CLI is available:

```powershell
# When tools/ci/codex_second_opinion.sh exists:
bash tools/ci/codex_second_opinion.sh --report-dir docs/project-files/verification-reports/<dir>
```

Codex outputs findings only — Cursor applies fixes in a follow-up turn if needed.

## Skill

Full workflow: [`.cursor/skills/ex-react-verify-codex/SKILL.md`](../skills/ex-react-verify-codex/SKILL.md).

Report template: `docs/project-files/verification-reports/_example/`.
