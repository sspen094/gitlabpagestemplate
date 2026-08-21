# Slice 04 — google-sheets-updatable-content (requirements)

**Status:** Shipped — 2026-08-21  
**Owner:** Template maintainer  
**Last updated:** 2026-08-21  
**Slice id:** 04  
**Module(s):** updatable-content, data-sources  
**Primary feature name (code):** sheets-hydration  
**Feature folders touched:** `src/` (data source client, schemas, updatable module wiring, fallback/sanitize)  
**Target database (intent):** N/A — Google Sheets is read-only published data, not an owned app DB  
**Runtime database (if different):** N/A

Traces to product [`requirements.md`](../../requirements.md) §6.2, §6.3, §7.2, §7.5, §8, §10, §11.

---

## Objective

Let selected module instances be "updatable" by reading structured content from Google Sheets published data (stable CSV/JSON), so non-technical editors can update approved sections without touching code — while the site keeps rendering safely if the external source fails.

## Scope

### In scope

- Mark module instances as `updatable` and bind them to a data source.
- Explicit mapping per updatable module: page → section/module → sheet/worksheet/named range → data type.
- Load from a **stable published format** (published CSV/JSON), not scraping of the spreadsheet UI.
- Defined schemas for each updatable data type: Text Block, Card List, Event/Calendar item, Contact/Info entry.
- Validation + sanitization: constrain to approved fields/formats; ignore/withhold invalid rows.
- Graceful fallback: missing/malformed/unavailable data renders a safe fallback; layout never breaks.
- Performance: external fetch does not block initial render; large collections are limited/paginated.

### Out of scope

- Editor-facing submission forms (Slice 05).
- Writing back to Sheets (read-only only).
- The full demo assembly + editor how-to guide (Slice 06) — this slice ships the mechanism + at least the required example sections.

## Users and workflows

A content editor updates an approved Google Sheet (a tab/range mapped to a website section). On next load/sync, the updatable module reflects the change. If the sheet is unreachable or a row is malformed, the visitor still sees a working page with fallback content.

## Functional requirements

1. A module instance can be marked `updatable` and bound to a Google Sheets-linked data source.
2. Each updatable module has an explicit mapping: page, section/module, sheet + worksheet/range, expected data type.
3. Content loads from a stable published data format (CSV/JSON), not fragile UI scraping.
4. Each updatable data type has a defined schema:
   - **Text Block:** title, body, optional last-updated
   - **Card List:** rows → cards (title, subtitle, description, link, optional image URL, optional sort order)
   - **Event/Calendar:** title, date, optional time/location/description/external link
   - **Contact/Info:** label, value, optional type (email/phone/URL/plain)
5. Invalid/incomplete data must not break rendering; malformed rows are dropped/fallback applied.
6. External content is validated and sanitized to approved fields/formats before render (no raw injection).
7. External content loading must not noticeably block initial render; large collections are limited or paginated.

## UI and navigation

- **Page purpose:** Demonstrate updatable modules on example page(s) — at least one text block, one card list, one event/calendar section.
- **User-visible behaviors:** Live-updated content when the sheet changes; safe fallback (placeholder / last-known / empty state) on failure.

## Data and integrations

- **Reads / external:** Google Sheets published CSV/JSON (read-only). Public published URLs may live in committed non-secret config; no edit credentials in the repo.
- **Stability:** depend on a controlled published representation, not the spreadsheet UI.

## Non-functional requirements

- Static-first, externally hydrated where approved; site renders without the external source.
- Sanitize/constrain content; treat sheet data as structured content, not freeform HTML.
- Minimize manual maintenance of integration points (config-driven mappings).

## Dependencies

- **Other slices:** Slice 02 (module system + `updatable` mode + data source ref in the definition model), Slice 01 (`t()` for fallback copy).

## Acceptance criteria

1. At least one text block, one card list, and one event/calendar section can be driven from Google Sheets-linked data.
2. Each updatable data type has a defined schema and an explicit page→section→sheet/range mapping.
3. If the external update source fails or returns malformed data, the site still renders without crashing (safe fallback).
4. External content is validated/sanitized to approved fields and formats before rendering.
5. External content loading does not block initial render; large collections are limited or paginated.

## Success criteria

See [closeout.md](success-criteria/closeout.md) and [traceability.md](success-criteria/traceability.md).

| Id | Title | Maps to acceptance # |
|----|-------|----------------------|
| SC-01 | Text + card list + event sections driven from Sheets | 1 |
| SC-02 | Schemas + explicit mappings per updatable type | 2 |
| SC-03 | Graceful fallback on failure/malformed data | 3 |
| SC-04 | Validation + sanitization of external content | 4 |
| SC-05 | Non-blocking load + collection limits | 5 |

## Testing and verification

**Regression intent:**

- Parser/loader converts published CSV/JSON into each schema (unit, with fixtures).
- Malformed/missing feed → fallback renders, no crash (unit/component).
- Sanitization strips/escapes disallowed content (unit).
- Updatable text/card/event modules render from fixture data (component).
- Load does not block first paint; collection limit/pagination enforced (component/perf smoke).

## Open questions

| # | Question | Status |
|---|----------|--------|
| Q1 | One sheet for all sections, or one sheet per section? (§17) | Open |
| Q2 | Updates on every load, or scheduled/build-time sync? (§17) | Open |
| Q3 | Preferred max cards/events per section? (§17) | Open |
| Q4 | Auto-expire past events from display? (§17) | Open |
