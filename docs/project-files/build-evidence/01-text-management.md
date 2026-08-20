# Build evidence — Slice 01 text-management

**Date:** 2026-08-20  
**Branch:** `01-text-management`

## Commands

```powershell
npm test
npm run build
```

## Results (closeout)

- `npm test` — Vitest 4 files, **15 passed** (2026-08-20 14:11 local). Covers `vite-base`, `app-shell` (reads `defaultText`), `static-build`, and `t-lookup` (known keys, fallback, alternate set).
- `npm run build` — static `dist/` (`index.html`, `dist/assets/index-DUEceW5r.css`, `dist/assets/index-B5T58tI2.js`). No server runtime.
- Manual: human confirmed copy edits in `text-config.ts` on local `http://127.0.0.1:5173/` (brand **MY APP**). Live GitHub Pages still shows the previous deploy until this branch is pushed.

## Artifact shape

Same static Pages output as Slice 00. Shell strings are bundled from `src/modules/text/t-lookup/text-config.ts`.
