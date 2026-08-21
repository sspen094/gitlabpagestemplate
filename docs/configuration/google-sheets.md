# Google Sheets published data

How this template binds updatable modules to one public spreadsheet. Editor-facing column formats also live in the root [`README.md`](../../README.md#google-sheets-updatable-content).

## Mapping model

```text
page (pages-config) → module instance id
                   → worksheet tab (same name)
                   → schema type (text-block | card-list | event-list | contact-info)
                   → collection limit
```

Committed mappings: `src/modules/updatable-content/sheets-hydration/sheet-mappings.ts`.

Site-specific values stay in env:

| Variable | Purpose |
|----------|---------|
| `VITE_GOOGLE_SHEETS_URL` | One public, read-only spreadsheet share URL |
| `VITE_GOOGLE_SHEETS_GIDS` | Comma-separated `<tab>:<gid>` pairs |

A Google worksheet is addressed only by `gid`. Without a gid for that tab, the module keeps its static shell so the client never silently reads the first worksheet.

## Published-feed setup

1. Share the spreadsheet as **Anyone with the link → Viewer**.
2. Copy each tab's `#gid=` from the address bar.
3. Local: `.env.local` (from `.env.example`), then restart `npm run dev`.
4. Pages: Actions variables with the same names. Vite embeds them at **build** time.

Requests go to `/spreadsheets/d/<id>/export?format=csv&gid=<gid>`, not `gviz`. Non-Google published CSV/JSON URLs still work if supplied as an inline `dataSource`.

## Adding an updatable module

1. Same id for the page instance, mapping, and worksheet tab.
2. `mode: 'updatable'` in `pages-config.ts`.
3. Mapping `type` matching the module (`text` → `text-block`, `card-list` → `card-list`, `calendar` → `event-list`, `contact` → `contact-info`).
4. Add the tab's gid to `VITE_GOOGLE_SHEETS_GIDS`.
