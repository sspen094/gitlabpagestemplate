# Ex-React

Static React website template for GitHub Pages. Selected page content can later be updated from published Google Sheets. There is no custom backend or database.

## Local development

```powershell
Copy-Item .env.example .env.local
npm install
npm run dev
```

`npm run build` writes static files to `dist/`. `npm test` runs the unit suite.

**Site copy:** edit strings in `src/modules/text/t-lookup/text-config.ts`.

**Pages:** add or reorder modules in `src/modules/pages/modular-pages/pages-config.ts`. Hash routes: `#/` (home), `#/demo` (one sheet-driven example of each updatable type), `#/about/contact` (contact details from a sheet), plus About/Members heroes for the navbar.

**Nav:** add items in `src/modules/navigation/navbar/nav-config.ts`. Labels live under `nav.*` in `text-config.ts`.

## Google Sheets updatable content

Selected modules can render from a **published Google Sheet** instead of static config. Content loads after first paint (the page never blocks on the network) and falls back to safe placeholder copy if a sheet is missing, unreachable, or malformed. Data is treated as structured text — markup is stripped and unsafe links are rejected.

### 1. Set up a sheet

1. Create **one Google Spreadsheet** for the site.
2. Add one worksheet tab per updatable parent module. The tab name matches the module id:
   - `demo-text` — every row becomes a paragraph of the text block.
   - `demo-cards` — every row is a card.
   - `demo-calendar` — every row is an event.
   - `contact-info` — every row is a contact line on the Contact page.
3. In each tab, put one **header row** in row 1 using the fields for that data type (see below). Each following row is one item.
4. Use **Share → General access → Anyone with the link → Viewer**, then copy the spreadsheet link. It is public and read-only; never provide edit credentials.
5. Open each tab and copy the `gid=` number from the address bar — the worksheet id.
6. Put the link and the worksheet ids in `.env.local` (copied from `.env.example`):

```dotenv
VITE_GOOGLE_SHEETS_URL=https://docs.google.com/spreadsheets/d/<spreadsheet-id>/edit?usp=sharing
VITE_GOOGLE_SHEETS_GIDS=demo-text:0,demo-cards:123456789,demo-calendar:987654321,contact-info:456789123
```

7. Restart `npm run dev` (or rebuild). A tab with no URL or no gid keeps its static shell.

Mappings (website page → parent module/worksheet → type → limit) are committed in `src/modules/updatable-content/sheets-hydration/sheet-mappings.ts`; the spreadsheet id and gids stay in env so the template itself is site-agnostic. To make a new module updatable, give its worksheet and module the same id, add that mapping, set the module instance to `mode: 'updatable'` in `pages-config.ts`, and add the tab's gid.

**Why the gid is needed.** Worksheets are read through the spreadsheet's CSV **export** endpoint, which returns each cell exactly as displayed. The name-addressed `gviz` endpoint is deliberately not used: it guesses one data type per column and returns an *empty* cell for every value that disagrees with it (a text title in a mostly numeric column silently disappears), and it answers an unknown tab name with the first worksheet instead of an error.

### 2. Column formats per type

Columns are matched by header name; **unknown columns are ignored** and rows missing a required field are dropped. `*` marks required.

**Text Block** (`text-block`) — one column, one paragraph per row:

| Column | Required | Notes |
|--------|----------|-------|
| `text` | * | Multi-line allowed; each row renders as its own paragraph |

**Card List** (`card-list`) — one row per card:

| Column | Required | Notes |
|--------|----------|-------|
| `title` | * | Card heading — optional if `description` is filled in |
| `subtitle` | | Shown under the heading |
| `description` | | Card body text |
| `link` | | `http(s)`, `mailto:`, `tel:`, or site-relative; bare domains become `https://` |
| `imageUrl` | | Same URL rules as `link`; rendered above the heading |
| `sortOrder` | | Non-negative integer; cards sort ascending, unordered rows last |

**Event / Calendar** (`event-list`) — one row per event:

| Column | Required | Notes |
|--------|----------|-------|
| `title` | * | |
| `date` | * | `2026-09-01`, `9/1/2026`, or `Sep 1, 2026`; slash dates read as month/day unless the first part is above 12 |
| `time` | | Shown beside the date |
| `location` | | |
| `description` | | |
| `link` | | Same URL rules as above |

**Contact / Info** (`contact-info`) — one row per entry:

| Column | Required | Notes |
|--------|----------|-------|
| `label` | * | |
| `value` | * | |
| `type` | | `email`, `phone`, `url`, or `plain` (inferred from `value` when omitted) |

Large collections are capped by the mapping's `limit`.

## Base path (forks)

Vite `base` comes from a single value: **`BASE_URL`**.

| Hosting | Example URL | `BASE_URL` |
|---------|-------------|------------|
| Local or user site | `https://<user>.github.io/` | `/` |
| Project site | `https://<user>.github.io/<repo>/` | `/<repo>/` |

**Local:** copy `.env.example` to `.env.local` (gitignored) and set `BASE_URL`.

**GitHub Actions:** nothing to set. The workflow derives the base from the repository name (`/<repo>/`, or `/` for a `<user>.github.io` repo). To override it, add an Actions variable `BASE_URL` under Settings → Secrets and variables → Actions → Variables.

For live Google Sheets content, also add Actions variables named `VITE_GOOGLE_SHEETS_URL` and `VITE_GOOGLE_SHEETS_GIDS`. Vite embeds these public values during the static production build.

## Deploy to GitHub Pages

1. Merge to `main` (or run the **Deploy GitHub Pages** workflow from the Actions tab).
2. Repo Settings → Pages → Source: **GitHub Actions**.
3. The workflow runs `npm ci`, `npm test`, and `npm run build`, then publishes `dist/`.

If the deployed page is blank, check the browser console for 404s on `/assets/...`: that means the build base path does not match the Pages URL. The **Resolve base path** step in the workflow log prints the base it used.

The workflow file is `.github/workflows/pages.yml`.
