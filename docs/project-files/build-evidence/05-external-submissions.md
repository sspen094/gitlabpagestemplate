# Build evidence — Slice 05 external-submissions

**Date:** 2026-08-21  
**Branch:** `05-external-submissions`

## Commands

```powershell
npm test
npm run lint
npm run build
```

## Results (closeout)

- `npm test` — Vitest 15 files, **139 passed** (2026-08-21 14:33 local). Includes `submit-adapters.test.ts` (adapter-only, no storage, mailto templates) and `contact-form.test.tsx` (validation, success, failure, handoff, D01 adapter selection).
- `npm run lint` — oxlint clean.
- `npm run build` — static `dist/` (`index.html`, `dist/assets/index-CeUXqrAB.css`, `dist/assets/index-CMSkdbGH.js`). No server runtime. Closeout also typed `location.assign` so `tsc -b` succeeds.
- UI smoke — Contact lives on `#/about/contact`. Playwright **N/A**: `@playwright/test` is not a project dependency (same as Slices 00–04). Form states asserted in Vitest.
- Human Manual confirmation **2026-08-21** — “finish out this and the final steps.”

## Artifact shape

Same static Pages output as prior slices. Submit endpoints and mail templates from public `VITE_SUBMIT_*` env; adapters in `src/modules/submissions/external-forms/`.
