# Ex-React — agent instructions

Static **React** website template for **GitHub Pages**. Selected page content can be updated through Google Sheets. No custom backend, database, or server runtime. All documentation under `docs/`.

**Current product requirements (until vision docs exist):** [`docs/requirements/requirements.md`](docs/requirements/requirements.md). Per-slice requirements + delivery plan: [`docs/requirements/README.md`](docs/requirements/README.md).

**New chat:** Read the first ~120 lines of [`HANDOFF.md`](HANDOFF.md), then **`.cursor/active-slice`** (feature work), then this file, then [`.cursor/skills/ex-react-core/SKILL.md`](.cursor/skills/ex-react-core/SKILL.md). **Human onboarding:** [`docs/developer.md`](docs/developer.md). **PM agent (requirements):** [`docs/product-manager-agent/`](docs/product-manager-agent/).

**Documentation map (central):** [`docs/README.md`](docs/README.md) when present — layered hubs for architecture, implementation, configuration, requirements, testing.

**Architecture authority:** `docs/requirements/vision/` when present; otherwise [`docs/requirements/requirements.md`](docs/requirements/requirements.md).

**Key references:** [docs/requirements/requirements.md](docs/requirements/requirements.md) | [docs/requirements/README.md](docs/requirements/README.md) | [docs/developer.md](docs/developer.md) | [docs/product-manager-agent/](docs/product-manager-agent/)

## Repository structure

```text
src/                      React app — pages, modules, shared UI
public/                   Static assets (when present)
docs/                     Documentation map, requirements, as-built, project-files
docs/requirements/        Product requirements (requirements.md) + per-slice requirements
tests/                    Unit / component / e2e (see tests/SCAFFOLD.md)
.cursor/                  Rules, skills, hooks (hooks.json local only)
```

This is **not** a FastAPI + SQL Server monorepo. Do not scaffold `databases/`, IIS deploy, or a Python API unless the human explicitly changes the product profile.

## Document lifecycle

| Path | Role |
|------|------|
| [`docs/README.md`](docs/README.md) | Central map + layer hubs — update when structure changes |
| `docs/requirements/` | Human phase inputs — agents do not edit during active build |
| `docs/project-files/project-plan/` | Agent-synced phase checklists |
| `docs/project-files/build-evidence/` | Per-feature build evidence |
| `docs/implemented-design/` | Cross-cutting as-built design |
| `docs/modules/` | Per-feature as-built docs |

**Final docs rule (mandatory every slice):** by the end of a slice, agents must complete a **project-wide documentation update**, not only the feature as-built. Walk [`docs/README.md`](docs/README.md) and the layer hubs; refresh module indexes, hub links/tables, catalog, and `implemented-design/` so the overall docs tree matches what shipped. Feature README alone = not done.

## Environment

**Local development**

- Template: `.env.example` | Non-secret config: `.env.local` (gitignored)
- Typical values: Vite `BASE_URL` / GitHub Pages path, Google Sheets published CSV/JSON URLs, public submit endpoints
- Run: `npm install` then `npm run dev`
- Build: `npm run build` (static output for GitHub Pages)

**Do not** store spreadsheet edit credentials in git. Public published-sheet URLs are fine in committed config when they are intentionally public.

## Do not

- Commit `.env`, `.env.local`, `HANDOFF.md`, `/bootstrap.md`, `.cursor/hooks.json`, `.cursor/active-slice`, or `.cursor/active-defects`
- Add a custom backend, database, or server-side rendering
- Nest code under `docs/requirements/slices/`
- Create git commits unless the user explicitly asks
