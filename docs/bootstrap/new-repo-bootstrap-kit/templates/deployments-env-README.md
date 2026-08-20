# Environment config — mfgcidashboard

**Developer quick start:** [`docs/developer.md`](../../developer.md) §7

## Files

| File | Environment |
|------|-------------|
| `mfgcidashboard.dev.env` | DEV web server |
| `mfgcidashboard.tst.env` | TST |
| `mfgcidashboard.prd.env` | PRD |
| `nav-visibility.txt` | Menu visible per tier — **only when app has a navigable UI** |
| `local-dev-sql.env.example` | Laptop → shared DEV **SQL Server** |
| `local-dev-sqlite.env.example` | Local **SQLite** (no SQL Server on laptop) |
| `local-dev-postgres.env.example` | Local **PostgreSQL** (no SQL Server on laptop) |
| `local-tst-sql.env.example` | Laptop → TST SQL (if used) |

## Install on server

```powershell
.\deployments\scripts\Install-ProjectEnv.ps1 -Environment dev
# Restart app per docs/project-files/system/org-deployment-profile.md
```

## Local laptop database

Deployed tiers use **SQL Server** (`mfgcidashboard.dev.env`, etc.). For **local** `.env.local`:

| If you… | Use template |
|---------|----------------|
| Do **not** use SQL Server on your laptop | **`local-dev-sqlite.env.example`** (recommended) or **`local-dev-postgres.env.example`** |
| Connect laptop to shared DEV SQL Server | `local-dev-sql.env.example` |

Set `APP_DB_ENGINE` to `sqlite`, `postgresql`, or `mssql`. PostgreSQL: `pip install -e ".[dev,local-postgres]"`.

## What to fill (per tier)

1. **SQL** — host, domain, service account + password, default database
2. **Public URL** — `APP_SERVER_*_PUBLIC_URL`
3. **Integrations** — only vars your project uses; set `*_POLL_ENABLED=false` on TST unless needed
4. **ClickUp** — optional; omit or leave token empty if project does not use ClickUp

Full deploy: [`../DEPLOY.md`](../DEPLOY.md)
