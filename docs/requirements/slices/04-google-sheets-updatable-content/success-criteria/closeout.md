# Success criteria — Slice 04 google-sheets-updatable-content

## SC-01 Text + card list + event sections driven from Sheets
- [x] At least one text block, one card list, and one event/calendar section render from Google Sheets-linked data
- verify: component tests with published-feed fixtures for each of the three sections
- evidence: `tests/unit/updatable-modules.test.tsx` hydrates text (one paragraph per row), cards (`sortOrder` + described-only rows), events (sheet date formats); `tests/unit/baseline-modules.test.tsx` demo page composition; live `#/demo` during Manual confirmation. `npm test` 2026-08-21 **115 passed**

## SC-02 Schemas + explicit mappings per updatable type
- [x] Text Block, Card List, Event/Calendar, and Contact/Info have defined schemas and explicit page→section→sheet/range mappings
- verify: unit tests validating each schema; review of mapping config
- evidence: `src/modules/updatable-content/sheets-hydration/schemas.ts` + `sheet-mappings.ts`; `tests/unit/sheets-schemas.test.ts`; `tests/unit/sheets-hydrate.test.ts` (one spreadsheet URL + gid map). Contact renderer on `/about/contact`

## SC-03 Graceful fallback on failure/malformed data
- [x] Unreachable source or malformed rows produce a safe fallback; page renders without crashing
- verify: unit/component tests with failing fetch + malformed fixtures
- evidence: `sheets-feed-client.test.ts` never-throw fetch; `sheets-hydrate.test.ts` empty/malformed/fetch-failed; `updatable-modules.test.tsx` fallback copy + static shell when unmapped

## SC-04 Validation + sanitization of external content
- [x] External content is validated to approved fields and sanitized/constrained before render (no raw HTML injection)
- verify: unit tests on sanitization + field allow-list
- evidence: `sheets-schemas.test.ts` — strip tags, URL scheme allow-list (`javascript:` rejected), `pickAllowedFields`, required-field drops

## SC-05 Non-blocking load + collection limits
- [x] External content load does not block initial render; large collections are limited/paginated
- verify: component/perf smoke — initial paint without feed; limit/pagination test
- evidence: `updatable-modules.test.tsx` paints shell before feed resolves; `sheets-hydrate.test.ts` + card-list test enforce mapping `limit` after `sortOrder`
