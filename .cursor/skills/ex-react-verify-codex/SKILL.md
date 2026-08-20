---
name: ex-react-verify-codex
description: Verification with success criteria plus optional read-only Codex diff review. Use for /v+codex slash command, verification-reports, slice success-criteria, traceability.md closeout, docs/project-files/verification/design-patterns, or when the user asks for Codex second opinion after implementation.
---

# Ex-React verify + Codex skill

Use when the user invokes **`/v+codex`**, the **`/v+codex`** slash command, or asks for **success-criteria verification** with an optional **Codex second opinion**.

Pair with [`ex-react-slice-plan/SKILL.md`](../ex-react-slice-plan/SKILL.md) for task sync and traceability gates.

## Roles

| Phase | Agent | Question |
|-------|-------|----------|
| 1 | **Cursor** | Does the work meet slice + project design-pattern criteria? |
| 2 | **Codex** (CLI, optional) | What bugs, edge cases, style, or architecture issues remain in the diff? |

Codex **never modifies code**. Cursor reads `codex-review.md` and may fix issues in a follow-up turn.

## Criteria sources

| Source | Path |
|--------|------|
| Slice criteria | `docs/requirements/slices/<slice-id>/success-criteria/*.md` |
| Traceability matrix | `docs/requirements/slices/<slice-id>/success-criteria/traceability.md` |
| Project-wide patterns | `docs/project-files/verification/design-patterns/*.md` (exclude README) |
| Fallback | If slice `success-criteria/` empty → design patterns only |

Read `.cursor/active-slice` for `SLICE_ID` when the user does not specify one.

When `tools/ci/resolve_success_criteria.py` exists:

```bash
python tools/ci/resolve_success_criteria.py --slice <SLICE_ID>
python tools/ci/resolve_success_criteria.py --slice <SLICE_ID> --json
```

Checklist ids: **SC-xx** (slice), **DP-xx** (design patterns). Mark **PASS**, **FAIL**, or **N/A** in `cursor-criteria.md`.

### Traceability closeout (required)

After evaluating SC-xx, update `docs/requirements/slices/<slice-id>/success-criteria/traceability.md`:

| Column | Set to |
|--------|--------|
| **Result** | `PASS`, `FAIL`, or `N/A` per row (match `cursor-criteria.md`) |
| **Evidence** | Verification report path, `npm test` command, Playwright spec, or mockup checklist |

Slice cannot close while any traceability row is **FAIL** or still `planned`.

## Phase 1 — Cursor (required)

1. Implement the task (minimal diff).
2. Load criteria files; evaluate each item with linked `verify:` commands.
3. Run `/v` automation — see `.cursor/commands/v.md`:
   - Scoped tests (`npm test`)
   - UI smoke / Playwright when UI changes
4. **If any applicable criterion FAILs** → write report, **skip Codex**, state fixes needed.
5. Create report directory:

   ```text
   docs/project-files/verification-reports/YYYYMMDD-HHMMSS-<slice-id>[-<phase>]/
   ```

6. Write `cursor-criteria.md`, `cursor-evidence.md`, and optional `review-packet.md`.
7. **Update `traceability.md`** Result and Evidence from this evaluation.

## Phase 2 — Codex (criteria PASS only)

Skip Phase 2 when Codex is not configured or any SC-xx/DP-xx applicable item failed.

**Team setup:** `docs/project-files/system/codex-review.md` (if present) — Codex extension + login once. **Repo config:** `.codex/ex-react-review.config.toml` when the project commits one.

When `tools/ci/codex_second_opinion.sh` exists:

```bash
tools/ci/codex_second_opinion.sh --report-dir docs/project-files/verification-reports/<dir>
```

| Flag | Use |
|------|-----|
| `--base main` | branch diff instead of `--uncommitted` |

If `codex` CLI is not found, point the developer to `codex-review.md` — do not skip silently.

Outputs:

- `codex-review.md` — findings (read-only)
- `git-diff-stat.txt` — diff scope

Interpret Codex verdict:

- **REQUEST_CHANGES** when findings include bugs or architecture gaps
- **APPROVE** when no material findings
- Deduplicate issues already caught in phase 1

## Phase 3 — Human artifact

Write **`report.md`** — single summary. Copy structure from `docs/project-files/verification-reports/_example/report.md` when present.

Commit the report folder when closing a **slice phase** or milestone.

## Interpreting Codex output

Group findings in `report.md`:

| Category | Examples |
|----------|----------|
| bug | Logic error, null handling |
| edge-case | Empty input, race, auth gap |
| style | Naming, duplication |
| architecture | Layer violation, business logic in UI |

If Codex and Cursor flagged the same issue, list once and note both sources.

## Environment

| Variable | Purpose |
|----------|---------|
| `CODEX_BIN` | Override CLI path |
| `CODEX_HOME` | Optional `~/.codex` override |

## Related

- `.cursor/commands/vcodex.md` — slash command workflow (when present)
- `.cursor/commands/v.md` — base verification without Codex
- [`ex-react-slice-plan/SKILL.md`](../ex-react-slice-plan/SKILL.md) — task sync + traceability task-sync gate
- `docs/project-files/verification/README.md`
- `docs/project-files/verification-reports/README.md`
- `docs/product-manager-agent/regression-and-closeout.md`
