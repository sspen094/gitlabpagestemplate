# Slice 00 — app-scaffold-and-deploy (requirements)

**Status:** Approved (plan) — 2026-08-20
**Owner:** Template maintainer  
**Last updated:** 2026-08-20  
**Slice id:** 00  
**Module(s):** platform / app-shell  
**Primary feature name (code):** app-scaffold  
**Feature folders touched:** `src/` (app entry, shell), repo root config, CI workflow  
**Target database (intent):** N/A — static site; no owned app DB  
**Runtime database (if different):** N/A

Human-authored outcome-focused requirements. Traces to product [`requirements.md`](../../requirements.md) §3, §6.1, §14, §16.

---

## Objective

Stand up a Vite + React single-page app that builds to static assets and deploys to GitHub Pages, so the template can be forked and hosted for free without any server runtime.

## Scope

### In scope

- Vite + React app scaffold with a minimal app shell/landing placeholder.
- Configurable base path for GitHub Pages (via Vite `base` / env), so a fork works under `https://<user>.github.io/<repo>/`.
- npm scripts: `dev`, `build`, `test`, `preview`.
- Static build output suitable for GitHub Pages (assets only).
- GitHub Pages deployment workflow (GitHub Actions) or documented manual deploy.
- App shell renders correctly even with no external data available.

### Out of scope

- Text lookup system (Slice 01), modules (Slice 02), navigation (Slice 03).
- Google Sheets integration (Slice 04), submission forms (Slice 05).
- Real organization content and full demo pages (Slice 06).

## Users and workflows

Developer forks the repo, sets the base path for their Pages URL, runs `npm install` + `npm run dev` to develop, and `npm run build` to produce a deployable static bundle that CI publishes to GitHub Pages.

## Functional requirements

1. `npm install`, `npm run dev`, and `npm run build` succeed on a clean checkout.
2. `npm run build` emits static assets only (no server runtime required to serve them).
3. The GitHub Pages base path is configurable without editing many files (single env/config source).
4. The app shell renders a placeholder landing view with no dependency on external data.
5. Deployment to GitHub Pages is automated via a workflow or clearly documented.

## UI and navigation

- **Nav section:** N/A this slice (full nav in Slice 03).
- **Page purpose:** Minimal landing/app-shell placeholder proving the build renders.
- **Route(s):** `/` under the configured base path.
- **Layout mockups:** N/A — placeholder shell only.

## Data and integrations

- **Target database (intent):** N/A — static site.
- **Reads / external:** None this slice.
- **External APIs:** None this slice.

## Non-functional requirements

- No custom backend, SSR, or database.
- Base path / config centralized; no secrets committed.
- Fast static first paint.

## Dependencies

- **Other slices:** none (foundation slice).
- **Platform:** Node/npm toolchain; GitHub Pages hosting for a fork.

## Acceptance criteria

1. A React site builds and can be deployed to GitHub Pages as static output only.
2. The Pages base path is configurable for a forked repository via a single config/env source.
3. The dev server runs and the app shell renders a placeholder without any external data.
4. `npm run build` and the test runner complete successfully on a clean checkout.

## Success criteria

Create `success-criteria/` — see [closeout.md](success-criteria/closeout.md) and [traceability.md](success-criteria/traceability.md).

| Id | Title | Maps to acceptance # |
|----|-------|----------------------|
| SC-01 | Static build deployable to GitHub Pages | 1 |
| SC-02 | Configurable base path for forks | 2 |
| SC-03 | App shell renders without external data | 3 |
| SC-04 | Dev/build/test scripts run green | 4 |

## Testing and verification

**Regression intent:**

- Build produces a static `dist/` bundle with correct base path (smoke).
- App shell mounts and renders placeholder (component smoke).
- `npm run build` succeeds in CI.

## Open questions

| # | Question | Status |
|---|----------|--------|
| Q1 | Deploy via GitHub Actions Pages workflow or `gh-pages` branch? | Open |
| Q2 | Confirm the target Pages repo/path for the reference deployment. | Open |
