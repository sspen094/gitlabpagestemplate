# Verification (Ex-React)

Human and agent **acceptance criteria** and **verification artifacts** — separate from executable tests under `tests/`.

| Path | Role |
|------|------|
| [`design-patterns/`](design-patterns/) | Project-wide checklist criteria (`DP-xx`) for `/v` and optional `/v+codex` |
| [`../verification-reports/`](../verification-reports/) | Post-run reports (evidence, optional Codex review) |

## Slice criteria

Per slice: `docs/requirements/slices/<slice-id>/success-criteria/` (`SC-xx` checklists).

**Traceability:** `success-criteria/traceability.md` — AC → SC-xx → verify → PASS/FAIL. Cursor creates at task sync; updates at closeout. Template: `docs/product-manager-agent/templates/success-criteria/traceability.md`.

## Executable tests

Regression tests live under **`tests/`** — see `tests/SCAFFOLD.md` and `docs/project-files/regression/regression-plan.md`.

**Do not** put verification checklists in `tests/` — they are not test modules.

## Related

- Slice-plan skill — sync tasks, traceability, closeout
- Verify-codex skill (optional `/v+codex`) — SC-xx PASS/FAIL + traceability Evidence update
