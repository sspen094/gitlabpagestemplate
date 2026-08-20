# Traceability — Slice NN-kebab-name

**Authority:** Cursor creates and maintains this file at **task-sync review** when syncing `docs/project-files/project-plan/slices/NN-kebab-name-tasks.md`. The PM agent drafts numbered acceptance criteria and **SC-xx** in `success-criteria/` — do **not** create this file at requirements time.

**Chain:** Requirements AC → SC-xx → verify method → PASS | FAIL | N/A → evidence

**Last updated:** YYYY-MM-DD _(task sync or closeout)_

| AC | Requirement (short) | SC-xx | Phase | Verify (planned) | Result | Evidence |
|----|---------------------|-------|-------|------------------|--------|----------|
| 1 | _One-line summary from requirements_ | SC-01 | 1 | _pytest path, flow script, UI smoke, mockup checklist, or schema script_ | planned | — |
| 2 | _…_ | SC-02 | 2 | _…_ | planned | — |

## Result values

| Value | Meaning |
|-------|---------|
| `planned` | Row complete at task sync; verification not yet run |
| `PASS` | SC-xx satisfied; `verify:` commands ran green; evidence linked |
| `FAIL` | Criterion not met — fix and re-verify before slice close |
| `N/A` | Not applicable — document rationale in a **Note** or approved deviation |

## Task-sync gate (before build)

Cursor must not start implementation until:

- Every numbered **acceptance criterion** in requirements appears in at least one row.
- Every **SC-xx** in `success-criteria/` appears in at least one row.
- Every row has a non-empty **Verify (planned)** column (or explicit `manual:` + checklist path).
- `*-tasks.md` includes an **Acceptance criteria map** table mirroring AC → SC-xx → phase.

## Closeout gate

Update **Result** and **Evidence** from project verification workflow (`cursor-criteria.md` or equivalent). Link the verification report folder when the project uses one.

Slice **cannot** close until every row is **PASS** or **N/A** (with rationale).
