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
| **2** | Integration | Google Sheets mapping — unit fixtures in Layer 1 (no live network) |
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
| R-03-test | Unit | `npm test` | 03-navigation | Navbar, keyboard, mobile drawer, layout quality gate |
| R-03-build | Static build | `npm run build` | 03-navigation | Confirms navbar CSS/JS bundle into `dist/` |
| R-04-test | Unit | `npm test` | 04-google-sheets-updatable-content | Feed client, schemas, hydrate, updatable modules |
| R-04-build | Static build | `npm run build` | 04-google-sheets-updatable-content | Confirms hydration client bundles into `dist/` |
| R-05-test | Unit | `npm test` | 05-external-submissions | Submit adapters + Contact form states |
| R-05-build | Static build | `npm run build` | 05-external-submissions | Confirms form adapters bundle into `dist/` |

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
| U-03-nav | Navbar structure, config add, active state, keyboard, drawer | `tests/unit/navbar.test.tsx` | 03-navigation |
| U-03-mobile | Viewport, wrap CSS, calendar scroll wrapper | `tests/unit/mobile-quality-gate.test.tsx` | 03-navigation |
| U-04-feed | CSV/JSON parse, export URL + gid, never-throw fetch | `tests/unit/sheets-feed-client.test.ts` | 04-google-sheets-updatable-content |
| U-04-schema | Allow-list, sanitize, per-type parsers | `tests/unit/sheets-schemas.test.ts` | 04-google-sheets-updatable-content |
| U-04-hydrate | Fallback, limit, env URL + gid map | `tests/unit/sheets-hydrate.test.ts` | 04-google-sheets-updatable-content |
| U-04-modules | Shell-first hydrate, text/cards/events/contact | `tests/unit/updatable-modules.test.tsx` | 04-google-sheets-updatable-content |
| U-05-adapters | Adapter-only submit, https POST, mailto, no storage | `tests/unit/submit-adapters.test.ts` | 05-external-submissions |
| U-05-form | Contact validation, success/failure/handoff, D01 selection | `tests/unit/contact-form.test.tsx` | 05-external-submissions |

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
