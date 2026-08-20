# MFGCIDashboard — architecture for Cursor

**Status:** Draft (seeded at bootstrap — human refines after Phase 0)  
**Last updated:** YYYY-MM-DD

---

## Project profile

Fill this section **before** Phases 2a/2b scaffold code. Bootstrap agent seeds it from your answers at the first STOP gate.

| Field | Value |
|-------|-------|
| **Delivery type** | _(API-only \| SPA + API \| Server UI \| Batch/jobs only \| Mixed — pick one)_ |
| **HTTP surface** | _(yes/no — e.g. FastAPI on port 8080)_ |
| **Owned application database** | _(yes/no — name: `CIDashboard` when yes)_ |
| **Local database (laptop)** | _(sqlite \| postgresql \| mssql-remote-dev — **not SQL Server locally → prefer sqlite or postgresql**)_ |
| **Deployed database (DEV/TST/PRD)** | _(typically Microsoft SQL Server)_ |
| **Client UI** | _(none \| SPA in `frontend/` \| server-rendered in `app_shell/`)_ |
| **Primary entrypoint** | _(e.g. `uvicorn`, `python -m mfgcidashboard_app.jobs.runner`, none)_ |
| **External read-only systems** | _(warehouse, ERP, files — or none)_ |

**One-paragraph summary:**  
_(What the app does, who uses it, and how it is deployed — 2–4 sentences.)_

---

## Layout

Scaffold under `src/mfgcidashboard_app/` per profile above:

```text
src/mfgcidashboard_app/
  api/              # when HTTP surface = yes
  app_shell/        # when Client UI = server-rendered
  core/
  db/               # when Owned application database = yes
  integrations/
  modules/
  jobs/             # when Delivery type includes batch/jobs
```

Omit folders that profile marks as not applicable.

---

## Module pattern

Vertical slices: `modules/<module_id>/<feature>/` with `service.py`, `repository.py`, `schemas.py`, and stack-appropriate wiring (`routes.py`, `pages.py`, etc.).

---

## Database (when owned DB = yes)

- **Deployed (DEV/TST/PRD):** SQL Server — DDL/procs in `databases/CIDashboard/`
- **Local laptop:** per **Local database** in profile — SQLite or PostgreSQL when not using SQL Server locally; remote DEV SQL only when explicitly chosen
- External reads: `integrations/` only — no ETL in this repo

---

## Config

Environment via `core/config.py`. Local: `.env.local`. Deployed: `deployments/env/mfgcidashboard.<tier>.env`.

---

## Bootstrap example modules

Stubs only — delete when real slices ship. Scope per **Project profile**:

| Profile | Seed |
|---------|------|
| API-only | `foundations/health/` or `home/` route |
| Server UI | `app_shell/` + `foundations/home/` + optional form/dashboard stubs |
| Batch only | `jobs/` + minimal `foundations/` or single job module |
| SPA + API | API stubs + `frontend/` shell per `mfgcidashboard_ui_spec_for_cursor.md` |
