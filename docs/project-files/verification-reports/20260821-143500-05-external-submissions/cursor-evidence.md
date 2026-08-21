# Cursor evidence — Slice 05 external-submissions

**Date:** 2026-08-21

## Automated

- `npm test` — 15 files, **139 passed**. Includes `submit-adapters.test.ts` (kind+submit only, https POST, redirect, mailto templates, no `localStorage`/`sessionStorage`) and `contact-form.test.tsx` (required/email validation, success, failure, mail-app handoff copy, D01 service vs mailto selection).
- `npm run lint` — oxlint clean.
- `npm run build` — `tsc -b && vite build` green; `dist/assets/index-CeUXqrAB.css`, `dist/assets/index-CMSkdbGH.js`.

## Manual / live

- Human Manual confirmation **2026-08-21**: “finish out this and the final steps.” Change checklist empty (no review defects).
- Contact example on `#/about/contact` (`ContactFormModule` + Slice 04 `contact-info`).

## Playwright / axe

Not run. `@playwright/test` is not a project dependency. Soft-skip per `.cursor/commands/v.md`. Adapter and form states asserted in Vitest.

## Links

- [closeout.md](../../../requirements/slices/05-external-submissions/success-criteria/closeout.md)
- [traceability.md](../../../requirements/slices/05-external-submissions/success-criteria/traceability.md)
- [build evidence](../../build-evidence/05-external-submissions.md)
- [as-built](../../../modules/submissions/features/external-forms/README.md)
