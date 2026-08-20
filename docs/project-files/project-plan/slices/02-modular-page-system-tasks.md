# Slice 02 — modular-page-system (tasks)

**Requirements:** `docs/requirements/slices/02-modular-page-system/02-modular-page-system-requirements.md`  
**Last synced:** 2026-08-20  
**Deviations:** [D01](../../../requirements/slices/02-modular-page-system/deviations/D01-calendar-module.md) (calendar module in Phase 2)

Executable task list for this vertical slice. Do not start implementation until the human approves this file and `success-criteria/traceability.md`.

## Acceptance criteria map (required at task sync)

| # | Summary | Primary phase | SC-xx |
|---|---------|---------------|-------|
| 1 | Add a page from config, minimal code | 1 | SC-01 |
| 2 | Baseline modules render from config | 2 | SC-02 |
| 3 | Consistent rendering + definition model | 1 | SC-03 |
| 4 | Accessible headings + image alt | 2 | SC-04 |
| 5 | Calendar module renders from config (D01) | 2 | SC-05 |

## Task conventions

| Marker | Meaning |
|--------|---------|
| `- [x] … — **YYYY-MM-DD**` | Complete; date is completion day |
| `- [ ] …` | Not started or in progress |
| `- [ ] …` + indented `- **Note:** …` | Skipped, modified, or partial |

---

## Phase 1 — Page composition & module framework

- [x] Define the module definition model (type, static/updatable mode, layout config, data source ref, validation expectations, fallback) — **2026-08-20** — `types.ts` + `validate.ts`; `tests/unit/module-definition.test.ts`
- [x] Implement a module registry mapping module type → component — **2026-08-20** — `registry.ts` (`placeholder`); composer lookup
- [x] Implement a page composer that renders an ordered list of configured module instances — **2026-08-20** — `PageComposer`; `tests/unit/page-composer.test.tsx`
- [x] Implement page registration (config + route) so a new page needs minimal code — **2026-08-20** — `pages-config.ts` + `PageRoutes.tsx`; extra page via config-only test
- [x] Route configured pages through one shared rendering pipeline (static + future updatable) — **2026-08-20** — `ModulePipeline`; updatable reserved + fallback; HashRouter pages

## Phase 2 — Baseline modules & accessibility

- [x] Header / hero module (config: title, subtitle, media, CTA slot) — **2026-08-20** — `HeroModule`; home + demo heroes; `tests/unit/baseline-modules.test.tsx`
- [x] Text block module (uses `t()` and/or provided content) — **2026-08-20** — `TextBlockModule`; demo intro via `t()`
- [x] Image block module (requires alt text) — **2026-08-20** — `ImageBlockModule`; missing alt → fallback
- [x] Card list / card grid module (config-driven entries) — **2026-08-20** — `CardListModule`; auto-fit grid default
- [x] Section wrapper module (groups child modules) — **2026-08-20** — `SectionModule` nested `ModulePipeline`
- [x] Calendar / events module (config-driven entries, example content) — **D01** — **2026-08-20** — `CalendarModule`; demo Kickoff/Review
- [x] Ensure heading hierarchy is preserved and images carry alt text across modules — **2026-08-20** — heading context + a11y assertions; human approved UI **2026-08-20**

---

## Manual confirmation phase (required before Final)

### Change checklist

- [x] Calendar module needs a month-grid layout option alongside the default event list, with events placed on their day — **2026-08-20** — `layout: 'month' \| 'grid'` in `CalendarModule`; list stays default; demo shows both; `tests/unit/baseline-modules.test.tsx`
- [x] Keep calendar event config sheet-mappable (date column → `date`, display column → title) so Slice 04 can map a published sheet onto the grid — **2026-08-20** — shared `demoEvents` rows feed both layouts; malformed `month` / `layout` use the shared fallback
  - **Note:** Sheets fetching itself remains Slice 04; only the config shape is fixed here

### Phase closeout

- [x] Walk the change checklist with the human — **2026-08-20** — both calendar items done (month grid + sheet-mappable date/title rows); no remaining open review items
- [x] Human verbal confirmation recorded — slice ready for Final phase — **Note:** 2026-08-20 — “confirmed good”

---

## Final phase — Documentation, tests, and verification (required)

### Documentation

- [x] As-built doc in `docs/modules/pages/features/modular-pages/` (and module catalog for baseline modules) — **2026-08-20**
- [x] Build evidence in `docs/project-files/build-evidence/` — **2026-08-20** `02-modular-page-system.md`
- [x] Update `docs/product-manager-agent/implementation-catalog.md` — **2026-08-20** Next slice `03`; modular-pages Shipped
- [x] **Project-wide documentation update** (mandatory) — walk `docs/README.md` + layer hubs; refresh module indexes + hub tables — **2026-08-20** map, architecture, configuration, testing, implemented-design (`design/pages.md`), modules indexes, catalog, regression, SCAFFOLD, developer.md, root README; verification report

### Success criteria

- [x] Complete `success-criteria/closeout.md` — SC-01..SC-05 with `verify:` links — **2026-08-20** all PASS
- [x] Update `success-criteria/traceability.md` — Result + evidence — **2026-08-20**
- [x] Evaluate SC-xx; record in verification report — **2026-08-20** `docs/project-files/verification-reports/20260820-192600-02-modular-page-system/`

### Regression tests (executable — required)

- [x] **Create** — page composer test, per-module component tests (incl. calendar), definition-model validation/fallback unit test, a11y smoke — **2026-08-20** `page-composer`, `module-definition`, `baseline-modules`
- [x] **Register** — add rows to `docs/project-files/regression/regression-plan.md` — **2026-08-20** U-02-composer, U-02-model, U-02-modules, R-02-test, R-02-build
- [x] **SCAFFOLD** — update `tests/SCAFFOLD.md`: Planned → Populated — **2026-08-20** unit layer already Populated; notes include composer/modules; e2e smoke stays Planned
- [x] **Execute** — `npm test` — **2026-08-20** 7 files, 30 passed
- [x] **Execute** — Playwright / UI smoke (pages changed) — **2026-08-20**
  - **Note:** Playwright N/A — no `@playwright/test`. UI smoke: Cursor browser `#/` and `#/demo` (home hero; demo modules + both calendars)
- [x] **Execute** — `npm run build` before merge — **2026-08-20** `tsc -b && vite build` green

---

## Links

- Documentation map: `docs/README.md`
- Regression plan: `docs/project-files/regression/regression-plan.md`
- Test scaffold: `tests/SCAFFOLD.md`
