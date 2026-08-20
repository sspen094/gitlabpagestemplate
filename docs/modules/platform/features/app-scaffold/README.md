# App scaffold (as-built)

**Module:** platform  
**Feature:** app-scaffold  
**Slice:** 00-app-scaffold-and-deploy  
**Shipped:** 2026-08-20

## What it is

A Vite + React (TypeScript) SPA at the repository root that builds to static files and deploys to GitHub Pages. The landing view is a placeholder app shell with no external data.

## Runtime surface

| Path | Responsibility |
|------|----------------|
| `index.html` + `src/main.tsx` | Browser bootstrap |
| `src/App.tsx` | Placeholder shell (brand + heading + copy) |
| `vite.config.ts` + `vite.base.ts` | Vite `base` from `BASE_URL` |
| `.env.example` | Documents `BASE_URL` (copy to `.env.local`) |
| `.github/workflows/pages.yml` | CI: `npm ci`, `npm test`, `npm run build`, Pages deploy |

## Configuration

- **Local:** `BASE_URL` in `.env.local` (from `.env.example`). Default `/`.
- **CI:** workflow **Resolve base path** sets `/<repo>/` for project sites, `/` for `<user>.github.io` repos. Optional Actions variable `BASE_URL` overrides.

## Out of scope (later slices)

Page modules, navigation, Google Sheets, submission forms, demo content.

Shell copy is now resolved via Slice 01 `t()` — see [t-lookup](../../../text/features/t-lookup/README.md).

## Tests

- `tests/unit/vite-base.test.ts` — `normalizePagesBase`
- `tests/unit/app-shell.test.tsx` — shell render, no data client
- `tests/unit/static-build.test.ts` — Vite emit with sample `BASE_URL`
