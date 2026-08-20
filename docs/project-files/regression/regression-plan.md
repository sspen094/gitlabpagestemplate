# Regression test plan

Living plan for **executable regression** — slice acceptance, post-deploy verification, and tests added when fixing defects.

**Tests live under `tests/`** (canonical paths per `tests/SCAFFOLD.md`). This doc is **traceability**: what we run, when, and which slice or defect prompted it.

**Local run:**

```powershell
npm test
npm run build
```

---

## Regression layers

| Layer | Purpose | Typical contents |
|-------|---------|------------------|
| **1** | Unit / component | `npm test` — pages, modules, `t()` lookup |
| **2** | Integration | Google Sheets published-data mapping (when added) |
| **3** | UI smoke | Playwright in `tests/end_to_end/smoke/` |
| **4** | Static build | `npm run build` for GitHub Pages |

---

## Test inventory — scripts

| Id | Area | Script | Slice / trigger | Notes |
|----|------|--------|-----------------|-------|
| | | | | |

_Add one row per slice closeout script. Do not add new tests under `tests/validation/`._

---

## Test inventory — unit / component (Layer 1)

| Id | Area | Path | Slice / trigger |
|----|------|------|-----------------|
| | | | |

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
