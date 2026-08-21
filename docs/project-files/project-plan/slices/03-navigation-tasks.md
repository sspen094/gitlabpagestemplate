# Slice 03 — navigation (tasks)

**Requirements:** `docs/requirements/slices/03-navigation/03-navigation-requirements.md`  
**Last synced:** 2026-08-21 (D01-mobile-nav-and-layout)

Executable task list for this vertical slice. Do not start implementation until the human approves this file and `success-criteria/traceability.md`.

## Acceptance criteria map (required at task sync)

| # | Summary | Primary phase | SC-xx |
|---|---------|---------------|-------|
| 1 | Top-level + sections + dropdown subsections | 1 | SC-01 |
| 2 | Data-driven nav items/subsections | 1 | SC-02 |
| 3 | Active page/section indicated | 1 | SC-03 |
| 4 | Keyboard-accessible navbar + dropdowns | 2 | SC-04 |
| D01 | Mobile hamburger + side drawer | 2 | SC-05 |
| D01 | Mobile layout quality gate | 2 | SC-06 |

## Task conventions

| Marker | Meaning |
|--------|---------|
| `- [x] … — **YYYY-MM-DD**` | Complete; date is completion day |
| `- [ ] …` | Not started or in progress |
| `- [ ] …` + indented `- **Note:** …` | Skipped, modified, or partial |

---

## Phase 1 — Data-driven navbar

- [x] Define a nav configuration schema (top-level pages, section groupings, dropdown subsections) — **2026-08-21** `types.ts` + `nav-config.ts`; human verified
- [x] Implement the navbar component rendering from the nav config — **2026-08-21** `Navbar` + `AppShell`; human verified
- [x] Implement dropdown subsections (e.g. About > Contact / Members) — **2026-08-21** About children Contact/Members; human verified
- [x] Implement active page/section indication tied to the current route — **2026-08-21** `aria-current` + `is-active`; human verified
- [x] Use `t()` for nav labels where practical — **2026-08-21** `nav.items.*` / `nav.chrome.label`; human verified

## Phase 2 — Accessibility

- [x] Make navbar + dropdowns keyboard operable (tab/arrow/enter/escape) with correct focus management — **2026-08-21** `keyboard.ts` + `Navbar` arrows/Escape; `tests/unit/navbar.test.tsx`
- [x] Add ARIA roles/states for menus and current page — **2026-08-21** `role="menu"` / `menuitem`, `aria-expanded`, `aria-current`
- [x] Verify against standard web accessibility expectations — **2026-08-21** keyboard + ARIA unit tests; human closeout
- [x] Mobile hamburger control opens a side drawer of the same nav config (D01) — **2026-08-21** `MobileNavbar`; `matchMedia` tests
- [x] Mobile layout quality gate — wrapping/overflow CSS + automated check (D01) — **2026-08-21** `tests/unit/mobile-quality-gate.test.tsx` + DP `mobile-layout.md`

---

## Manual confirmation phase (required before Final)

### Change checklist

_(No review defects or change requests logged in this phase.)_

### Phase closeout

- [x] Walk the change checklist with the human — **2026-08-21** — no open review items
- [x] Human verbal confirmation recorded — slice ready for Final phase — **Note:** 2026-08-21 — “this slice is done close out manual and final phases”

---

## Final phase — Documentation, tests, and verification (required)

### Documentation

- [x] As-built doc in `docs/modules/navigation/features/navbar/` — **2026-08-21**
- [x] Build evidence in `docs/project-files/build-evidence/` — **2026-08-21** `03-navigation.md`
- [x] Update `docs/product-manager-agent/implementation-catalog.md` — **2026-08-21** Next slice `04`; navbar Shipped
- [x] **Project-wide documentation update** (mandatory) — walk `docs/README.md` + layer hubs — **2026-08-21** map, architecture, configuration, testing, implemented-design (`design/navigation.md`), modules indexes, catalog, regression, SCAFFOLD, developer.md, root README; verification report

### Success criteria

- [x] Complete `success-criteria/closeout.md` — SC-01..SC-06 with `verify:` links — **2026-08-21** all PASS
- [x] Update `success-criteria/traceability.md` — Result + evidence — **2026-08-21**
- [x] Evaluate SC-xx; record in verification report — **2026-08-21** `docs/project-files/verification-reports/20260821-083500-03-navigation/`

### Regression tests (executable — required)

- [x] **Create** — navbar structure/dropdown component test, data-driven add test, active-state test, keyboard + mobile drawer — **2026-08-21** `navbar.test.tsx`, `mobile-quality-gate.test.tsx`
- [x] **Register** — add rows to `docs/project-files/regression/regression-plan.md` — **2026-08-21** U-03-nav, U-03-mobile, R-03-test, R-03-build
- [x] **SCAFFOLD** — update `tests/SCAFFOLD.md`: Planned → Populated — **2026-08-21** unit layer already Populated; notes include navbar + mobile quality gate; e2e smoke stays Planned
- [x] **Execute** — `npm test` — **2026-08-21** 9 files, 43 passed
- [x] **Execute** — Playwright / UI smoke (pages changed) — **2026-08-21**
  - **Note:** Playwright N/A — no `@playwright/test`. UI smoke: Cursor browser `#/demo`, `#/about`, `#/about/contact` (navbar, active Demo/About, Contact hero)
- [x] **Execute** — `npm run build` before merge — **2026-08-21** `tsc -b && vite build` green

---

## Links

- Documentation map: `docs/README.md`
- Regression plan: `docs/project-files/regression/regression-plan.md`
- Test scaffold: `tests/SCAFFOLD.md`
