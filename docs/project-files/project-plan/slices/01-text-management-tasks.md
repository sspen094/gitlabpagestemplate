# Slice 01 — text-management (tasks)

**Requirements:** `docs/requirements/slices/01-text-management/01-text-management-requirements.md`  
**Last synced:** 2026-08-20

Executable task list for this vertical slice. Do not start implementation until the human approves this file and `success-criteria/traceability.md`.

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

- [ ] Create a central text config module (tree keyed by `[page].[section].[item]`)
- [ ] Implement `t(key)` helper (and/or a `useText()` hook) resolving keys against the store
- [ ] Enforce/normalize at least `[page].[section]` grouping (validation helper or lint note)
- [ ] Wire the app shell copy from Slice 00 to use `t()` keys

## Phase 2 — Fallback & localization-ready structure

- [ ] Implement safe fallback for missing keys (configurable placeholder or key echo, no throw)
- [ ] Structure the store so an alternate text set / locale can be provided without changing call sites

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

- [ ] As-built doc in `docs/modules/text/features/t-lookup/`
- [ ] Build evidence in `docs/project-files/build-evidence/`
- [ ] Update `docs/product-manager-agent/implementation-catalog.md`
- [ ] **Project-wide documentation update** (mandatory) — walk `docs/README.md` + layer hubs; update map/hub tables

### Success criteria

- [ ] Complete `success-criteria/closeout.md` — SC-01..SC-04 with `verify:` links
- [ ] Update `success-criteria/traceability.md` — Result + evidence
- [ ] Evaluate SC-xx; record in verification report

### Regression tests (executable — required)

- [ ] **Create** — unit tests for `t()` known keys, unknown-key fallback, alternate-set swap
- [ ] **Register** — add rows to `docs/project-files/regression/regression-plan.md`
- [ ] **SCAFFOLD** — update `tests/SCAFFOLD.md`: Planned → Populated
- [ ] **Execute** — `npm test`
- [ ] **Execute** — `npm run build` before merge

---

## Links

- Documentation map: `docs/README.md`
- Regression plan: `docs/project-files/regression/regression-plan.md`
- Test scaffold: `tests/SCAFFOLD.md`
