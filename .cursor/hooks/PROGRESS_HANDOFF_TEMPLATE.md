# Ex-React — session handoff

**Last updated:** YYYY-MM-DD (session)  
**Updated by:** _(agent or human)_  
**Repository state:** On `main`; _(one-line git summary — never full git status)_

---

## Focus

_(Current goal — one slice, bootstrap phase, or defect lane.)_

## Branch

`main` or feature branch from `.cursor/active-slice`

## Project profile (approved)

| Field | Value |
|-------|-------|
| Delivery | Static React SPA on GitHub Pages |
| UI | React website template (pages + reusable modules) |
| API | None — no custom backend |
| Owned DB | None |
| Integrations | Google Sheets (published data for updatable modules) |
| Deploy | GitHub Pages static build |

**Vision authority:** `requirements.md` until `docs/requirements/vision/` exists.

## Completed (recent)

| Item | Highlights |
|------|------------|
| _(slice or phase)_ | _(brief)_ |

## In progress

_(Active task or waiting on human.)_

## Next steps

1. _(ordered list)_

## Human setup still needed

- `npm install` / `npm run dev`
- Optional `.env.local` for Vite base path and published sheet URLs

## Open questions

| # | Question | Owner |
|---|----------|-------|

## Key paths

| What | Where |
|------|-------|
| Product requirements | `requirements.md` |
| Slice tasks | `docs/project-files/project-plan/slices/` |
| Active slice | `.cursor/active-slice` |
| Regression plan | `docs/project-files/regression/regression-plan.md` |
| Developer guide | `docs/developer.md` |

## Run locally

```powershell
npm install
npm run dev
npm test
npm run build
```

## Do not (agent rules)

- Commit unless human asks
- Commit secrets or gitignored local files
- Nest code under `docs/requirements/slices/`
- Add a custom backend or database
