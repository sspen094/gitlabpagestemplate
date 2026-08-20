# Slice 00 — app-scaffold-and-deploy (tasks)

**Requirements:** `docs/requirements/slices/00-app-scaffold-and-deploy/00-app-scaffold-and-deploy-requirements.md`  
**Last synced:** 2026-08-20

Executable task list for this vertical slice. Synced from human requirements. Do not start implementation until the human approves this file and `success-criteria/traceability.md`.

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

- [ ] Scaffold a Vite + React app (`src/`, entry, `index.html`) at repo root
- [ ] Add `package.json` scripts: `dev`, `build`, `preview`, `test`
- [ ] Configure Vite `base` from a single env/config source (`.env.example` → `.env.local`) for GitHub Pages path
- [ ] Add `.env.example` documenting `BASE_URL` / Pages path (no secrets)
- [ ] Confirm `npm run build` emits static assets only into `dist/`

## Phase 2 — App shell

- [ ] Implement a minimal app shell / placeholder landing view with no external-data dependency
- [ ] Ensure the shell renders when no data source is configured (graceful default)

## Phase 3 — Deploy & CI

- [ ] Add a GitHub Pages deploy workflow (GitHub Actions) or document the manual deploy path
- [ ] Add a base fork/README note: how to set the base path and deploy a fork
- [ ] Confirm `npm run build` runs in the workflow

---

## Manual confirmation phase (required before Final)

Insert after implementation phases and before Final. Do not start Final until this phase is complete.

### Change checklist

_Add items here as the human requests changes during this phase. Empty at task sync is normal._

- [ ] _(none yet — populated during Manual confirmation)_

### Phase closeout

- [ ] Walk the change checklist with the human (every item checked, N/A, or carried forward)
- [ ] Human verbal confirmation recorded — slice ready for Final phase — **Note:** _date + paraphrase_

---

## Final phase — Documentation, tests, and verification (required)

### Documentation

- [ ] As-built doc in `docs/modules/platform/features/app-scaffold/`
- [ ] Build evidence in `docs/project-files/build-evidence/`
- [ ] Update `docs/product-manager-agent/implementation-catalog.md` (scaffold + deploy shipped)
- [ ] **Project-wide documentation update** (mandatory) — walk `docs/README.md` and affected layer hubs (`architecture/`, `configuration/`, `requirements/`, `testing/`); update map/hub tables so the overall docs tree reflects the scaffold

### Success criteria

- [ ] Complete `success-criteria/closeout.md` — SC-01..SC-04 with `verify:` links
- [ ] Update `success-criteria/traceability.md` — Result PASS/FAIL/N/A + evidence
- [ ] Evaluate SC-xx; record in verification report

### Regression tests (executable — required)

- [ ] **Create** — build smoke (static output + base path) and app-shell render smoke in canonical `tests/` paths
- [ ] **Register** — add rows to `docs/project-files/regression/regression-plan.md`
- [ ] **SCAFFOLD** — update `tests/SCAFFOLD.md`: Planned → Populated
- [ ] **Execute** — `npm test`
- [ ] **Execute** — `npm run build` before merge

---

## Links

- Documentation map: `docs/README.md`
- Regression plan: `docs/project-files/regression/regression-plan.md`
- Test scaffold: `tests/SCAFFOLD.md`
