# Regression test plan

Living plan for **executable regression** — slice acceptance, post-deploy verification, and tests added when fixing defects.

**Tests live under `tests/`** (canonical paths per `tests/SCAFFOLD.md`). This doc is **traceability**: what we run, when, and which slice or defect prompted it.

**Orchestrator (add during bootstrap or from reference monorepo):**

```bash
./tests/orchestrators/run_mfgcidashboard_regression.sh --skip-deploy --strict
```

---

## Regression layers

| Layer | Purpose | Typical contents |
|-------|---------|------------------|
| **0** | Schema / deploy gate | DB connectivity, required objects exist |
| **1** | Pytest (no live DB) | Unit, service, navigation |
| **2** | Integration / flow | API, DB workflows against DEV/TST |
| **3** | UI smoke | Playwright / layout scripts in `tests/end_to_end/smoke/` |
| **4** | External contract | Optional — live API when token configured |

---

## Test inventory — flow / validation scripts

| Id | Area | Script | Slice / trigger | Notes |
|----|------|--------|-----------------|-------|
| R001 | DB connectivity | `tests/integration/database/verify_db_connection.py` | Deploy / Layer 0 | |

_Add one row per slice closeout script. Do not add new tests under `tests/validation/`._

---

## Test inventory — pytest (Layer 1)

| Id | Area | Path | Slice / trigger |
|----|------|------|-----------------|
| P001 | App startup | `tests/unit/app/` | Foundations |

---

## Defect-driven regression

When fixing a defect, add a row here **before** closeout:

| Defect id | Script / test | Added |
|-----------|---------------|-------|
| _…_ | _…_ | YYYY-MM-DD |

---

## Slice closeout rule

Every shipped slice adds or updates rows in this file during the **final phase** of `*-tasks.md`. A slice is not closed until listed tests have been **executed** successfully (or N/A documented).

See `docs/product-manager-agent/regression-and-closeout.md`.
