# Org standard stack — full-stack web app (production)

**Purpose:** Pinned technology choices for **full-stack** solutions on org Windows / SQL Server / IIS hosts. Bootstrap **defaults to this profile** in Phase 0 Step 0 unless the human selects API-only, batch, or another delivery type.

Vision docs must reference this file when **Delivery type = SPA + API (org standard)**.

**Do not use NiceGUI** for new work — org standard is React SPA + FastAPI only. Legacy NiceGUI was removed; do not scaffold `app_shell/` pages or add new server-rendered UI frameworks unless vision explicitly overrides (rare).

---

## Application (production)

| Layer | Stack | Location / notes |
|-------|--------|------------------|
| **Frontend** | **React 19** + **Mantine 9** + **TypeScript**, built with **Vite** | `frontend/` |
| **Client libs** | TanStack Query, TanStack Table, React Router, React Hook Form, **Zod**, ECharts | `frontend/src/shared/`, feature folders |
| **API** | **FastAPI** + **uvicorn** at **`/api/*`** | `src/mfgcidashboard_app/api/` |
| **Backend** | Python **3.11+** modular monolith | `src/mfgcidashboard_app/modules/<module_id>/<feature>/` — `service.py`, `repository.py`, `schemas.py`, `routes.py` per feature |
| **Entrypoint** | `python -m mfgcidashboard_app.api_main` | One process serves **React static build + API** in production |
| **Local dev** | `python -m mfgcidashboard_app.api_main` + `cd frontend && npm run dev` | Vite proxies `/api` → API port |

---

## Data

| Layer | Stack | Location / notes |
|-------|--------|------------------|
| **Database** | **Microsoft SQL Server** | One or more owned DBs — primary `CIDashboard`; additional DBs (e.g. domain-specific) under `databases/` when vision requires |
| **Access** | **SQLAlchemy 2** + **pyodbc** / **pymssql** | `src/mfgcidashboard_app/db/` |
| **Validation** | **Pydantic** (API), **Zod** (forms) | `schemas.py` / frontend form schemas |
| **SQL source of truth** | Versioned DDL, procs, views | `databases/CIDashboard/` (and sibling DB folders per vision) |

App writes only to owned application databases. Warehouse / ERP reads via `integrations/` — read-only, no ETL in app repo.

### Local development vs deployed

| Context | Engine | Notes |
|---------|--------|--------|
| **DEV / TST / PRD (IIS)** | **Microsoft SQL Server** | Committed DDL in `databases/CIDashboard/` (T-SQL) |
| **Developer laptop** | **SQLite** or **PostgreSQL** when not using SQL Server locally | Prefer **SQLite** for simplest setup; **PostgreSQL** when you need a server DB locally |
| **Developer laptop → remote DEV SQL** | SQL Server | `local-dev-sql.env.example` — only when explicitly chosen |

During Phase 0, if the user will **not** run SQL Server on their laptop, bootstrap **must recommend SQLite or PostgreSQL** — not local MSSQL install. Set `APP_DB_ENGINE` + `APP_DB_URL` from kit env examples. Validate T-SQL against SQL Server in shared DEV or CI before merge.

---

## Platform & ops

| Layer | Stack | Location / notes |
|-------|--------|------------------|
| **Deploy (DEV/TST/PRD)** | **IIS on Windows** — `runserver.py`, **httpPlatform** handler | `deployments/web/`, app pool per project |
| **CI** | **GitLab CI** (e.g. runner host `srvirqwebdev` — set in org profile) | `.gitlab-ci.yml` when used |
| **Config** | `.env.local` / `deployments/env/mfgcidashboard.<tier>.env` via **pydantic-settings** | `src/mfgcidashboard_app/core/config.py` |
| **Auth** | **LDAP** (`ldap3`) + session middleware | API layer — not in React components |

---

## Integrations (backend only)

| Integration | Use | Rule |
|-------------|-----|------|
| **ClickUp** | Defect sync, feature polls (optional) | `integrations/clickup/` — env-gated |
| **OpenAI** | Agent calls | **Service layer only** — never from UI or route handlers directly |

Leave integration blocks commented in env files until the project enables them.

---

## Testing & quality

| Tool | Use |
|------|-----|
| **pytest** | Unit, integration, API — `tests/` |
| **Playwright** | UI smoke / layout — `tests/end_to_end/smoke/` |
| **ruff** | Python lint + format |
| **ESLint** + **Vitest** | Frontend — `frontend/` |

---

## Repo shape (monorepo)

