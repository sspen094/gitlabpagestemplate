# Org deployment profile — MFGCIDashboard

**Purpose:** Document **your organization's** hosts, deploy commands, and CI.

**Full-stack stack reference:** [`org-standard-fullstack-stack.md`](org-standard-fullstack-stack.md) — React SPA + FastAPI + SQL Server + IIS (copy both files to `docs/project-files/system/` during Phase 6 when using org standard hosts).

**Related:** [`deployments/DEPLOY.md`](../../../deployments/DEPLOY.md) · [`deployments/env/README.md`](../../../deployments/env/README.md) · [`docs/developer.md`](../../developer.md) §7

---

## Environment targets

| Tier | SQL host | App / web host | Public URL | Notes |
|------|----------|----------------|------------|-------|
| **DEV** | `SRVIRQSQLDEV` | `SRVIRQETLDEV` | _(fill)_ | |
| **TST** | _(confirm with IT)_ | _(confirm)_ | _(confirm)_ | |
| **PRD** | _(confirm with IT)_ | _(confirm)_ | _(confirm)_ | |

---

## Deploy commands

| Step | Command / script |
|------|------------------|
| Pull latest | `git pull` |
| Install env | `.\deployments\scripts\Install-ProjectEnv.ps1 -Environment dev` _(or org equivalent)_ |
| SQL deploy | `.\deployments\scripts\Deploy-AppSql.ps1` _(when app owns a database)_ |
| App deploy | `.\deployments\scripts\Deploy-App.ps1` |
| Restart runtime | _(e.g. IIS app pool `mfgcidashboard`, systemd unit, container recycle)_ |

---

## CI / Git hosting

| Item | Value |
|------|-------|
| Provider | _(GitLab / GitHub / Azure DevOps / none)_ |
| Pipeline URL | _(link)_ |
| Runner / agent | _(fill)_ |

---

## SQL account policy (when using SQL Server)

| Context | Host | Login |
|---------|------|-------|
| App host → DEV SQL | `SRVIRQSQLDEV` | Service account in `mfgcidashboard.dev.env` |
| Developer laptop → DEV SQL | `SRVIRQSQLDEV` | Personal account via `local-dev-sql.env.example` in `.env.local` |
| TST / PRD | _(per tier env file)_ | Human-approved accounts |

---

## Platform notes (IIS full-stack)

| Item | Typical value |
|------|----------------|
| Site / app pool | `mfgcidashboard` |
| Handler | httpPlatform → `runserver.py` or `api_main` via uvicorn |
| CI runner | e.g. `srvirqwebdev` (GitLab) |
| Static + API | One process — React build served by FastAPI/IIS |

_Document site name, pool recycle command, attachment paths, LDAP host._
