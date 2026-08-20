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
| `tests/conftest.py` | Planned | Shared pytest hooks |
| `tests/orchestrators/` | Planned | `run_mfgcidashboard_regression.sh` |
| `tests/validation/` | Shim | **Do not add new tests here** |
| `tests/smoke-tests/` | Legacy | Use `end_to_end/smoke/` |

## Layers (seed README stubs in bootstrap Phase 3)

| Path | Purpose |
|------|---------|
| `unit/` | pytest — no live DB |
| `integration/` | API, DB, repositories |
| `database/` | deploy, schema_validation, seed, integrity |
| `contract/` | external system assumptions |
| `end_to_end/workflows/` | multi-step flows |
| `end_to_end/smoke/` | UI smoke / Playwright |
| `security/`, `performance/`, `acceptance/` | planned stubs |

Feature colocated tests may live under `src/mfgcidashboard_app/modules/**/tests/`.

## Closeout (every slice final phase — mandatory)

1. Create tests in canonical paths above
2. Register in `docs/project-files/regression/regression-plan.md`
3. Update this file **Planned → Populated**
4. **Execute** pytest + validation scripts — logs recorded in build evidence or closeout.md
5. Evaluate `success-criteria/` SC-xx PASS/FAIL

A slice is **not** closed when tests exist but have not been run.

See [`vendor/agent-product-manager/regression-and-closeout.md`](../vendor/agent-product-manager/regression-and-closeout.md).