```text
frontend/                 React 19 + Mantine 9 SPA (Vite)
src/mfgcidashboard_app/
  api/                    FastAPI app, /api/* routers, auth middleware
  api_main.py             Production entry (static SPA + API)
  core/                   config, logging, errors
  db/                     SQLAlchemy engines, sessions
  integrations/           clickup, openai, warehouse, ldap
  modules/                vertical slices (routes, service, repository, schemas)
databases/CIDashboard/       versioned SQL (platform/ + modules/)
deployments/              env, scripts, web (IIS)
tests/                    pytest + Playwright
docs/                     requirements, modules, project-files
```

---

## Runtime layout

**Production (IIS + httpPlatform):**

```text
Browser → https://SRVIRQETLDEV/           (React static from FastAPI/static mount or IIS)
        → https://SRVIRQETLDEV/api/*       (FastAPI routes)

mfgcidashboard_app → SQL Server (CIDashboard, …)
              → LDAP
              → optional ClickUp / OpenAI / warehouse (integrations/)
```

**Local development:**

```bash
# Terminal 1 — API + optional static (api_main)
set -a && source .env.local && set +a
source .venv/bin/activate
python -m mfgcidashboard_app.api_main

# Terminal 2 — Vite dev server (HMR; proxy /api → api_main port)
cd frontend && npm install && npm run dev
```

Vite `server.proxy`: `/api` → `http://127.0.0.1:<APP_PORT>`.

---

## Python dependencies (org standard)

```toml
[project]
name = "mfgcidashboard-app"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
  "fastapi>=0.115",
  "uvicorn[standard]>=0.30",
  "pydantic-settings>=2.0",
  "sqlalchemy>=2.0",
  "pyodbc>=5.0",
  "pymssql>=2.3",
  "ldap3>=2.9",
]

[project.optional-dependencies]
dev = ["pytest>=8.0", "ruff>=0.4", "httpx>=0.27"]
```

Add `openai`, ClickUp client deps when integrations are enabled.

---

## Frontend dependencies (org standard)

Baseline — pin exact versions in `frontend/package.json` at bootstrap; align with org catalog when available:

| Package | Role |
|---------|------|
| `react` / `react-dom` ^19 | UI |
| `@mantine/core` / `@mantine/hooks` ^9 | Component library |
| `@tanstack/react-query` | Server state |
| `@tanstack/react-table` | Data grids |
| `react-router-dom` | Routing |
| `react-hook-form` + `zod` + `@hookform/resolvers` | Forms |
| `echarts` + `echarts-for-react` | Charts |
| `vite`, `@vitejs/plugin-react`, `typescript` | Build |
| `vitest`, `eslint` | Frontend test + lint |

---

## API contract

- JSON REST under **`/api/*`** (feature routers mounted from `modules/**/routes.py`).
- **`GET /api/health`** — required bootstrap stub.
- SPA calls API only — **no SQL, LDAP, or OpenAI in React**.

---

## Bootstrap stubs (full-stack)

| Area | Seed |
|------|------|
| API | `api_main.py`, `api/app.py`, `GET /api/health`, stub `GET /api/foundations/home` |
| SPA | Mantine `AppShell`, React Router, home feature calling health/home API via TanStack Query |
| SQL | `databases/CIDashboard/platform/` + FeatureRegistry.md |
| IIS | `deployments/web/setup_mfgcidashboard_web.ps1`, `runserver.py` / httpPlatform notes in org profile |
| Nav | `deployments/env/nav-visibility.txt` — keys match SPA routes |
| Auth | LDAP middleware stub or dev bypass via env (`APP_AUTH_DEV_BYPASS`) |
| Tests | `tests/unit/`, `tests/integration/api/`, Playwright smoke stub README |

---

## Phase 0 profile values (copy into vision doc)

| Field | Org standard full-stack value |
|-------|-------------------------------|
| **Delivery type** | SPA + API (org standard) |
| **HTTP surface** | yes — FastAPI at `/api/*`, entrypoint `python -m mfgcidashboard_app.api_main` |
| **Owned application database** | yes — `CIDashboard` on SQL Server (deployed; list additional DBs if any) |
| **Local database (laptop)** | **sqlite** (default) or **postgresql** when not using SQL Server locally |
| **Client UI** | React 19 + Mantine 9 + Vite in `frontend/` |
| **Auth** | LDAP + session middleware |
| **Deploy** | IIS Windows (httpPlatform) — `org-deployment-profile.md` |
| **CI** | GitLab CI — runner host in org profile |

---

## When NOT to use this profile

- API-only internal service (no `frontend/`)
- Batch / SQL Agent jobs only (no HTTP UI)
- **NiceGUI or other server-rendered UI** — not org standard; do not scaffold unless explicit exception documented in vision

---

## Reference

Production pattern derived from org monorepo practice (React SPA replaced legacy NiceGUI). Bootstrap uses placeholders (`mfgcidashboard_app`, `CIDashboard`) — not product-specific names.
