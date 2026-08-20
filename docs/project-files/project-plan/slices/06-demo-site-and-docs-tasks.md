# Slice 06 — demo-site-and-docs (tasks)

**Requirements:** `docs/requirements/slices/06-demo-site-and-docs/06-demo-site-and-docs-requirements.md`  
**Last synced:** 2026-08-20

Executable task list for this vertical slice. Do not start implementation until the human approves this file and `success-criteria/traceability.md`.

## Acceptance criteria map (required at task sync)

| # | Summary | Primary phase | SC-xx |
|---|---------|---------------|-------|
| 1 | Demo shows modules + update patterns (placeholder) | 1 | SC-01 |
| 2 | Developer guides for the four tasks | 2 | SC-02 |
| 3 | Editor guide enables no-code updates | 2 | SC-03 |
| 4 | Fork/rename documented; placeholder-only | 2 | SC-04 |

## Task conventions

| Marker | Meaning |
|--------|---------|
| `- [x] … — **YYYY-MM-DD**` | Complete; date is completion day |
| `- [ ] …` | Not started or in progress |
| `- [ ] …` + indented `- **Note:** …` | Skipped, modified, or partial |

---

## Phase 1 — Assemble demo site (placeholder content)

- [ ] Build demo pages (e.g. Home, About, About > Contact, About > Members, Events) via page config
- [ ] Demonstrate each baseline module with placeholder content
- [ ] Demonstrate updatable text block, card list, and event/calendar sections from sample sheet fixtures
- [ ] Wire the demo nav structure (top-level + section + dropdown subsections)
- [ ] Include the example Contact form (Slice 05) in the demo
- [ ] Audit demo content to ensure placeholder-only (no real org data)

## Phase 2 — Editor & developer documentation

- [ ] Editor guide: update approved sections via Google Sheets (no code) — sample sheet structure
- [ ] Developer guide: add a page
- [ ] Developer guide: add a module
- [ ] Developer guide: configure an updatable section
- [ ] Developer guide: map a Google Sheets data source
- [ ] Fork/rename/adapt guide for turning the template into a real site

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

- [ ] As-built doc in `docs/modules/demo-site/features/demo-and-guides/`
- [ ] Publish editor + developer guides under `docs/` (linked from `docs/README.md`)
- [ ] Build evidence in `docs/project-files/build-evidence/`
- [ ] Update `docs/product-manager-agent/implementation-catalog.md`
- [ ] **Project-wide documentation update** (mandatory) — full walk of `docs/README.md` + every layer hub; confirm the whole docs tree reflects the shipped template (this is the template-completion slice)

### Success criteria

- [ ] Complete `success-criteria/closeout.md` — SC-01..SC-04 with `verify:` links
- [ ] Update `success-criteria/traceability.md` — Result + evidence
- [ ] Evaluate SC-xx; record in verification report

### Regression tests (executable — required)

- [ ] **Create** — demo page render tests, updatable-section hydration/fallback tests, full-site Playwright UI smoke, docs presence/link checks
- [ ] **Register** — add rows to `docs/project-files/regression/regression-plan.md`
- [ ] **SCAFFOLD** — update `tests/SCAFFOLD.md`: Planned → Populated
- [ ] **Execute** — `npm test`
- [ ] **Execute** — Playwright / full-site UI smoke
- [ ] **Execute** — `npm run build` before merge

---

## Links

- Documentation map: `docs/README.md`
- Regression plan: `docs/project-files/regression/regression-plan.md`
- Test scaffold: `tests/SCAFFOLD.md`
