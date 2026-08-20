# MFGCIDashboard — architecture for Cursor (org standard full-stack)

**Status:** Draft (seeded at bootstrap)  
**Stack reference:** `docs/project-files/system/org-standard-fullstack-stack.md`

---

## Project profile

| Field | Value |
|-------|-------|
| **Delivery type** | SPA + API (org standard) |
| **HTTP surface** | yes — FastAPI at `/api/*`, `python -m mfgcidashboard_app.api_main` |
| **Owned application database** | yes — `CIDashboard` on SQL Server (deployed DEV/TST/PRD) |
| **Local database (laptop)** | _(sqlite \| postgresql \| mssql-remote-dev — default **sqlite** if not using SQL Server locally)_ |
| **Additional databases** | _(none \| list e.g. NPI — each with folder under `databases/` )_ |
| **Client UI** | React 19 + Mantine 9 + Vite + TypeScript in `frontend/` |
| **Auth** | LDAP (`ldap3`) + session middleware |
| **Primary entrypoint** | `python -m mfgcidashboard_app.api_main` (prod: IIS httpPlatform; local: + `npm run dev`) |
| **External read-only systems** | _(warehouse / ERP / none)_ |

**One-paragraph summary:**  
_(What the app does, users, DEV/TST/PRD on IIS + SQL Server.)_

---

## Stack (explicit — do not substitute)

| Layer | Choice |
|-------|--------|
| Frontend | React 19, Mantine 9, TypeScript, Vite |
| Client libs | TanStack Query, TanStack Table, React Router, React Hook Form, Zod, ECharts |
| API | FastAPI + uvicorn, routes under `/api/*` |
| Backend modules | `service.py`, `repository.py`, `schemas.py`, `routes.py` per feature |
| Data (deployed) | SQL Server, SQLAlchemy 2, pyodbc/pymssql |
| Data (local laptop) | SQLite or PostgreSQL when not on SQL Server — see `local-dev-sqlite.env.example` / `local-dev-postgres.env.example` |
| SQL DDL | `databases/CIDashboard/` — T-SQL for deployed tiers |
| Deploy | IIS Windows, `runserver.py`, httpPlatform |
| CI | GitLab CI |
| Integrations | ClickUp, OpenAI — **backend service layer only** |

**No NiceGUI.** Do not add server-rendered Python UI pages.

---

## Layout

```text
frontend/src/               Mantine shell, features/, shared/ (api client, hooks)
src/mfgcidashboard_app/api/      FastAPI app + middleware (auth, sessions)
src/mfgcidashboard_app/api_main.py
src/mfgcidashboard_app/modules/  vertical slices
databases/CIDashboard/
deployments/
tests/
```

Production: **one process** serves React static build and `/api/*`.

---

## Module pattern

Each feature: `routes.py` (thin FastAPI) → `service.py` → `repository.py` → SQL Server. Mirror under `frontend/src/features/<module_id>/<feature>/`.

---

## Local dev

```bash
set -a && source .env.local && set +a
source .venv/bin/activate && python -m mfgcidashboard_app.api_main
cd frontend && npm run dev
```

---

## Deploy

`git pull` → `Install-ProjectEnv.ps1` → `Deploy-AppSql.ps1` → `Deploy-App.ps1` → recycle IIS app pool. See `org-deployment-profile.md`.
