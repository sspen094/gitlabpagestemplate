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
| R-00-build | Static build | `npm run build` | 00-app-scaffold-and-deploy | GitHub Pages `dist/` |
| R-00-test | Unit | `npm test` | 00-app-scaffold-and-deploy | Vitest Layer 1 |
| R-01-test | Unit | `npm test` | 01-text-management | Includes `t-lookup` |
| R-01-build | Static build | `npm run build` | 01-text-management | Confirms copy bundles into `dist/` |
| R-02-test | Unit | `npm test` | 02-modular-page-system | Composer, definition model, baseline modules + calendar |
| R-02-build | Static build | `npm run build` | 02-modular-page-system | Confirms page modules bundle into `dist/` |

_Add one row per slice closeout script. Do not add new tests under `tests/validation/`._

---

## Test inventory — unit / component (Layer 1)

| Id | Area | Path | Slice / trigger |
|----|------|------|-----------------|
| U-00-base | Pages base | `tests/unit/vite-base.test.ts` | 00-app-scaffold-and-deploy |
| U-00-shell | App shell | `tests/unit/app-shell.test.tsx` | 00-app-scaffold-and-deploy |
| U-00-dist | Static output + base | `tests/unit/static-build.test.ts` | 00-app-scaffold-and-deploy |
| U-01-t | `t()` lookup, fallback, alternate set | `tests/unit/t-lookup.test.tsx` | 01-text-management |
| U-02-composer | Page composer, fallback, config-only page | `tests/unit/page-composer.test.tsx` | 02-modular-page-system |
| U-02-model | Definition model + type validation | `tests/unit/module-definition.test.ts` | 02-modular-page-system |
| U-02-modules | Baseline modules, a11y, calendar layouts | `tests/unit/baseline-modules.test.tsx` | 02-modular-page-system |

---

## Defect-driven regression

When fixing a defect, add a row here **before** closeout:

| Defect id | Script / test | Added |
|-----------|---------------|-------|
| Pages blank (JS 404 at `/assets`) | Workflow derives `/<repo>/`; `U-00-dist` | 2026-08-20 |

---

## Slice closeout rule

Every shipped slice adds or updates rows in this file during the **final phase** of `*-tasks.md`. A slice is not closed until listed tests have been **executed** successfully (or N/A documented).

See `docs/product-manager-agent/regression-and-closeout.md`.
