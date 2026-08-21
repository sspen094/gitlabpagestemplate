# Build evidence — Slice 06 demo-site-and-docs

**Date:** 2026-08-21  
**Branch:** `06-demo-site-and-docs`

## Commands

```powershell
npm test
npm run lint
npm run build
```

## Results (closeout)

- `npm test` — Vitest 18 files, **159 passed** (2026-08-21). Includes `demo-site.test.ts`, `site-theme.test.tsx`, `module-style.test.tsx`, updated mobile quality gate.
- `npm run lint` — oxlint clean.
- `npm run build` — static `dist/` (`dist/assets/index-KrylPnyn.css`, `dist/assets/index-CRsFgoPQ.js`).
- UI smoke — Playwright **N/A**: `@playwright/test` is not a project dependency (same as Slices 00–05). Demo routes and style/theme behavior asserted in Vitest. Human visual review of phases 2–3 at both breakpoints in both palettes **2026-08-21**.
- Human Manual confirmation **2026-08-21** — “do a very quick final closeout.”

## Artifact shape

Sample pages in `pages-config.ts`; theme in `src/modules/theme/site-theme/`; style vocabulary in `modular-pages/style.ts`; guides under `docs/guides/`.
