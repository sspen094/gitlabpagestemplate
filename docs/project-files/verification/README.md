# Verification (Ex-React)

Human **acceptance criteria** and **verification artifacts** — separate from executable tests under `tests/`.

| Path | Role |
|------|------|
| [`design-patterns/`](design-patterns/) | Project-wide checklist criteria (`DP-xx`) |
| [`../verification-reports/`](../verification-reports/) | Post-run reports |
| Latest Slice 00 | [20260820-153300-00-app-scaffold-and-deploy](../verification-reports/20260820-153300-00-app-scaffold-and-deploy/) |
| Latest Slice 01 | [20260820-181200-01-text-management](../verification-reports/20260820-181200-01-text-management/) |
| Latest Slice 06 | [20260821-160000-06-demo-site-and-docs](../verification-reports/20260821-160000-06-demo-site-and-docs/) |

## Slice criteria

Per slice: `docs/requirements/slices/<slice-id>/success-criteria/` (`SC-xx` checklists).

**Traceability:** `success-criteria/traceability.md` — AC → SC-xx → verify → PASS/FAIL.

## Executable tests

Regression tests live under **`tests/`** — see `tests/SCAFFOLD.md` and `docs/project-files/regression/regression-plan.md`.

**Do not** put verification checklists in `tests/` — they are not test modules.
