# Slice 04 — google-sheets-updatable-content (tasks)

**Requirements:** `docs/requirements/slices/04-google-sheets-updatable-content/04-google-sheets-updatable-content-requirements.md`  
**Last synced:** 2026-08-20

Executable task list for this vertical slice. Do not start implementation until the human approves this file and `success-criteria/traceability.md`.

## Acceptance criteria map (required at task sync)

| # | Summary | Primary phase | SC-xx |
|---|---------|---------------|-------|
| 1 | Text + card + event driven from Sheets | 2 | SC-01 |
| 2 | Schemas + explicit mappings per type | 1 | SC-02 |
| 3 | Graceful fallback on failure/malformed | 1 | SC-03 |
| 4 | Validation + sanitization | 1 | SC-04 |
| 5 | Non-blocking load + collection limits | 2 | SC-05 |

## Task conventions

| Marker | Meaning |
|--------|---------|
| `- [x] … — **YYYY-MM-DD**` | Complete; date is completion day |
| `- [ ] …` | Not started or in progress |
| `- [ ] …` + indented `- **Note:** …` | Skipped, modified, or partial |

---

## Phase 1 — Data layer: source client, schemas, validation, fallback

- [ ] Implement a published-feed client (CSV/JSON) — stable published format, no UI scraping
- [ ] Define schemas: Text Block, Card List, Event/Calendar, Contact/Info
- [ ] Define the mapping model: page → section/module → sheet/worksheet/named range → data type
- [ ] Implement validation to an approved field allow-list per schema (drop/mark invalid rows)
- [ ] Implement sanitization/constraint of external values (no raw HTML injection)
- [ ] Implement graceful fallback (placeholder / last-known / empty state) on fetch failure or malformed data
- [ ] Store published-feed URLs in non-secret committed config / `.env.example` (no edit credentials)

## Phase 2 — Updatable modules & performance

- [ ] Wire `updatable` mode from the Slice 02 module definition model to the data layer
- [ ] Updatable Text Block module bound to a mapped source
- [ ] Updatable Card List module (rows → cards) bound to a mapped source
- [ ] Updatable Event/Calendar module bound to a mapped source
- [ ] (Optional) Contact/Info updatable rendering using the defined schema
- [ ] Ensure external load does not block initial render (async hydrate around static shell)
- [ ] Enforce collection limits / pagination for large feeds

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

- [ ] As-built doc in `docs/modules/updatable-content/features/sheets-hydration/`
- [ ] Configuration doc: mapping model + published-feed setup in `docs/configuration/`
- [ ] Build evidence in `docs/project-files/build-evidence/`
- [ ] Update `docs/product-manager-agent/implementation-catalog.md`
- [ ] **Project-wide documentation update** (mandatory) — walk `docs/README.md` + layer hubs (esp. `configuration/`)

### Success criteria

- [ ] Complete `success-criteria/closeout.md` — SC-01..SC-05 with `verify:` links
- [ ] Update `success-criteria/traceability.md` — Result + evidence
- [ ] Evaluate SC-xx; record in verification report

### Regression tests (executable — required)

- [ ] **Create** — feed parser unit tests (per schema, with fixtures), fallback/malformed tests, sanitization tests, updatable module component tests, non-blocking + limit tests
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
- Configuration hub: `docs/configuration/README.md`
