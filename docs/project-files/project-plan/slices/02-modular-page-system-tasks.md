# Slice 02 — modular-page-system (tasks)

**Requirements:** `docs/requirements/slices/02-modular-page-system/02-modular-page-system-requirements.md`  
**Last synced:** 2026-08-20

Executable task list for this vertical slice. Do not start implementation until the human approves this file and `success-criteria/traceability.md`.

## Acceptance criteria map (required at task sync)

| # | Summary | Primary phase | SC-xx |
|---|---------|---------------|-------|
| 1 | Add a page from config, minimal code | 1 | SC-01 |
| 2 | Baseline modules render from config | 2 | SC-02 |
| 3 | Consistent rendering + definition model | 1 | SC-03 |
| 4 | Accessible headings + image alt | 2 | SC-04 |

## Task conventions

| Marker | Meaning |
|--------|---------|
| `- [x] … — **YYYY-MM-DD**` | Complete; date is completion day |
| `- [ ] …` | Not started or in progress |
| `- [ ] …` + indented `- **Note:** …` | Skipped, modified, or partial |

---

## Phase 1 — Page composition & module framework

- [ ] Define the module definition model (type, static/updatable mode, layout config, data source ref, validation expectations, fallback)
- [ ] Implement a module registry mapping module type → component
- [ ] Implement a page composer that renders an ordered list of configured module instances
- [ ] Implement page registration (config + route) so a new page needs minimal code
- [ ] Route configured pages through one shared rendering pipeline (static + future updatable)

## Phase 2 — Baseline modules & accessibility

- [ ] Header / hero module (config: title, subtitle, media, CTA slot)
- [ ] Text block module (uses `t()` and/or provided content)
- [ ] Image block module (requires alt text)
- [ ] Card list / card grid module (config-driven entries)
- [ ] Section wrapper module (groups child modules)
- [ ] Ensure heading hierarchy is preserved and images carry alt text across modules

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

- [ ] As-built doc in `docs/modules/pages/features/modular-pages/` (and module catalog for baseline modules)
- [ ] Build evidence in `docs/project-files/build-evidence/`
- [ ] Update `docs/product-manager-agent/implementation-catalog.md`
- [ ] **Project-wide documentation update** (mandatory) — walk `docs/README.md` + layer hubs; refresh module indexes + hub tables

### Success criteria

- [ ] Complete `success-criteria/closeout.md` — SC-01..SC-04 with `verify:` links
- [ ] Update `success-criteria/traceability.md` — Result + evidence
- [ ] Evaluate SC-xx; record in verification report

### Regression tests (executable — required)

- [ ] **Create** — page composer test, per-module component tests, definition-model validation/fallback unit test, a11y smoke
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
