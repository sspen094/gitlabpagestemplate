# Map a Google Sheets data source

One public spreadsheet feeds the whole site. Each worksheet tab feeds one module, addressed by tab name in config and by `gid` in the actual request.

The spreadsheet holds **content**, never configuration and never secrets. It is public to anyone with the link.

## 1. Create the spreadsheet

1. Create **one** Google Spreadsheet for the site.
2. Add one tab per updatable module, named exactly like the module id — the sample site uses `demo-text`, `demo-cards`, `demo-calendar`, and `contact-info`.
3. In each tab, put a header row in row 1 using that data type's column names. The full column tables are in the [editor guide](editor-google-sheets.md#3-how-a-tab-is-laid-out) — hand that page to whoever will maintain the content.
4. Fill in a couple of placeholder rows so you can see hydration working.

Fastest start: copy the [public sample spreadsheet](https://docs.google.com/spreadsheets/d/1wwsme35OY5Kdl8aeC7izcVHzGpLTjpVgJQBgqItYeNA/edit?usp=sharing) into your own Drive. Tab names and headers come with it, and the gids change — so re-read them in step 3 below.

## 2. Share it read-only

**Share → General access → Anyone with the link → Viewer**, then copy the link.

The site fetches as an anonymous visitor, so anything narrower means every section falls back to its shell. Never put edit credentials anywhere in the repo or env; the read-only public link is the entire integration.

## 3. Collect the worksheet ids

Click each tab and read `#gid=<number>` from the address bar. Note them down as `<tab>:<gid>` pairs.

A gid is required per tab, not optional. Worksheets are read through the spreadsheet's CSV **export** endpoint, which addresses tabs only by gid:

```text
https://docs.google.com/spreadsheets/d/<id>/export?format=csv&gid=<gid>
```

The name-addressed `gviz` endpoint is deliberately not used. It infers one data type per column and returns an *empty* cell for every value that disagrees — a text title in a mostly numeric column just disappears — and it answers an unknown tab name with the first worksheet instead of an error. `export` returns displayed cell text verbatim and returns 400 for an unknown worksheet.

## 4. Put the values in env

Local, in `.env.local` (copy `.env.example` if you have not yet):

```dotenv
VITE_GOOGLE_SHEETS_URL=https://docs.google.com/spreadsheets/d/<spreadsheet-id>/edit?usp=sharing
VITE_GOOGLE_SHEETS_GIDS=demo-text:0,demo-cards:567206608,demo-calendar:1398361478,contact-info:224199759
```

Restart `npm run dev` — Vite reads env at startup.

For GitHub Pages, add the same two names as repository **Actions variables** (Settings → Secrets and variables → Actions → Variables) or as `github-pages` environment variables. Vite inlines `VITE_*` during `npm run build`, so the values must be readable by the workflow's build job; setting them only in `.env.local` gets you a working local site and an unhydrated deployed one. The workflow logs each value's length and warns when one is empty.

## 5. Bind tabs to modules

Committed mappings live in `src/modules/updatable-content/sheets-hydration/sheet-mappings.ts` and carry `publishedUrl: ''`, because the URL and gids are applied from env at runtime. That split is what keeps the template itself spreadsheet-agnostic — you fork it without inheriting someone else's sheet.

The chain for one section:

```text
pages-config.ts  module id + mode: 'updatable'
      ↓ same name
sheet-mappings.ts  mapping id → type + limit
      ↓ same name
VITE_GOOGLE_SHEETS_GIDS  tab:gid
      ↓
worksheet tab in VITE_GOOGLE_SHEETS_URL
```

Adding a section to that chain is [Configure an updatable section](updatable-section.md).

## 6. Verify

```powershell
npm run dev
```

Load a page with a sheet-backed section. Shell copy appears first, then sheet rows.

| Symptom | Cause |
|---------|-------|
| Nothing hydrates anywhere | `VITE_GOOGLE_SHEETS_URL` missing or unparseable; dev server not restarted |
| One section stays on shell copy | No gid for that tab, or the tab was renamed |
| Fallback message | Sheet reachable but empty, or every row missing a required field |
| Works locally, not on Pages | Env set in `.env.local` only — add the Actions variables |
| Some rows missing | Those rows lack a required field, or the list hit the mapping's `limit` |

Browser devtools → Network shows the resolved `export?format=csv&gid=…` request, which is the quickest way to tell a config problem (no request) from a sharing problem (request returns an error).

## Other feed sources

A module can point at a non-Google published CSV or JSON feed with an inline `dataSource` on the instance, which takes priority over the committed mapping:

```ts
dataSource: { kind: 'sheets', publishedUrl: 'https://example.test/events.json' }
```

Set `config.format: 'json'` for JSON. Non-Google URLs are requested unchanged, and the same schemas, sanitization, and fallbacks apply.

## Related

- [`configuration/google-sheets.md`](../configuration/google-sheets.md) — condensed env and mapping reference
- [Configure an updatable section](updatable-section.md) — the module-side wiring
- [Update content with Google Sheets](editor-google-sheets.md) — the editor-facing guide
