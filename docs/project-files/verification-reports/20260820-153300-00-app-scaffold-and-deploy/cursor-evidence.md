# Cursor evidence — Slice 00 app-scaffold-and-deploy

**Date:** 2026-08-20

## Automated

- `npm test` — unit tests for `normalizePagesBase`, app-shell render, Vite output with `BASE_URL=/smoke-repo/`.
- `npm run build` — `dist/` static only.
- Workflow `.github/workflows/pages.yml` runs `npm test` and `npm run build`.

## Manual / live

- Human confirmed local `npm run dev` placeholder shell (Phase 2).
- Human confirmed GitHub Pages deploy after base-path fix (Phase 3 / slice approval 2026-08-20).
- Network probe on first deploy: HTML 200, `/assets/*.js` 404, `/gitlabpagestemplate/assets/*.js` 200.

## Links

- [closeout.md](../../../requirements/slices/00-app-scaffold-and-deploy/success-criteria/closeout.md)
- [traceability.md](../../../requirements/slices/00-app-scaffold-and-deploy/success-criteria/traceability.md)
- [build evidence](../../build-evidence/00-app-scaffold-and-deploy.md)
