# Slice 04 — google-sheets-updatable-content (tasks)

**Requirements:** `docs/requirements/slices/04-google-sheets-updatable-content/04-google-sheets-updatable-content-requirements.md`  
**Last synced:** 2026-08-21 — D01 single-spreadsheet worksheet routing; D02 text-block single column; D03 all modules sheet-driven + dynamic rows (supersedes D02's first-row rule)
**Status:** shipped — **2026-08-21** (human: “This slice is approved close out until final”)

Executable task list for this vertical slice. Final phase complete **2026-08-21**.

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

- [x] Implement a published-feed client (CSV/JSON) — stable published format, no UI scraping — **2026-08-21** `data-sources/feed-client` (`csv.ts`, `json.ts`, never-throw `client.ts`); `sheets-feed-client.test.ts`
- [x] Define schemas: Text Block, Card List, Event/Calendar, Contact/Info — **2026-08-21** `sheets-hydration/schemas.ts` typed shapes + parsers; `sheets-schemas.test.ts`
- [x] Define the mapping model: page → section/module → sheet/worksheet/named range → data type — **2026-08-21** `mapping.ts` + committed `sheet-mappings.ts`; `sheets-hydrate.test.ts` mapping cases
- [x] Implement validation to an approved field allow-list per schema (drop/mark invalid rows) — **2026-08-21** `ALLOWED_FIELDS` + `pickAllowedFields` + per-type required-field drops; `sheets-schemas.test.ts`
- [x] Implement sanitization/constraint of external values (no raw HTML injection) — **2026-08-21** `sanitize.ts` strip-tags/URL-scheme allow-list (`javascript:` rejected); `sheets-schemas.test.ts`
- [x] Implement graceful fallback (placeholder / last-known / empty state) on fetch failure or malformed data — **2026-08-21** `fallback.ts` + `hydrate.ts` fetch-failed/empty/malformed → `t()` keys; `sheets-hydrate.test.ts`
- [x] Store published-feed URLs in non-secret committed config / `.env.example` (no edit credentials) — **2026-08-21** initial per-mapping env overrides; superseded by D01's one `VITE_GOOGLE_SHEETS_URL`

## Phase 2 — Updatable modules & performance

- [x] Wire `updatable` mode from the Slice 02 module definition model to the data layer — **2026-08-21** `UpdatableModule` + `useUpdatableModule`
- [x] Updatable Text Block module bound to a mapped source — **2026-08-21** one paragraph per row (D03)
- [x] Updatable Card List module (rows → cards) bound to a mapped source — **2026-08-21** subtitle/link/image/sortOrder rendered (D03)
- [x] Updatable Event/Calendar module bound to a mapped source — **2026-08-21** time/location/link rendered; sheet date formats normalized (D03)
- [x] Contact/Info updatable rendering using the defined schema — **2026-08-21** `ContactInfoModule` on `/about/contact` (D03; was optional)
- [x] Ensure external load does not block initial render (async hydrate around static shell) — **2026-08-21** shell-first effect; `updatable-modules.test.tsx`
- [x] Enforce collection limits / pagination for large feeds — **2026-08-21** per-mapping `limit`, applied after `sortOrder`
- [x] D01 — Replace per-mapping feed URLs with one site-wide Google Spreadsheet URL — **2026-08-21**
- [x] D01 — Route each same-named worksheet tab to its parent module and schema — **2026-08-21**
- [x] D01 — Normalize a Google Sheets share link into stable per-worksheet CSV requests — **2026-08-21**
- [x] D01 — Update editor intake docs, environment template, and regression tests — **2026-08-21**
- [x] D03 — Read worksheets from the CSV export endpoint by `gid` so cells arrive exactly as displayed — **2026-08-21**
- [x] D03 — Supply worksheet ids per site through `VITE_GOOGLE_SHEETS_GIDS`; no gid keeps the shell — **2026-08-21**
- [x] D03 — Render every valid row: text paragraphs, described-only cards, `sortOrder` — **2026-08-21**
- [x] D03 — Normalize sheet-exported date formats to ISO — **2026-08-21**
- [x] D03 — Rebuild the demo page as one sheet-backed example per updatable type — **2026-08-21**

---

## Manual confirmation phase (required before Final)

### Change checklist

- [x] Use one Google Spreadsheet link and same-named worksheet tabs to route rows to parent website elements — **2026-08-21**
- [x] Text Block sheet intake is one `text` column; cards/events/contact stay the same — **2026-08-21**
- [x] Sheet URL never reached the browser: read the literal `import.meta.env` so Vite injects it — **2026-08-21**
  - **Note:** Reading `import.meta` and then `.env` left the env object undefined, so every module stayed on its static shell.
- [x] Calendar renders fallback: the spreadsheet has no `demo-calendar` worksheet, and Google's CSV endpoint silently serves the first tab instead of failing — **2026-08-21**
  - **Note:** Fixed in code by addressing worksheets by `gid` through the export endpoint, which answers an unknown worksheet with HTTP 400. The owner still needs to create the `demo-calendar` tab.
- [x] Sheet cells arrive empty when a column holds mixed text and numbers (`Custom` lost from the `title` column) — **2026-08-21**
  - **Note:** Root cause of the "only one card" report — `gviz` types each column and discards values of another type. The export endpoint returns cells verbatim.
- [x] Text Block renders only the first sheet row; the owner expects every row to add a block dynamically — **2026-08-21**
- [x] Card List drops sheet rows with a blank `title`, so a described-but-untitled row disappears instead of rendering — **2026-08-21**
- [x] Contact/Info has a schema and parser but no renderer, page instance, or worksheet mapping — **2026-08-21**
- [x] Demo page still renders hardcoded hero, intro text, image, card list, and calendar modules that never read the spreadsheet — **2026-08-21**
  - **Note:** Page hero stays static — there is no hero schema. All content modules are sheet-backed.
- [x] Demo page reuses module ids `demo-cards` / `demo-calendar` for both a static and an updatable instance — **2026-08-21**
- [x] Owner to add worksheet tabs `demo-calendar` and `contact-info`, then supply every tab's `gid` for `VITE_GOOGLE_SHEETS_GIDS` — **2026-08-21**
  - **Note:** All four tabs verified live at `#/demo` and `#/about/contact` — 4 text paragraphs, 2 cards in `sortOrder`, 2 events with time/location, 1 `tel:` contact. All feed requests HTTP 200, no console errors.
- [x] Demo page should show a hybrid date/time element — cards for the next five events plus a month calendar — **2026-08-21**
  - **Note:** New `layout: 'hybrid'` on the shared calendar module (`upcomingCount`, default 5, and `upcomingTitleKey`). Cards list dated events from today forward (most recent when all are past); the grid keeps every sheet row. Verified live at `#/demo`: Event A (Aug 21) and Event B (Aug 30) as cards beside the August 2026 grid with both day chips placed; stacks to one column at 420px with no overflow.
- [x] Month grid should step by month, limited to the current year and the following year — **2026-08-21**
  - **Note:** Previous/Next on month and hybrid layouts. Range is January of this year through December of next (2026–2027 today). Months outside that window clamp to the nearest bound; far-end buttons disable.
- [x] Month stepping controls should be forward and backward arrows, not text labels — **2026-08-21**
  - **Note:** Visible ← / →; `aria-label` stays “Previous month” / “Next month”.

### Phase closeout

- [x] Walk the change checklist with the human — **2026-08-21** — all change items closed (D01, D03, hybrid calendar, month stepping)
- [x] Human verbal confirmation recorded — slice ready for Final phase — **Note:** 2026-08-21 — “This slice is approved close out until final”

---

## Final phase — Documentation, tests, and verification (required)

### Documentation

- [x] As-built doc in `docs/modules/updatable-content/features/sheets-hydration/` — **2026-08-21**
- [x] Configuration doc: mapping model + published-feed setup in `docs/configuration/` — **2026-08-21** `google-sheets.md`
- [x] Build evidence in `docs/project-files/build-evidence/` — **2026-08-21** `04-google-sheets-updatable-content.md`
- [x] Update `docs/product-manager-agent/implementation-catalog.md` — **2026-08-21** Next slice `05`; sheets-hydration Shipped
- [x] **Project-wide documentation update** (mandatory) — walk `docs/README.md` + layer hubs (esp. `configuration/`) — **2026-08-21** map, architecture, configuration, testing, implemented-design (`design/updatable-content.md`), modules indexes (`updatable-content`, `data-sources`), catalog, regression, SCAFFOLD, developer.md, root README; verification report

### Success criteria

- [x] Complete `success-criteria/closeout.md` — SC-01..SC-05 with `verify:` links — **2026-08-21** all PASS
- [x] Update `success-criteria/traceability.md` — Result + evidence — **2026-08-21**
- [x] Evaluate SC-xx; record in verification report — **2026-08-21** `docs/project-files/verification-reports/20260821-131000-04-google-sheets-updatable-content/`

### Regression tests (executable — required)

- [x] **Create** — feed parser unit tests (per schema, with fixtures), fallback/malformed tests, sanitization tests, updatable module component tests, non-blocking + limit tests — **2026-08-21** `sheets-feed-client.test.ts`, `sheets-schemas.test.ts`, `sheets-hydrate.test.ts`, `updatable-modules.test.tsx`
- [x] **Register** — add rows to `docs/project-files/regression/regression-plan.md` — **2026-08-21** U-04-feed, U-04-schema, U-04-hydrate, U-04-modules, R-04-test, R-04-build
- [x] **SCAFFOLD** — update `tests/SCAFFOLD.md`: Planned → Populated — **2026-08-21** unit layer already Populated; notes include sheets + updatable hydration; e2e smoke stays Planned
- [x] **Execute** — `npm test` — **2026-08-21** 13 files, 115 passed
- [x] **Execute** — Playwright / UI smoke (pages changed) — **2026-08-21** Playwright N/A (no `@playwright/test`); UI smoke recorded in Manual confirmation (live `#/demo` + `#/about/contact`)
- [x] **Execute** — `npm run build` before merge — **2026-08-21** `dist/assets/index-Df8OfEYP.css`, `dist/assets/index-CO3Pzt70.js`

---

## Links

- Documentation map: `docs/README.md`
- Regression plan: `docs/project-files/regression/regression-plan.md`
- Test scaffold: `tests/SCAFFOLD.md`
- Configuration hub: `docs/configuration/README.md`
