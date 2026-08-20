# Tests — scaffold checklist

Master checklist for the layered test tree. Update when a folder moves from **Planned** to **Populated**.

**Verification checklists** (SC-xx / DP-xx) live under `docs/project-files/verification/` — not here.

## Status legend

| Status | Meaning |
|--------|---------|
| **Populated** | Has tests or scripts today |
| **Planned** | Folder + README stub only |
| **Legacy** | Superseded — do not add new tests |
| **Shim** | Delegates to canonical path |

## Root

| Path | Status | Notes |
|------|--------|-------|
| `tests/README.md` | Planned | Layout and run commands |
| `tests/SCAFFOLD.md` | Planned | This file |
| `tests/unit/` | Planned | Component / unit tests (`npm test`) |
| `tests/end_to_end/smoke/` | Planned | Playwright UI smoke |
| `tests/validation/` | Shim | **Do not add new tests here** |

## Layers

| Path | Purpose |
|------|---------|
| `unit/` | Fast tests — no live network |
| `integration/` | Google Sheets published-data mapping (when added) |
| `end_to_end/workflows/` | Multi-page flows |
| `end_to_end/smoke/` | UI smoke / Playwright |

Feature colocated tests may live next to modules under `src/`.

## Closeout (every slice final phase — mandatory)

1. Create tests in canonical paths above
2. Register in `docs/project-files/regression/regression-plan.md`
3. Update this file **Planned → Populated**
4. **Execute** `npm test` and UI smoke when applicable — logs recorded in build evidence or closeout.md
5. Evaluate `success-criteria/` SC-xx PASS/FAIL

A slice is **not** closed when tests exist but have not been run.

See [`docs/product-manager-agent/regression-and-closeout.md`](../docs/product-manager-agent/regression-and-closeout.md).
