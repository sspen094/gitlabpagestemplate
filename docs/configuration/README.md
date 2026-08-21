# Configuration

| File | Who | Purpose |
|------|-----|---------|
| `.env.example` | committed | Documents `BASE_URL`, `VITE_GOOGLE_SHEETS_URL`, and `VITE_GOOGLE_SHEETS_GIDS`. No secrets. |
| `.env.local` | local, gitignored | Copy of the example; set the Pages path, public spreadsheet link, and worksheet gids. |
| Actions variable `BASE_URL` | optional | Overrides the workflow’s derived `/<repo>/` (or `/` for a user site). |
| Actions variable `VITE_GOOGLE_SHEETS_URL` | optional | Supplies the public spreadsheet link to the production build. |
| Actions variable `VITE_GOOGLE_SHEETS_GIDS` | optional | Supplies `<tab>:<gid>` pairs to the production build. |

Local run: `Copy-Item .env.example .env.local` then `npm run dev`. See the root [`README.md`](../../README.md).

**Slice 02:** page composition is code config (`pages-config.ts`), not env.

**Slice 03:** nav is code config (`nav-config.ts`) plus `t()` labels. No new env keys.

**Slice 04:** published Sheets intake — see [google-sheets.md](google-sheets.md).
