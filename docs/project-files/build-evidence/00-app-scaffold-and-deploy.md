# Build evidence — Slice 00 app-scaffold-and-deploy

**Date:** 2026-08-20  
**Branch:** `00-app-scaffold-and-deploy`

## Commands

```powershell
npm test
npm run build
```

## Results (closeout)

- `npm test` — Vitest unit suite: `vite-base`, `app-shell`, `static-build`.
- `npm run build` — static `dist/` (HTML, CSS, JS, assets). No server runtime.
- Live Pages: `https://sspen094.github.io/gitlabpagestemplate/` — first deploy blank (JS 404 at `/assets/…`); workflow now derives `/<repo>/`. Human approved the phase and slice after the fix.

## Artifact shape

`dist/index.html` plus hashed files under `dist/assets/`. With `BASE_URL=/<repo>/`, script `src` is `/<repo>/assets/…`.
