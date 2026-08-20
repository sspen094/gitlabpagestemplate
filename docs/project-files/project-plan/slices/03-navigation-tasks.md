# Slice 03 — navigation (tasks)

**Requirements:** `docs/requirements/slices/03-navigation/03-navigation-requirements.md`  
**Last synced:** 2026-08-20

Executable task list for this vertical slice. Do not start implementation until the human approves this file and `success-criteria/traceability.md`.

## Acceptance criteria map (required at task sync)

| # | Summary | Primary phase | SC-xx |
|---|---------|---------------|-------|
| 1 | Top-level + sections + dropdown subsections | 1 | SC-01 |
| 2 | Data-driven nav items/subsections | 1 | SC-02 |
| 3 | Active page/section indicated | 1 | SC-03 |
| 4 | Keyboard-accessible navbar + dropdowns | 2 | SC-04 |

## Task conventions

| Marker | Meaning |
|--------|---------|
| `- [x] … — **YYYY-MM-DD**` | Complete; date is completion day |
| `- [ ] …` | Not started or in progress |
| `- [ ] …` + indented `- **Note:** …` | Skipped, modified, or partial |

---

## Phase 1 — Data-driven navbar

- [ ] Define a nav configuration schema (top-level pages, section groupings, dropdown subsections)
- [ ] Implement the navbar component rendering from the nav config
- [ ] Implement dropdown subsections (e.g. About > Contact / Members)
- [ ] Implement active page/section indication tied to the current route
- [ ] Use `t()` for nav labels where practical

## Phase 2 — Accessibility

- [ ] Make navbar + dropdowns keyboard operable (tab/arrow/enter/escape) with correct focus management
- [ ] Add ARIA roles/states for menus and current page
- [ ] Verify against standard web accessibility expectations

---

## Manual confirmation phase (required before Final)

### Change checklist

- [ ] _(none yet — populated during Manual confirmation)_

### Phase closeout

- [ ] Walk the change checklist with the human
- [ ] Human verbal confirmation recorded — slice ready for Final phase — **Note:** _date + paraphrase_

---

## Final phase — Documentation, tests, and verification (required)

### Documentation

- [ ] As-built doc in `docs/modules/navigation/features/navbar/`
- [ ] Build evidence in `docs/project-files/build-evidence/`
- [ ] Update `docs/product-manager-agent/implementation-catalog.md`
- [ ] **Project-wide documentation update** (mandatory) — walk `docs/README.md` + layer hubs

### Success criteria

- [ ] Complete `success-criteria/closeout.md` — SC-01..SC-04 with `verify:` links
- [ ] Update `success-criteria/traceability.md` — Result + evidence
- [ ] Evaluate SC-xx; record in verification report

### Regression tests (executable — required)

- [ ] **Create** — navbar structure/dropdown component test, data-driven add test, active-state test, keyboard + axe smoke
- [ ] **Register** — add rows to `docs/project-files/regression/regression-plan.md`
- [ ] **SCAFFOLD** — update `tests/SCAFFOLD.md`: Planned → Populated
- [ ] **Execute** — `npm test`
- [ ] **Execute** — Playwright / UI smoke (pages changed)
- [ ] **Execute** — `npm run build` before merge

---

## Links

- Documentation map: `docs/README.md`
- Regression plan: `docs/project-files/regression/regression-plan.md`
- Test scaffold: `tests/SCAFFOLD.md`
