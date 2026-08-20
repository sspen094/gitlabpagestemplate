# Slice 01 — text-management (tasks)

**Requirements:** `docs/requirements/slices/01-text-management/01-text-management-requirements.md`  
**Last synced:** 2026-08-20  
**Status:** shipped — 2026-08-20

Executable task list for this vertical slice. Plan approved; implementation proceeds via `/start-phase`.

## Acceptance criteria map (required at task sync)

| # | Summary | Primary phase | SC-xx |
|---|---------|---------------|-------|
| 1 | Text via `t()` `[page].[section].[item]` keys | 1 | SC-01 |
| 2 | Centralized single-location text config | 1 | SC-02 |
| 3 | Missing key falls back safely | 2 | SC-03 |
| 4 | Localization-ready structure | 2 | SC-04 |

## Task conventions

| Marker | Meaning |
|--------|---------|
| `- [x] … — **YYYY-MM-DD**` | Complete; date is completion day |
| `- [ ] …` | Not started or in progress |
| `- [ ] …` + indented `- **Note:** …` | Skipped, modified, or partial |

---

## Phase 1 — Text store & `t()` lookup

- [x] Create a central text config module (tree keyed by `[page].[section].[item]`) — **2026-08-20** `src/modules/text/t-lookup/text-config.ts`
- [x] Implement `t(key)` helper (and/or a `useText()` hook) resolving keys against the store — **2026-08-20** `t.ts` + `useText.ts`; `npm test` 9 passed
- [x] Enforce/normalize at least `[page].[section]` grouping (validation helper or lint note) — **2026-08-20** `keys.ts` `isGroupedTextKey` / `isFullTextKey`
- [x] Wire the app shell copy from Slice 00 to use `t()` keys — **2026-08-20** `src/App.tsx` uses `useText()`; human approved phase

## Phase 2 — Fallback & localization-ready structure

- [x] Implement safe fallback for missing keys (configurable placeholder or key echo, no throw) — **2026-08-20** default echo; `setTextFallback`; `t-lookup.test.tsx`
- [x] Structure the store so an alternate text set / locale can be provided without changing call sites — **2026-08-20** `TextProvider` / `createT` / `setActiveTextTree`; human approved phase

---

## Manual confirmation phase (required before Final)

### Change checklist

- [x] Update sample shell copy in `text-config.ts` (brand MY APP, title My Website Template) — **2026-08-20**

### Phase closeout

- [x] Walk the change checklist with the human — **2026-08-20** copy-edit item closed; Pages vs local confusion was deploy lag, not a product defect
- [x] Human verbal confirmation recorded — slice ready for Final phase — **Note:** 2026-08-20 — “This phase and this whole slice is approved - close it out”

---

## Final phase — Documentation, tests, and verification (required)

### Documentation

- [x] As-built doc in `docs/modules/text/features/t-lookup/` — **2026-08-20**
- [x] Build evidence in `docs/project-files/build-evidence/` — **2026-08-20** `01-text-management.md`
- [x] Update `docs/product-manager-agent/implementation-catalog.md` — **2026-08-20** Next slice `02`; t-lookup Shipped
- [x] **Project-wide documentation update** (mandatory) — walk `docs/README.md` + layer hubs; update map/hub tables — **2026-08-20** map, architecture, configuration, testing, implemented-design (`design/text.md`), modules indexes, catalog, regression, SCAFFOLD, developer.md, root README; verification hub + report

### Success criteria

- [x] Complete `success-criteria/closeout.md` — SC-01..SC-04 with `verify:` links — **2026-08-20** all PASS
- [x] Update `success-criteria/traceability.md` — Result + evidence — **2026-08-20**
- [x] Evaluate SC-xx; record in verification report — **2026-08-20** `docs/project-files/verification-reports/20260820-181200-01-text-management/`

### Regression tests (executable — required)

- [x] **Create** — unit tests for `t()` known keys, unknown-key fallback, alternate-set swap — **2026-08-20** `tests/unit/t-lookup.test.tsx`
- [x] **Register** — add rows to `docs/project-files/regression/regression-plan.md` — **2026-08-20** U-01-t, R-01-test, R-01-build
- [x] **SCAFFOLD** — update `tests/SCAFFOLD.md`: Planned → Populated — **2026-08-20** unit layer already Populated; notes include `t-lookup`
- [x] **Execute** — `npm test` — **2026-08-20** 4 files, 15 passed
- [x] **Execute** — `npm run build` before merge — **2026-08-20** `tsc -b && vite build` green

---

## Links

- Documentation map: `docs/README.md`
- Regression plan: `docs/project-files/regression/regression-plan.md`
- Test scaffold: `tests/SCAFFOLD.md`
