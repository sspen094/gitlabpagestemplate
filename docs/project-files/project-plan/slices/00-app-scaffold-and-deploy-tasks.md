# Slice 00 — app-scaffold-and-deploy (tasks)

**Requirements:** `docs/requirements/slices/00-app-scaffold-and-deploy/00-app-scaffold-and-deploy-requirements.md`  
**Last synced:** 2026-08-20  
**Status:** shipped — 2026-08-20

Executable task list for this vertical slice. Synced from human requirements. Plan approved; implementation proceeds via `/start-phase`.

## Acceptance criteria map (required at task sync)

| # | Summary | Primary phase | SC-xx |
|---|---------|---------------|-------|
| 1 | Static build deployable to GitHub Pages | 1 | SC-01 |
| 2 | Configurable Pages base path for forks | 1 | SC-02 |
| 3 | App shell renders without external data | 2 | SC-03 |
| 4 | dev/build/test scripts run green | 3 | SC-04 |

## Task conventions

| Marker | Meaning |
|--------|---------|
| `- [x] … — **YYYY-MM-DD**` | Complete; date is completion day |
| `- [ ] …` | Not started or in progress |
| `- [ ] …` + indented `- **Note:** …` | Skipped, modified, or partial |

---

## Phase 1 — Scaffold & build config

- [x] Scaffold a Vite + React app (`src/`, entry, `index.html`) at repo root — **2026-08-20** Vite + React TS at repo root; human confirmed `npm run dev`
- [x] Add `package.json` scripts: `dev`, `build`, `preview`, `test` — **2026-08-20** `vitest run`; `npm test` 3 passed
- [x] Configure Vite `base` from a single env/config source (`.env.example` → `.env.local`) for GitHub Pages path — **2026-08-20** `BASE_URL` → `normalizePagesBase` in Vite config
- [x] Add `.env.example` documenting `BASE_URL` / Pages path (no secrets) — **2026-08-20** committed example; `.env.local` gitignored
- [x] Confirm `npm run build` emits static assets only into `dist/` — **2026-08-20** HTML/CSS/JS/images only; sample `BASE_URL=/ex-react/` in asset URLs

## Phase 2 — App shell

- [x] Implement a minimal app shell / placeholder landing view with no external-data dependency — **2026-08-20** static Ex-React landing in `src/App.tsx`; no fetch
- [x] Ensure the shell renders when no data source is configured (graceful default) — **2026-08-20** human confirmed `/` with no Sheets/data env

## Phase 3 — Deploy & CI

- [x] Add a GitHub Pages deploy workflow (GitHub Actions) or document the manual deploy path — **2026-08-20** `.github/workflows/pages.yml`; derives `/<repo>/`
- [x] Add a base fork/README note: how to set the base path and deploy a fork — **2026-08-20** root `README.md`
- [x] Confirm `npm run build` runs in the workflow — **2026-08-20** workflow Build step; human approved live Pages after blank-page fix

---

## Manual confirmation phase (required before Final)

Insert after implementation phases and before Final. Do not start Final until this phase is complete.

### Change checklist

- [x] Deployed Pages showed an empty page (JS 404 at `/assets/…` instead of `/<repo>/assets/…`) — **2026-08-20**
  - **Note:** Workflow Resolve base path now sets `/<repo>/` (optional `BASE_URL` override). Human approved after re-deploy.

### Phase closeout

- [x] Walk the change checklist with the human (every item checked, N/A, or carried forward) — **2026-08-20**
- [x] Human verbal confirmation recorded — slice ready for Final phase — **2026-08-20**
  - **Note:** Human: “This phase and this slice is approved.”

---

## Final phase — Documentation, tests, and verification (required)

### Documentation

- [x] As-built doc in `docs/modules/platform/features/app-scaffold/` — **2026-08-20**
- [x] Build evidence in `docs/project-files/build-evidence/` — **2026-08-20** `00-app-scaffold-and-deploy.md`
- [x] Update `docs/product-manager-agent/implementation-catalog.md` (scaffold + deploy shipped) — **2026-08-20**
- [x] **Project-wide documentation update** (mandatory) — walk `docs/README.md` and affected layer hubs (`architecture/`, `configuration/`, `requirements/`, `testing/`); update map/hub tables so the overall docs tree reflects the scaffold — **2026-08-20** created map + hubs + `implemented-design/` + module index

### Success criteria

- [x] Complete `success-criteria/closeout.md` — SC-01..SC-04 with `verify:` links — **2026-08-20**
- [x] Update `success-criteria/traceability.md` — Result PASS/FAIL/N/A + evidence — **2026-08-20** all PASS
- [x] Evaluate SC-xx; record in verification report — **2026-08-20** `docs/project-files/verification-reports/20260820-153300-00-app-scaffold-and-deploy/`

### Regression tests (executable — required)

- [x] **Create** — build smoke (static output + base path) and app-shell render smoke in canonical `tests/` paths — **2026-08-20** `static-build.test.ts`, `app-shell.test.tsx`
- [x] **Register** — add rows to `docs/project-files/regression/regression-plan.md` — **2026-08-20** R-00 / U-00
- [x] **SCAFFOLD** — update `tests/SCAFFOLD.md`: Planned → Populated — **2026-08-20** unit + README
- [x] **Execute** — `npm test` — **2026-08-20** 5 passed
- [x] **Execute** — `npm run build` before merge — **2026-08-20** green

---

## Links

- Documentation map: `docs/README.md`
- Regression plan: `docs/project-files/regression/regression-plan.md`
- Test scaffold: `tests/SCAFFOLD.md`
