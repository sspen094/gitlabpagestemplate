# Configuration

| File | Who | Purpose |
|------|-----|---------|
| `.env.example` | committed | Documents `BASE_URL` (Vite `base` / GitHub Pages path). No secrets. |
| `.env.local` | local, gitignored | Copy of the example; set `/<repo>/` for a project Pages URL. |
| Actions variable `BASE_URL` | optional | Overrides the workflow’s derived `/<repo>/` (or `/` for a user site). |

Local run: `Copy-Item .env.example .env.local` then `npm run dev`. See the root [`README.md`](../../README.md).

**Slice 02:** page composition is code config (`pages-config.ts`), not env. No new env keys. Published sheet URLs remain Slice 04.
