# Sheets hydration (as-built)

**Module:** updatable-content  
**Feature:** sheets-hydration  
**Slice:** 04-google-sheets-updatable-content  
**Shipped:** 2026-08-21  
**Deviations:** [D01](../../../../requirements/slices/04-google-sheets-updatable-content/deviations/D01-single-spreadsheet-worksheet-routing.md) one spreadsheet + same-named tabs; [D02](../../../../requirements/slices/04-google-sheets-updatable-content/deviations/D02-text-block-single-column.md) single `text` column (superseded for row count by D03); [D03](../../../../requirements/slices/04-google-sheets-updatable-content/deviations/D03-all-modules-sheet-driven.md) export+gid reads and every valid row renders

## What it is

Selected module instances (`mode: 'updatable'`) load structured rows from a **published Google Spreadsheet**. The page paints a static shell first, then swaps in sanitized sheet data — or a `t()` fallback — without blocking first paint or crashing on bad data. There is no custom backend. Spreadsheet edit credentials are never used.

## Runtime surface

| Path | Responsibility |
|------|----------------|
| `src/modules/data-sources/feed-client/` | Never-throw CSV/JSON fetch; Google share link → CSV **export** URL by `gid` |
| `src/modules/updatable-content/sheets-hydration/schemas.ts` | Text Block, Card List, Event, Contact/Info parsers + field allow-lists |
| `src/modules/updatable-content/sheets-hydration/sanitize.ts` | Strip tags; URL scheme allow-list |
| `src/modules/updatable-content/sheets-hydration/sheet-mappings.ts` | Page → module id / tab → type → `limit` (no site spreadsheet id) |
| `src/modules/updatable-content/sheets-hydration/config.ts` | Apply `VITE_GOOGLE_SHEETS_URL` + `VITE_GOOGLE_SHEETS_GIDS` |
| `src/modules/updatable-content/sheets-hydration/hydrate.ts` | Rows → typed data or fallback; collection `limit` after `sortOrder` |
| `src/modules/updatable-content/sheets-hydration/UpdatableModule.tsx` | Hydration boundary in `ModulePipeline` |
| `src/modules/pages/modular-pages/ContactInfoModule.tsx` | Contact/Info renderer (`type: 'contact'`) |

## How it is configured

1. Commit a mapping whose `id`, `moduleId`, and worksheet `tab` share the parent module name (`sheet-mappings.ts`).
2. Set the instance to `mode: 'updatable'` with that id in `pages-config.ts`.
3. Put one public spreadsheet URL and per-tab `gid` values in `.env.local` / Actions variables. A tab with no gid stays on its shell.

See [`docs/configuration/google-sheets.md`](../../../../configuration/google-sheets.md).

## Intake (D01 + D03)

Worksheets are read from the spreadsheet **export** endpoint addressed by `gid`, not `gviz`. Export returns displayed cell text (mixed text/number columns stay intact) and answers HTTP 400 for an unknown worksheet instead of serving the first tab. `import.meta.env` must be read as that exact expression so Vite injects the URL.

## Rendering rules (D03)

- **Text:** one paragraph per valid `text` row.
- **Cards:** a row with a description and no title still renders; `subtitle` / `link` / `imageUrl` / `sortOrder` are honoured.
- **Events:** sheet-exported date formats normalize to ISO; `time` / `location` / `link` render. Demo calendar uses `layout: 'hybrid'`.
- **Contact:** `contact-info` on `#/about/contact`; `type` infers `mailto:` / `tel:` / URL or stays plain text.

Hero modules stay static (no hero schema).

## Fallback

Fetch failure, empty feed, or every row invalid maps to `updatable.fallback.*` keys via `FallbackModule`. Unknown columns are ignored; rows missing required fields are dropped.

## Out of scope

- Writing to Sheets or storing submissions (Slice 05)
- Playwright / axe CI (not in this repo; hydration covered in Vitest)

## Tests

- `tests/unit/sheets-feed-client.test.ts`
- `tests/unit/sheets-schemas.test.ts`
- `tests/unit/sheets-hydrate.test.ts`
- `tests/unit/updatable-modules.test.tsx`
