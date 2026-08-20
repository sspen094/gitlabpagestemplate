# Success criteria — Slice 00 app-scaffold-and-deploy

Evaluated at Final. Each SC maps to an acceptance criterion in the slice requirements.

## SC-01 Static build deployable to GitHub Pages
- [x] `npm run build` emits static assets only that can be served on GitHub Pages — **2026-08-20**
- verify: run `npm run build`; inspect `dist/` output and asset paths
- evidence: `docs/project-files/build-evidence/00-app-scaffold-and-deploy.md`; `tests/unit/static-build.test.ts`; Pages workflow publishes `dist/`

## SC-02 Configurable base path for forks
- [x] Base path is set from a single config/env source and produces correct asset URLs for `/<repo>/` — **2026-08-20**
- verify: build with a sample base path; confirm generated asset URLs
- evidence: `.env.example` `BASE_URL`; `vite.base.ts`; workflow Resolve base path; `tests/unit/vite-base.test.ts` + `static-build.test.ts`

## SC-03 App shell renders without external data
- [x] Placeholder landing view mounts and renders with no external data source configured — **2026-08-20**
- verify: component/render smoke test; `npm run dev` manual load
- evidence: `tests/unit/app-shell.test.tsx`; human Phase 2 confirmation

## SC-04 Dev/build/test scripts run green
- [x] `npm run dev`, `npm run build`, and `npm test` succeed on a clean checkout — **2026-08-20**
- verify: run each script; CI job green
- evidence: `package.json` scripts; workflow `npm test` + `npm run build`; closeout execution of `npm test` and `npm run build`
