# Cursor evidence — Slice 01 text-management

**Date:** 2026-08-20

## Automated

- `npm test` — 4 files, 15 passed. Includes `tests/unit/t-lookup.test.tsx` (known keys, unknown-key echo, placeholder mode, `createT` / `setActiveTextTree` / `TextProvider`) and `tests/unit/app-shell.test.tsx` (shell copy from `defaultText`).
- `npm run build` — static `dist/` only.

## Manual / live

- Human edited `text-config.ts` (`home.header.brand` → MY APP, `home.hero.title` → My Website Template).
- Local Vite `http://127.0.0.1:5173/` showed the new strings. Tab pointed at GitHub Pages still showed the old deploy (expected until push).
- Human approved Phase 2 and the slice **2026-08-20**.

## Links

- [closeout.md](../../../requirements/slices/01-text-management/success-criteria/closeout.md)
- [traceability.md](../../../requirements/slices/01-text-management/success-criteria/traceability.md)
- [build evidence](../../build-evidence/01-text-management.md)
