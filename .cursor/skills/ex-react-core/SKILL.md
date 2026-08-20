---
name: ex-react-core
description: Ex-React repo layout, slice build loop, env policy, docs lifecycle, and HANDOFF. Use for every build chat, slice implementation, bootstrap follow-up, or when navigating modules, tests, pages, or requirements paths.
---

# Ex-React core skill

Primary agent guide for this React GitHub Pages template. Read after `HANDOFF.md`, `.cursor/active-slice`, and [`AGENTS.md`](../../AGENTS.md).

## Authority order

1. [`docs/requirements/requirements.md`](../../../docs/requirements/requirements.md) — product requirements (until vision docs exist); slice index [`docs/requirements/README.md`](../../../docs/requirements/README.md)
2. [`docs/README.md`](../../../docs/README.md) — documentation map (when present)
3. `docs/requirements/vision/` — architecture + UI spec (when present)
4. `docs/requirements/slices/<id>/` — human requirements (do not rewrite without ask)
5. `docs/project-files/project-plan/slices/*-tasks.md` — executable tasks
6. `docs/implemented-design/` + `docs/modules/` — as-built cross-cutting and per-feature docs

## Documentation layers

```text
README.md → docs/README.md → layer hub → specific doc
```

| Layer hub | Path |
|-----------|------|
| Architecture | `docs/architecture/README.md` |
| Implementation | `docs/implemented-design/` → `docs/modules/` |
| Configuration | `docs/configuration/README.md` |
| Requirements | `docs/requirements/README.md` |
| Testing | `docs/testing/README.md` |

## Project-wide docs at slice end (mandatory)

**Every slice Final must include a project-wide documentation update.** Feature as-built alone is not enough to close the slice.

| Required | What to do |
|----------|------------|
| Feature as-built | `docs/modules/<module>/features/<feature>/` |
| Catalog | `implementation-catalog.md` when user-facing behavior ships |
| **Project-wide pass** | Walk [`docs/README.md`](../../../docs/README.md) and every affected layer hub; update module indexes, hub tables, cross-links, and `implemented-design/` so the **whole project docs tree** reflects what shipped |

Do **not** mark Final Documentation complete until the project-wide pass is done (or explicitly recorded with **Note:** listing what was checked and that no hub/map changes were needed).

## Layout

| Concern | Path |
|---------|------|
| Product requirements | `docs/requirements/requirements.md` |
| Docs map | `docs/README.md` |
| App code | `src/` — pages, reusable modules, navigation, `t()` text |
| Static assets | `public/` |
| Tests | `tests/` — see `tests/SCAFFOLD.md` |
| Hosting | GitHub Pages static build (`npm run build`) |
| PM agent (requirements drafting) | `docs/product-manager-agent/` — **not Cursor's job to invent requirements** |

No FastAPI, SQL Server, IIS, or Python app package in this repo.

## Slice build loop

1. Human approves requirements under `docs/requirements/slices/NN-name/` (or `requirements.md` during template bootstrap).
2. Sync tasks with [`ex-react-slice-plan`](../ex-react-slice-plan/SKILL.md) — includes **Manual confirmation** (change checklist + verbal gate) **before** the **mandatory Final phase** (SC-xx, tests create + register + **execute**, regression-plan, SCAFFOLD, as-built).
3. Set `.cursor/active-slice` (`SLICE_ID`, `MODULE_ID`, `FEATURE_NAME`, `BRANCH`).
4. Execute the next incomplete **phase** in `*-tasks.md` (`/start-phase` — all remaining tasks in that phase).
5. After implementation phases: enter **Manual confirmation** — log every human change request **and** review defect on that phase checklist (see [`ex-react-manual-confirmation`](../ex-react-manual-confirmation/SKILL.md)), walk the list, then obtain **verbal confirmation** before Final.
6. Closeout (Final): evaluate SC-xx, update `traceability.md`, run tests, update feature as-built + catalog, **and** complete the **project-wide docs pass** so the overall documentation tree matches the shipped product.

**Slice folder rule:** requirements folders contain **only** main `.md` + `deviations/` + `input-files/` + `success-criteria/` — never nest `src/` or `tests/` there.

## Environment

| Context | Files |
|---------|-------|
| Local dev | `.env.example` → `.env.local` (gitignored) — Vite / Pages base path, published sheet URLs |
| Hosting | GitHub Pages from the static `dist/` (or equivalent) build |

Entrypoints:

```powershell
npm install
npm run dev
npm run build
```

## Verification

| Command | When |
|---------|------|
| `/v` | Implement + test + runtime proof — [`.cursor/commands/v.md`](../../commands/v.md) |
| `/cleanup` | Lint + format + fast unit tests — [`.cursor/commands/cleanup.md`](../../commands/cleanup.md) |
| `/v+codex` | Optional second opinion — [`ex-react-verify-codex`](../ex-react-verify-codex/SKILL.md) |

## Human onboarding

[`docs/developer.md`](../../../docs/developer.md) — modules vs slices, env, build loop.

## Do not

- Commit unless human asks
- Commit `.env.local`, `HANDOFF.md`, secrets
- Add a custom backend, database, or SSR
- Nest code under `docs/requirements/slices/`

## Related

- [`docs/product-manager-agent/regression-and-closeout.md`](../../../docs/product-manager-agent/regression-and-closeout.md)
