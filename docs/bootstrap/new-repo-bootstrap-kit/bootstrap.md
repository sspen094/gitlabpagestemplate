# Bootstrap runbook

**Solution-agnostic by design** — supports API-only, batch, and server-rendered UI. **Org default for full-stack web apps:** React SPA + FastAPI + SQL Server + IIS — see [`org-standard-fullstack-stack.md`](new-repo-bootstrap-kit/templates/org-standard-fullstack-stack.md). Phase 0 Step 0 offers that profile first when servers are org-standard Windows/SQL hosts.

Vision docs record the chosen profile; bootstrap scaffolds to match.

**Committed template:** `docs/bootstrap/bootstrap.md`  
**Local runbook:** copy to repo root as **`bootstrap.md`** (gitignored via `/bootstrap.md`).  
**Kit folder:** `docs/bootstrap/new-repo-bootstrap-kit/` — templates only; **do not** maintain a second `bootstrap.md` inside the kit (see kit pointer file).  
**Human onboarding (post-bootstrap):** copy [`new-repo-bootstrap-kit/developer.md`](new-repo-bootstrap-kit/developer.md) → `docs/developer.md` — short guide for slice authors (see Phase 0).  
**Product manager agent (Codex/ChatGPT):** [**agent-product-manager**](https://srvirqisgitlab1.rossvideo.com/manufacturing-data-infrastructure-and-applications/agent-product-manager) — **committed vendor snapshot** in kit + Phase 4 fetch script. See [`new-repo-bootstrap-kit/vendor/README.md`](new-repo-bootstrap-kit/vendor/README.md).  
**New-repo master:** `.cursor/project-bootstrap.md` (gitignored) — keep defect workflow + slice-folder rules aligned with this file.

Open the repo in Cursor and start a chat with:

> Read `bootstrap.md` and run **Phase 0 Step 0 (project profile)** first. If vision docs are missing or incomplete, ask me a few sentences about the app type before scaffolding. Then execute every phase in order. Stop at each **STOP** gate and report status before continuing unless I say to run multiple phases.

---

## Placeholders (replace before bootstrap)

Use one consistent set across the repo. Example row shows a fictional project — **do not** leave example values in a real bootstrap.

| Placeholder | Meaning | Example |
|-------------|---------|---------|
| `MFGCIDashboard` | Product / app display name | Acme Portal |
| `mfgcidashboard` | Repo slug (**kebab-case**) | `acme` |
| `mfgcidashboard_app` | Python package (**snake_case**) | `acme_app` |
| `CIDashboard` | Application-owned SQL database name | `ACME_APP` |
| `SRVIRQSQLDEV` | SQL Server hostname (app DB) | `SQLDEV01` |
| `<APP_DB_USER>` / `<APP_DB_PASSWORD>` | SQL login for app DB | _(per environment)_ |
| `SRVIRQSQLDEV` | DEV SQL Server hostname (alias for `SRVIRQSQLDEV` in examples) | `SQLDEV01` |
| `SRVIRQETLDEV` | DEV web host (when app is hosted on IIS or similar) | `WEBDEV01` |

**File patterns derived from `mfgcidashboard`:**

- Env: `deployments/env/mfgcidashboard.dev.env`, `mfgcidashboard.tst.env`, `mfgcidashboard.prd.env`
- Local SQL override templates: `deployments/env/local-dev-sql.env.example`, `local-tst-sql.env.example`
- Vision docs: `docs/requirements/vision/mfgcidashboard_architecture_for_cursor.md`, `mfgcidashboard_ui_spec_for_cursor.md`
- Skills: `.cursor/skills/mfgcidashboard-core/SKILL.md` (required); `mfgcidashboard-slice-plan` (recommended — **enforces final-phase regression closeout**); `mfgcidashboard-verify-codex`, `mfgcidashboard-clickup-defects` (optional)
- Developer onboarding: `docs/developer.md` (copy from `docs/bootstrap/new-repo-bootstrap-kit/developer.md`)
- PM agent: `docs/product-manager-agent/` (fetch via [`scripts/fetch-product-manager-agent.sh`](new-repo-bootstrap-kit/scripts/fetch-product-manager-agent.sh) — source repo **agent-product-manager**)

If your org maintains a **reference monorepo**, copy proven files from there and rename placeholders — see [Appendix — Optional reference monorepo](#appendix--optional-reference-monorepo). Do not hard-link or assume a specific reference repo path on disk.

---

## Source-of-truth hierarchy

When this bootstrap conflicts with other material, follow this order:

1. **`docs/requirements/vision/`** — folder structure, app stack, UI spec, vertical slices (`mfgcidashboard_architecture_for_cursor.md`, `mfgcidashboard_ui_spec_for_cursor.md`). Stubs under `docs/architecture/` may redirect here.
2. **This file** — bootstrap phases, governance (HANDOFF, hooks, rules), docs layout
3. **Reference monorepo** (optional) — SQL deploy patterns, env var names, regression layout

**Decisions locked by architecture (no Phase 1b ask unless human overrides):**

- **Stack** — per **`docs/requirements/vision/mfgcidashboard_architecture_for_cursor.md`**
  - **Full-stack (org standard):** **React 19 + Mantine 9 SPA** (`frontend/`) + **FastAPI** at `/api/*` (`src/mfgcidashboard_app/api/`, `api_main.py`) + **SQL Server** + **IIS** — see [org standard full-stack stack](new-repo-bootstrap-kit/templates/org-standard-fullstack-stack.md). **No NiceGUI.**
  - **API / service only:** FastAPI modular monolith — no `frontend/`
  - **Data-only / batch:** omit `frontend/` and HTTP UI
- **App organization:** vertical slices under `modules/<module_id>/<feature>/`, not global `pages/` + `services/` folders
- **Application database** (if any): owned in `databases/CIDashboard/`; external warehouse or ERP reads stay in `integrations/` as read-only dependencies
- **Requirements vs implementation:** slice requirements state **outcomes**; Cursor chooses design tradeoffs during build (see `docs/gpt-instructions/AGENTS.md` for ChatGPT)

---

## Governance toolkit

These items are **required** when bootstrapping.

| Feature | Location | Purpose |
|---------|----------|---------|
| **Chat-start rule** | `.cursor/rules/session-handoff.mdc` (`alwaysApply: true`) | Every new chat reads the **first ~120 lines** of `HANDOFF.md` (~80-line target) |
| **HANDOFF.md** | Repo root (gitignored) | Session snapshot: focus, branch, done/in-progress, next steps — **never embed full `git status`** |
| **Stop hook** | `.cursor/hooks.json` (local, gitignored) + `.cursor/hooks/update_handoff.py` | On chat end, Python script refreshes **Last updated** + **Repository state** directly — outputs `{}` only (no agent followup turn) |
| **Windows wrapper** | `.cursor/hooks/update-progress-handoff.ps1` | Optional — invokes `update_handoff.py` when `python3` is not on PATH in PowerShell |
| **Env (local)** | `.env.example` (committed) / `.env.local` (gitignored) | Developer template + runtime secrets — see [Phase 1](#phase-1--environment--tooling) |
| **Env (deployed)** | `deployments/env/mfgcidashboard.{dev,tst,prd}.env` (committed) | Per-environment deploy config — see [Phase 6](#phase-6--deployment-environments) |
| **`AGENTS.md`** | Repo root (committed) | Agent entrypoint: repo structure, lifecycle, do-not rules |
| **Developer guide** | `docs/developer.md` (committed) | Short human onboarding — copy from [`new-repo-bootstrap-kit/developer.md`](new-repo-bootstrap-kit/developer.md) |
| **ChatGPT authoring** | [**agent-product-manager**](https://srvirqisgitlab1.rossvideo.com/manufacturing-data-infrastructure-and-applications/agent-product-manager) → `docs/product-manager-agent/` | PM agent for Codex/ChatGPT — slice requirements + SC-xx |
| **`.cursorignore`** | Repo root (committed) | Keeps venv and build output out of agent index |
| **`bootstrap.md`** | Repo root (gitignored) | Local bootstrap copy |

Optional but recommended for UI-heavy apps:

| Feature | Location | Purpose |
|---------|----------|---------|
| **Verification mode** | `.cursor/commands/v.md` + `verification-mode.mdc` | `/v` → implement, test, runtime verify |
| **Cleanup mode** | `.cursor/commands/cleanup.md` + `cleanup-mode.mdc` | `/cleanup` → pytest, ruff, format |
| **Slice plan skill** | `.cursor/skills/mfgcidashboard-slice-plan/SKILL.md` | Sync `*-tasks.md`, `traceability.md`, SCAFFOLD, success-criteria, **mandatory regression execute** at closeout |
| **UI patterns** | `docs/implemented-design/design/ui-controls.md` + `ui-*.mdc` rules | Title Case, filter layout, page patterns |
| **Active slice** | `.cursor/active-slice` (gitignored) + `active-slice.mdc` | Scope agent work to one slice / module |
| **Slice deviations** | `slice-deviations.mdc` + deviation template | Mid-slice pivots on same NN |
| **Success criteria** | `docs/requirements/slices/<id>/success-criteria/` | SC-xx checklists; **`traceability.md`** (Cursor at task sync) for `/v` closeout |
| **Verification hub** | `docs/project-files/verification/` | DP-xx design patterns (not pytest) |

**Optional — verification + Codex second opinion:**

| Feature | Location |
|---------|----------|
| `/v+codex` command | `.cursor/commands/vcodex.md` + `verification-codex.mdc` |
| Verify-Codex skill | `.cursor/skills/mfgcidashboard-verify-codex/SKILL.md` |
| Reports | `docs/project-files/verification-reports/` |
| CI scripts | `tools/ci/resolve_success_criteria.py`, `codex_second_opinion.sh` (optional — from reference monorepo or write fresh) |
| ChatGPT guardrails | `docs/product-manager-agent/AGENTS.md` |

**Optional — only if the project uses ClickUp for QA defects:**

| Feature | Location |
|---------|----------|
| Defect sync skill | `.cursor/skills/clickup-defects/SKILL.md` |
| Active defects | `.cursor/active-defects` (gitignored) |
| Bug workflow | `docs/project-files/system/bug-workflow.md` |
| Defect sync script | `tools/ci/clickup_sync_defects.py` |

---

## Documentation model (unified under `docs/`)

All documentation lives under **`docs/`**. Do **not** create a top-level `requirements/` folder.

| Path | Role | Who edits |
|------|------|-----------|
| `docs/requirements/vision/` | Canonical architecture + UI spec | Human (design authority) |
| `docs/requirements/slices/` | Slice requirements — main doc + `deviations/` + `input-files/` + **`success-criteria/`** | **Human** |
| `docs/modules/` | As-built feature docs per module | **Agent** after implementation |
| `docs/developer.md` | Short developer onboarding (human) | **Human** (seed from bootstrap template) |
| `docs/project-files/verification/` | Project-wide verification checklists (**DP-xx**) — not pytest | **Agent** when patterns emerge |
| `docs/project-files/verification-reports/` | Post-`/v` or `/v+codex` reports | **Agent** at milestones |
| `docs/project-files/defects/` | Bug mirror (`inbox/*.md`) — **optional** if using ClickUp | **Agent** sync + human triage |
| `docs/project-files/regression/` | Regression plan + test traceability | **Agent** per bug fix |
| `docs/project-files/system/bug-workflow.md` | Defect lane — **optional** | **Human** + agent |
| `docs/implemented-design/` | Cross-cutting as-built design spec | **Agent** after implementation |
| `docs/project-files/project-plan/slices/` | Executable slice task lists synced from requirements | **Agent** (human review) |
| `docs/project-files/project-plan/solution/` | Solution overview — no tasks | **Human** + agent |
| `docs/project-files/build-evidence/` | Per-feature build evidence during development | **Agent** |
| `docs/gpt-instructions/` | Implementation catalog (optional legacy path) | **Agent** during build |
| `docs/product-manager-agent/` | PM agent instructions for Codex/ChatGPT | **Human** configures; **Cursor** updates catalog on closeout |
| `docs/glossary/` | Domain terms | Human + agent |

### Document lifecycle

```text
docs/requirements/slices/          → human slice requirements (deviations/ + input-files/ + success-criteria/ SC-xx drafts)
docs/project-files/project-plan/slices/ → agent syncs *-tasks.md + success-criteria/traceability.md from requirements
docs/project-files/verification/   → DP-xx checklists (merged at /v or /v+codex)
docs/project-files/verification-reports/ → evidence + optional Codex review
docs/project-files/defects/inbox/  → optional defect mirror (e.g. ClickUp sync)
docs/project-files/build-evidence/ → FEAT_* contracts during build
docs/project-files/regression/regression-plan.md → executable test inventory (required at slice closeout)
docs/product-manager-agent/        → PM agent + implementation catalog
docs/implemented-design/design/    → cross-cutting rules (modules, ui-controls, DB boundary)
docs/modules/                      → per-feature as-built (primary location)
tests/ (unit/, end_to_end/, …)     → executable regression — see SCAFFOLD.md
tests/validation/                  → legacy shim only — do not add new tests here
```

Promote stable decisions from `docs/project-files/build-evidence/` into `docs/implemented-design/`, `docs/modules/`, and `databases/*.md` contracts.

---

## Repository layout

Monorepo: **application database (SQL, when used)** + **app** + **shared governance**. Omit `databases/`, `frontend/`, or `deployments/web/` when vision says they do not apply.

```text
mfgcidashboard/
  bootstrap.md              # local copy; gitignored
  README.md
  AGENTS.md
  HANDOFF.md                    # gitignored
  .gitignore
  .env.example
  .cursorignore
  pyproject.toml

  # ── App (architecture authority) ──────────────────────────────
  src/mfgcidashboard_app/
    __init__.py
    api/                        # HTTP API (e.g. FastAPI) — omit if vision is jobs-only
    app_shell/                  # layout, navigation, auth, theme (when UI exists)
    core/                       # config, logging, errors, permissions
    db/                         # engines, sessions, health (when app uses SQL)
    integrations/               # warehouse, openai, clickup, agents
    shared/                     # reusable helpers
    modules/                    # vertical slices by module_id / feature
      foundations/
        home/
        example_data_entry/
    jobs/                       # scheduled / batch entrypoints (optional)
    main.py                     # or api_main.py — per vision

  tests/
    README.md
    SCAFFOLD.md                 # master checklist — Planned vs Populated per layer
    conftest.py
    orchestrators/              # run_*_regression.sh
    unit/
    integration/
    database/
    contract/
    end_to_end/
      workflows/
      smoke/
    security/                   # planned stubs + README
    performance/                # planned stubs + README
    acceptance/                 # planned stubs + README
    helpers/
    validation/                 # legacy shim only — do not add new tests
    smoke-tests/                # legacy — use end_to_end/smoke/
    health-checks/                # legacy
    data-checks/                  # legacy

  frontend/                     # optional — only when vision specifies a client UI (e.g. React SPA)
    src/
      app/
      features/
      shared/

  # ── Database ──────────────────────────────────────────────────
  databases/
    AGENTS.md
    CIDashboard/
      platform/                 # cross-slice SQL
        tables/
        stored-procedures/
        views/
        functions/
      modules/
        _template/
        <module_id>/
          <feature>/
  deployments/
    DEPLOY.md
    web-addresses.md
    shared/
      deployment_order.md
    env/
      README.md
      mfgcidashboard.dev.env
      mfgcidashboard.tst.env
      mfgcidashboard.prd.env
      nav-visibility.txt
      local-dev-sql.env.example
      local-tst-sql.env.example
      secrets.example.env
    scripts/
      Install-ProjectEnv.ps1
      Deploy-AppSql.ps1
      Deploy-App.ps1
      Deploy-AppRegression.ps1
    web/
      README.md
      setup_mfgcidashboard_web.ps1    # optional — when org uses IIS or similar
    dev/                          # feature-specific deploy helpers (not “the DEV tier”)
  servers/schedules/
    README.md
    SRVIRQSQLDEV/
      manifest.json
  tools/
    ci/
      clickup_sync_defects.py   # optional — only if using ClickUp defects

  # ── All documentation under docs/ ─────────────────────────────
  docs/
    architecture/               # optional redirect stubs → requirements/vision/
    requirements/
      vision/
        mfgcidashboard_architecture_for_cursor.md
        mfgcidashboard_ui_spec_for_cursor.md
      slices/
        README.md
        _xx-slice-name/
          success-criteria/       # template — SC-xx checklists (recommended)
            README.md
        00-foundations/
          00-foundations-requirements.md
          deviations/
          input-files/
    modules/
      README.md
      foundations/
        README.md
    implemented-design/
      README.md
      design/
        naming.md
        modules.md
        feature-ownership.md
        app-database-boundary.md
        ui-controls.md
    project-files/
      system/
        ci-setup.md
        bug-workflow.md
        containerization.md
      defects/
        inbox/
        _TEMPLATE-defect.md
        index.md
      regression/
        regression-plan.md
      project-plan/
        README.md
        solution/
          solution-overview.md
          mfgcidashboard-program.md
        slices/
          _TEMPLATE-slice-tasks.md   # includes final-phase success-criteria + SCAFFOLD tasks
          00-foundations-tasks.md
      build-evidence/
      verification/
        design-patterns/          # DP-xx checklists (not pytest)
        README.md
      verification-reports/       # /v and /v+codex output
        README.md
        _example/                 # optional report shape example
    gpt-instructions/                   # optional — legacy; prefer product-manager-agent/
      implementation-catalog.md         # optional duplicate; canonical in product-manager-agent/
    product-manager-agent/              # PM agent (fetched from agent-product-manager repo)
      AGENTS.md
      implementation-catalog.md
      regression-and-closeout.md
      slice-authoring.md
      templates/success-criteria/
    bootstrap/
      README.md
      bootstrap.md            # canonical bootstrap runbook
    new-repo-bootstrap-kit/          # kit — templates + developer.md (bootstrap is pointer only)
      README.md
      developer.md
      chatgpt-slice-authoring.md
      slice-requirements-template.md
      templates/
    developer.md                # copied from new-repo-bootstrap-kit/developer.md (human onboarding)
    glossary/
      mfgcidashboard-glossary.md

  .cursor/
    rules/
      session-handoff.mdc
      active-slice.mdc
      defect-workflow.mdc    # optional — ClickUp defect loop
    skills/
      mfgcidashboard-core/
        SKILL.md
      mfgcidashboard-slice-plan/       # recommended — sync tasks + test closeout
        SKILL.md
      mfgcidashboard-verify-codex/    # optional — /v+codex workflow
        SKILL.md
      mfgcidashboard-clickup-defects/ # optional
        SKILL.md
    commands/
      v.md                        # recommended
      cleanup.md                  # recommended
      vcodex.md                   # optional — with verify-codex skill
    active-slice.example
    active-defects.example   # optional
    hooks/
      PROGRESS_HANDOFF_TEMPLATE.md
      update_handoff.py
      update-progress-handoff.ps1
    hooks.json                  # local only
```

### What goes where (app vs SQL)

| Concern | Location | Notes |
|---------|----------|--------|
| HTTP routes / UI entry | `src/mfgcidashboard_app/api/` and/or `frontend/src/features/` | Per vision — API-only repos skip `frontend/` |
| Business logic | `.../service.py` | No SQL, no UI framework imports in service |
| Database access | `.../repository.py` | Parameterized SQL via SQLAlchemy (when SQL is used) |
| Schemas | `.../schemas.py` | Pydantic models |
| Shared navigation | `src/mfgcidashboard_app/app_shell/navigation.py` | When app has a navigable UI |
| Table DDL, procs | `databases/CIDashboard/...` | One file per object: `[dbo].[Name].sql` |
| Table contracts | `databases/CIDashboard/<OBJECT>.md` | Governed contracts |
| Deploy scripts | `deployments/scripts/` | Follow `deployment_order.md` when SQL deploy exists |
| Per-env config | `deployments/env/mfgcidashboard.<tier>.env` | Committed; copied to `.env.local` on servers |
| External reads | `src/mfgcidashboard_app/integrations/` | Read-only dependencies (warehouse, ERP, etc.) |

**Rule:** Prefer SQL in `databases/` for data rules and writes exposed to the app. Keep Python services thin.

### Slice requirements folder (critical — do not nest code under slices)

**Wrong:** creating `database/`, `tests/`, `docs/`, or `src/` **inside** `docs/requirements/slices/NN-name/`. Bootstrap agents sometimes copy an old “slice bundle” layout — **do not do this**.

**Allowed under `docs/requirements/slices/NN-kebab-name/` only:**

```text
NN-kebab-name-requirements.md
deviations/          ← mid-slice pivots
input-files/         ← mockups, source SQL (optional — when they define acceptance)
success-criteria/    ← SC-xx verification checklists (recommended at approval)
```

**Do not create:** `addendums/`, `fixes/`, `notes/`, `database/`, `tests/`, `docs/`, `src/` under slice folders unless an explicit legacy exception is documented.

| Artifact | Correct location |
|----------|------------------|
| Task list | `docs/project-files/project-plan/slices/NN-name-tasks.md` |
| Python | `src/mfgcidashboard_app/modules/<module_id>/<feature>/` |
| SQL | `databases/CIDashboard/modules/<module_id>/<feature>/` or `databases/CIDashboard/platform/` |
| Tests | `tests/` (repo root) + optional feature `tests/` under `src/.../` |
| Build evidence | `docs/project-files/build-evidence/` |
| As-built | `docs/modules/<module_id>/features/<feature>/` |
| QA bugs | Optional tracker (e.g. ClickUp) + `docs/project-files/defects/inbox/` |

Copy **`_xx-slice-name/`** for new slices — not a blind copy of `00-foundations/` if it contains legacy folders.

---

## Agent rules (always)

1. Execute phases **0 (Step 0 profile first) → 1 → 2a → 2b → 3 → 4 → 5 → 6 → 7** in order. **Never scaffold app code or SQL before Phase 0 Step 0 is approved.**
2. **STOP gates** — pause for human approval unless they approve multi-phase runs.
3. **Architecture wins** — scaffold `src/mfgcidashboard_app/` per vision docs; do not use global `pages/` + `services/` layout.
4. **Commits** — only when the human explicitly asks.
5. **Secrets** — never commit `.env`, `.env.local`, or live tokens in env files without human approval for that project's policy.
6. **New chats:** first ~120 lines of `HANDOFF.md` → `.cursor/active-slice` or `.cursor/active-defects` → `AGENTS.md` → `.cursor/skills/mfgcidashboard-core/SKILL.md`.
7. **Slice requirements folders:** only main `.md` + `deviations/` + `input-files/` + `success-criteria/` — never nest `database/`, `tests/`, `docs/`, or `src/` under `docs/requirements/slices/`.
8. **HANDOFF size:** stop hook writes a one-line working-tree summary only; ask the agent for a full narrative snapshot during a session when needed.

---

## Naming conventions

| Layer | Convention | Examples |
|-------|------------|----------|
| Repo directories | **kebab-case** | `build-evidence`, `smoke-tests` |
| Python package / app | **snake_case** | `mfgcidashboard_app`, `work_order_lookup` |
| Module / feature folders | **snake_case** | `modules/foundations/home/` |
| Database folders | **SCREAMING_SNAKE** | `CIDashboard` |
| SQL script files | **`[dbo].[ObjectName].sql`** | under `databases/.../` |
| Env vars | **SCREAMING_SNAKE** | `APP_DB_HOST`, `APP_DB_URL`, `WAREHOUSE_DB_URL` |
| Deploy env files | **`mfgcidashboard.<tier>.env`** | `mfgcidashboard.dev.env` |
| Slice folders / files | **kebab-case** | `00-foundations/`, `00-foundations-tasks.md` |
| Build evidence | **`FEAT_<NAME>_<suffix>.md`** | `FEAT_HOME_closeout.md` |

See `docs/implemented-design/design/naming.md` after Phase 4.

---

## Phase 0 — Repository shell

**Goal:** Confirm what kind of app this is, seed vision docs, then create monorepo skeleton matching architecture + unified `docs/` layout.

### Step 0 — Project profile (mandatory first STOP)

**Do this before Step 1.** Bootstrap must not guess delivery type from repo name or default templates.

1. **Check** `docs/requirements/vision/mfgcidashboard_architecture_for_cursor.md` for a filled **Project profile** table (see kit template).
2. **If missing or incomplete** — ask the human **once**. **Default offer:** org standard **full-stack** (React + FastAPI + SQL Server + IIS) — link [`org-standard-fullstack-stack.md`](new-repo-bootstrap-kit/templates/org-standard-fullstack-stack.md) and ask: *Use org standard full-stack, or something else (API-only / batch / other UI)?*
   - If **full-stack (org standard)** or user confirms server setup matches: seed from [`vision-architecture-fullstack.md`](new-repo-bootstrap-kit/templates/vision-architecture-fullstack.md) + [`vision-ui-spec-fullstack.md`](new-repo-bootstrap-kit/templates/vision-ui-spec-fullstack.md); copy stack reference to `docs/project-files/system/org-standard-fullstack-stack.md`. Ask **local database:** if not SQL Server on laptop → set vision to **sqlite** (recommended) or **postgresql** and point to the matching `local-dev-*.env.example`.
   - If **other profile**, ask briefly:
     - What does the app do? (1–2 sentences)
     - **Delivery type:** API-only, SPA + API, server UI, batch/jobs only, or mixed?
     - **Owned SQL database** in this repo (yes/no)?
     - **Local database (laptop):** Microsoft SQL Server (remote DEV), **SQLite**, or **PostgreSQL**? If the user will **not** use SQL Server locally, **recommend SQLite** (simplest) or **PostgreSQL** (closer to shared DEV) — do not require local SQL Server install. Record choice in vision **Local database** row.
     - **User interface:** none, separate SPA, or server-rendered pages?
   - Seed generic [`vision-architecture-stub.md`](new-repo-bootstrap-kit/templates/vision-architecture-stub.md) when not using org full-stack template.
3. **If vision already exists** — summarize Project profile + **stack table** (React/FastAPI/SQL/IIS or alternate) back to the human and ask **confirm or correct** before Step 1.
4. **STOP 0-profile** — do not create `src/`, `databases/`, `frontend/`, or deploy env beyond placeholders until approved.

Phases **1, 2a, 2b, and 6** branch on this profile (skip SQL, UI, `nav-visibility.txt`, etc. when profile says so).

### Steps (after profile approved)

1. Replace all [placeholders](#placeholders-replace-before-bootstrap) in this file and in copied templates.
2. Create directory tree from [Repository layout](#repository-layout) (skip files that already exist).
3. Keep existing `docs/requirements/vision/*.md` — do not move or overwrite without human approval.
4. Copy this file to repo root as `bootstrap.md` if not already present.
5. Copy **`docs/bootstrap/new-repo-bootstrap-kit/developer.md`** → **`docs/developer.md`**; replace placeholders; link from root `README.md`.
6. Keep **`docs/bootstrap/new-repo-bootstrap-kit/`** in repo (or copy kit from reference) — ChatGPT files stay here; humans attach them to ChatGPT project.
7. Create **`AGENTS.md`** at repo root (template below).
8. Create **`.cursorignore`** (template below).
9. Update **`.gitignore`** (template below).

### `.gitignore` additions

```gitignore
# Cursor hooks (per-machine)
.cursor/hooks.json

# Local-only docs
docs/local/

# Local SQLite files (when APP_DB_ENGINE=sqlite)
data/
*.db
```

(Ensure existing entries for `.env.local`, `HANDOFF.md`, `/bootstrap.md`, `.cursor/active-slice`, `.cursor/active-defects` remain.)

### `.cursorignore`

```gitignore
.venv/
node_modules/
dist/
**/dist/
.git/
.idea/
**/.DS_Store
docs/local/
```

### `AGENTS.md` (repo root)

```markdown
# MFGCIDashboard — agent instructions

Monorepo: **SQL Server** (`databases/`, `deployments/`, `servers/schedules/` — when used) + **app** (`src/mfgcidashboard_app/`, optional `frontend/`). All documentation under `docs/`.

**New chat:** Read the first ~120 lines of [`HANDOFF.md`](HANDOFF.md), then **`.cursor/active-slice`** (feature work) or **`.cursor/active-defects`** (bug fixes, if used), then this file, then [`.cursor/skills/mfgcidashboard-core/SKILL.md`](.cursor/skills/mfgcidashboard-core/SKILL.md). **Human onboarding:** [`docs/developer.md`](docs/developer.md). **PM agent (requirements):** [`docs/product-manager-agent/`](docs/product-manager-agent/).

**Optional ClickUp defects:** [`.cursor/skills/clickup-defects/SKILL.md`](.cursor/skills/clickup-defects/SKILL.md) + `tools/ci/clickup_sync_defects.py` — only when the project uses ClickUp; see [`bug-workflow.md`](docs/project-files/system/bug-workflow.md).

**Architecture authority:** [`docs/requirements/vision/mfgcidashboard_architecture_for_cursor.md`](docs/requirements/vision/mfgcidashboard_architecture_for_cursor.md) | [`docs/requirements/vision/mfgcidashboard_ui_spec_for_cursor.md`](docs/requirements/vision/mfgcidashboard_ui_spec_for_cursor.md)

**Key references:** [README.md](README.md) | [docs/requirements/](docs/requirements/) | [docs/project-files/project-plan/](docs/project-files/project-plan/) | [docs/implemented-design/](docs/implemented-design/) | [databases/AGENTS.md](databases/AGENTS.md)

## Repository structure

```text
src/mfgcidashboard_app/        App — vertical slices under modules/<module_id>/
frontend/                 Optional client UI — only when vision specifies
databases/CIDashboard/       Application database (DDL, procs, contracts) — when used
deployments/              Env files, deploy scripts, web host helpers (when used)
servers/schedules/        SQL Agent job cards
docs/requirements/vision/ Architecture + UI spec
docs/project-files/       Project plan + build evidence
docs/implemented-design/  Cross-cutting as-built design
docs/modules/             Per-feature as-built docs
tests/                    Pytest + functional regression
.cursor/                  Rules, skills, hooks (hooks.json local only)
```

## Document lifecycle

| Path | Role |
|------|------|
| `docs/requirements/` | Human phase inputs — agents do not edit during active build |
| `docs/project-files/project-plan/` | Agent-synced phase checklists |
| `docs/project-files/build-evidence/` | Per-feature build evidence |
| `docs/project-files/defects/` | QA bugs (optional — e.g. ClickUp mirror) |
| `docs/project-files/system/bug-workflow.md` | Defect lane (optional) |
| `docs/implemented-design/` | Cross-cutting as-built design |
| `docs/modules/` | Per-feature as-built docs |

## Environment

**Local development**

- Template: `.env.example` | Secrets: `.env.local` (gitignored)
- Optional SQL blocks: `deployments/env/local-dev-sql.env.example`, `local-tst-sql.env.example`
- Load: `set -a && source .env.local && set +a`

**Deployed servers (DEV / TST / PRD)**

- Committed: `deployments/env/mfgcidashboard.{dev,tst,prd}.env`
- Install: `.\deployments\scripts\Install-ProjectEnv.ps1 -Environment dev|tst|prd`
- Guide: [`deployments/DEPLOY.md`](deployments/DEPLOY.md)

## Do not

- Commit `.env`, `.env.local`, `HANDOFF.md`, `/bootstrap.md`, `.cursor/hooks.json`, `.cursor/active-slice`, or `.cursor/active-defects`
- Put SQL in UI or route handlers or call OpenAI from UI code
- Add `frontend/` unless vision or an explicit human override requires a client UI
- Create git commits unless the user explicitly asks
```

### Verify

- [ ] **Project profile** approved (STOP 0-profile) — vision architecture doc has filled profile table
- [ ] UI spec present **only** when profile includes a client UI
- [ ] `docs/requirements/vision/` preserved or seeded from kit templates
- [ ] `docs/requirements/`, `docs/implemented-design/`, `docs/project-files/`, `docs/modules/` scaffolded
- [ ] **`docs/developer.md`** copied from bootstrap template; placeholders replaced
- [ ] **`AGENTS.md`**, **`.cursorignore`**, **`.gitignore`** updated with placeholders replaced
- [ ] No top-level `requirements/` folder

**STOP 0**

---

## Phase 1 — Environment + tooling

**Goal:** Two-layer env model — local `.env.local` for developers; committed `deployments/env/mfgcidashboard.<tier>.env` for servers (Phase 6 fills deploy files).

### A. Local development (`.env.example` → `.env.local`)

1. Copy **`docs/bootstrap/new-repo-bootstrap-kit/templates/dot.env.example`** → **`.env.example`** at repo root; replace placeholders. The file uses **comment blocks** to explain each section (required vs optional integrations).

2. Document load pattern in README and **`docs/developer.md`** §7:

   ```bash
   cp .env.example .env.local
   # edit .env.local — follow FILL markers in the file
   set -a && source .env.local && set +a
   ```

3. Create **`pyproject.toml`** (replace `mfgcidashboard` / `mfgcidashboard_app`; add UI-specific deps only when vision requires them):

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
   local-postgres = ["psycopg[binary]>=3.1"]
   # local-sqlite: no extra driver (SQLAlchemy built-in)

   [tool.pytest.ini_options]
   testpaths = ["tests", "src/mfgcidashboard_app/modules"]

   [tool.ruff]
   line-length = 100
   ```

   **Full-stack org standard:** add `ldap3`; frontend deps in `frontend/package.json` per [org-standard-fullstack-stack.md](new-repo-bootstrap-kit/templates/org-standard-fullstack-stack.md) (React 19, Mantine 9, TanStack, etc.). **Local DB not SQL Server:** configure `.env.local` from `local-dev-sqlite.env.example` or `local-dev-postgres.env.example`; add `local-postgres` extra when using PostgreSQL. **Deployed tiers** stay SQL Server (`pyodbc`/`pymssql`). **API-only / no SQL:** drop DB drivers and `db/` per vision. **Do not** add NiceGUI.

4. Create venv: `python3 -m venv .venv && source .venv/bin/activate && pip install -e ".[dev]"`

### B. Deploy env scaffold (committed — detail in Phase 6)

Copy the entire **`docs/bootstrap/new-repo-bootstrap-kit/`** folder into the new repo (includes **`templates/`**). Phase 1 **expands** template files into operational paths; do not delete `templates/` afterward — it remains the canonical stub set.

| Bootstrap template | Deploy to |
|--------------------|-----------|
| `docs/bootstrap/new-repo-bootstrap-kit/templates/project.dev.env` | `deployments/env/mfgcidashboard.dev.env` |
| `docs/bootstrap/new-repo-bootstrap-kit/templates/project.tst.env` | `deployments/env/mfgcidashboard.tst.env` |
| `docs/bootstrap/new-repo-bootstrap-kit/templates/project.prd.env` | `deployments/env/mfgcidashboard.prd.env` |
| `docs/bootstrap/new-repo-bootstrap-kit/templates/local-dev-sql.env.example` | `deployments/env/local-dev-sql.env.example` |
| `docs/bootstrap/new-repo-bootstrap-kit/templates/local-dev-sqlite.env.example` | `deployments/env/local-dev-sqlite.env.example` |
| `docs/bootstrap/new-repo-bootstrap-kit/templates/local-dev-postgres.env.example` | `deployments/env/local-dev-postgres.env.example` |
| `docs/bootstrap/new-repo-bootstrap-kit/templates/deployments-env-README.md` | `deployments/env/README.md` |
| `docs/bootstrap/new-repo-bootstrap-kit/templates/active-slice.example` | `.cursor/active-slice.example` |
| `docs/bootstrap/new-repo-bootstrap-kit/templates/org-deployment-profile.md` | `docs/project-files/system/org-deployment-profile.md` |
| `docs/bootstrap/new-repo-bootstrap-kit/templates/org-standard-fullstack-stack.md` | `docs/project-files/system/org-standard-fullstack-stack.md` _(when profile = full-stack)_ |

Also seed `nav-visibility.txt` when vision includes a **navigable UI** (org full-stack SPA: **yes**). Optional: `local-tst-sql.env.example` — copy DEV example and change host. **API-only / batch:** skip `nav-visibility.txt`.

**ClickUp / OpenAI blocks:** leave commented out or empty unless the project uses those integrations.

### Verify

- [ ] `.env.example` committed; `.env.local` gitignored
- [ ] `pyproject.toml` + `.venv` work
- [ ] `deployments/env/` stub files exist

**STOP 1**

---

## Phase 2a — Database scaffold

**Goal:** SQL layout for the application database **when vision includes an owned app DB**.

### When to skip (report at STOP 2a and continue)

Skip this entire phase when **`docs/requirements/vision/`** specifies **no application database** (API-only external reads, batch file I/O, serverless, etc.):

- Do **not** create `databases/CIDashboard/` or `servers/schedules/`
- Seed `databases/README.md` stating the solution has no owned DB (or document read-only external deps in `integrations/`)
- Skip SQL blocks in `.env.example` / deploy env files if unused
- Proceed to Phase 2b

### Steps (when vision includes `CIDashboard`)

1. **`databases/CIDashboard/platform/`** — subfolders: `tables/`, `stored-procedures/`, `views/`, `functions/`.
2. **`databases/CIDashboard/modules/_template/`** — same subfolders (per-feature SQL under `modules/<module_id>/<feature>/`).
3. Seed governed contract: `databases/CIDashboard/platform/FeatureRegistry.md`.
4. **`databases/AGENTS.md`** — adapt from reference monorepo or write fresh.
5. **`deployments/shared/deployment_order.md`** — `CIDashboard` deploy order.
6. **`servers/schedules/SRVIRQSQLDEV/manifest.json`** — `{ "server": "SRVIRQSQLDEV", "exported_at": null, "jobs": [] }`.
7. **`docs/implemented-design/design/app-database-boundary.md`** — App writes to `CIDashboard`; reads warehouse via integrations; no warehouse ETL in this repo (if applicable). Document **local vs deployed** engine: SQL Server on DEV/TST/PRD; laptop may use SQLite or PostgreSQL per vision.

**Local database (Phase 2a note):** `databases/CIDashboard/` DDL remains **SQL Server** (deployed source of truth). When vision specifies SQLite or PostgreSQL for local dev, seed `db/engines.py` to read `APP_DB_ENGINE` + `APP_DB_URL` and note dialect validation in CI/DEV — do not rewrite DDL for SQLite/Postgres unless human requests it.

**Do not** put SQL under `docs/requirements/slices/` — see [Slice requirements folder](#slice-requirements-folder-critical--do-not-nest-code-under-slices).

### Verify

- [ ] **With app DB:** `databases/AGENTS.md` present; `deployments/` and `servers/schedules/` documented in README
- [ ] **Without app DB:** skip documented in vision + `databases/README.md`; no empty SQL tree scaffolded

**STOP 2a**

---

## Phase 2b — App scaffold (architecture layout)

**Goal:** App at `src/mfgcidashboard_app/` (+ `frontend/` when SPA) per `mfgcidashboard_architecture_for_cursor.md`.

**Do not** create global `pages/` folder or `apps/api` + `apps/web` split unless architecture says so.

### Full-stack org standard (when profile = SPA + API)

Follow [`org-standard-fullstack-stack.md`](new-repo-bootstrap-kit/templates/org-standard-fullstack-stack.md) explicitly:

1. **`src/mfgcidashboard_app/api_main.py`** — entrypoint; one process serves static SPA + `/api/*` in production
2. **`src/mfgcidashboard_app/api/`** — FastAPI app, LDAP session middleware stub, mount routers at `/api`
3. **`src/mfgcidashboard_app/modules/.../routes.py`** — thin routers per feature
4. **`frontend/`** — Vite + React 19 + Mantine 9 + TypeScript; TanStack Query, React Router; Mantine `AppShell` stub
5. **`databases/CIDashboard/`** — Phase 2a (required)
6. **`deployments/web/`** — IIS httpPlatform + `runserver.py` notes; `setup_mfgcidashboard_web.ps1`
7. **`deployments/env/nav-visibility.txt`** — keys match SPA routes
8. **README** — `python -m mfgcidashboard_app.api_main` + `cd frontend && npm run dev`; Vite `/api` proxy

**Do not scaffold NiceGUI, `app_shell/` pages, or server-rendered Python UI.**

**Verify (full-stack):** `GET /api/health` → 200; SPA home loads via Mantine shell; Playwright smoke stub optional.

### Other profiles

**Skip `frontend/`** when vision is API-only or batch-only. **Never scaffold NiceGUI** for org standard full-stack.

### Steps (all profiles)

1. Scaffold `src/mfgcidashboard_app/` per vision:
   - **`api/`** — FastAPI app factory, `/api/*` routers, health, auth middleware — **org standard**
   - **`api_main.py`** — production + local entry (static SPA + API)
   - **`app_shell/`** — **do not scaffold** (NiceGUI removed from org standard; React Mantine shell lives in `frontend/`)
   - **`core/`** — `config.py`, `logging.py`, `errors.py`
   - **`db/`** — `engines.py`, `sessions.py`, `health.py` — when app uses SQL Server
   - **`integrations/`** — stubs for external systems (warehouse, ticketing, LLM)
   - **`shared/`** — cross-feature helpers
   - **`modules/foundations/`** — bootstrap stubs with `service.py`, `repository.py`, `schemas.py`, `tests/`:
     - **HTTP API (default):** `health/` or `home/` with route registration only
     - **Navigable UI:** add `example_data_entry/`, `example_dashboard/` and wire `app_shell/navigation.py`
     - **Batch / jobs only:** minimal `foundations/` stub or single job module — omit HTTP examples
   - **Entrypoint** — `main.py` or `api_main.py` per vision (e.g. `uvicorn` for API, or job runner for batch)

   **API-only / no menu:** do **not** scaffold UI example modules or `deployments/env/nav-visibility.txt`.

2. **`frontend/`** (org full-stack **required**):
   - React 19 + Mantine 9 + Vite + TypeScript — see org-standard-fullstack-stack.md for client libs
   - Document: `python -m mfgcidashboard_app.api_main` + `npm run dev`

3. Follow patterns in architecture doc:
   - Each feature exposes registration hooks appropriate to the stack (`register_*_routes`, feature modules, etc.)
   - Central navigation or API registry when applicable

4. Run per vision (examples):

   ```bash
   set -a && source .env.local && set +a
   source .venv/bin/activate
   # Org standard:
   python -m mfgcidashboard_app.api_main
   # SPA (separate terminal):
   cd frontend && npm run dev
   ```

### Verify

- [ ] App starts at configured host/port (or job runs) per vision
- [ ] Health or home endpoint responds when HTTP is in scope
- [ ] Example modules are stubs only — easy to delete later
- [ ] No SQL in route handlers or UI components
- [ ] `frontend/` present **only** when vision requires a client UI
- [ ] UI-only artifacts absent when vision is API-only (`app_shell/`, UI example modules, `nav-visibility.txt`)

**STOP 2b**

---

## Phase 3 — Regression tests (layered)

**Goal:** Pytest + functional scripts under `tests/` with a **SCAFFOLD.md** master checklist. Seed **regression closeout discipline** from day one — slices do not close without executed tests.

### Closeout rule (non-optional)

Every slice's `*-tasks.md` **final phase** must:

1. **Create** tests in canonical `tests/` paths (see SCAFFOLD layer table below)
2. **Register** scripts in `docs/project-files/regression/regression-plan.md`
3. **Execute** pytest, flow scripts, and UI smoke before marking the slice done
4. **Evaluate** `success-criteria/` SC-xx rows with evidence

PM agent authors **regression intent** in requirements; Cursor maps intent to concrete tests during task sync. See [`vendor/agent-product-manager/regression-and-closeout.md`](new-repo-bootstrap-kit/vendor/agent-product-manager/regression-and-closeout.md) or `docs/product-manager-agent/regression-and-closeout.md` after Phase 4.

### Layout

```text
tests/
  README.md
  SCAFFOLD.md              # Planned vs Populated per folder — update when tests land
  conftest.py
  orchestrators/
    run_mfgcidashboard_regression.sh
  unit/
    app/                   # startup, config
    navigation/
    services/
  integration/
    database/
    api/                   # when HTTP API exists
  database/
    deploy/
    schema_validation/
  end_to_end/
    workflows/
    smoke/                 # Playwright / UI smoke when applicable
  contract/                # stub README per external system
  helpers/
  validation/              # legacy shim ONLY — do not add new tests here
  smoke-tests/.gitkeep     # legacy redirect note in SCAFFOLD
  health-checks/.gitkeep
  data-checks/.gitkeep
```

Seed `integration/database/verify_db_connection.py` — `SELECT 1` via configured SQL driver.

Feature colocated tests may also live under `src/mfgcidashboard_app/modules/**/tests/`.

Promote scripts from `docs/project-files/build-evidence/` into canonical SCAFFOLD paths when features close — **not** into `tests/validation/`.

Seed `docs/project-files/regression/regression-plan.md` from kit [`templates/regression-plan.md`](new-repo-bootstrap-kit/templates/regression-plan.md).

Register executed tests in `regression-plan.md` during each slice **final phase** — not as an afterthought.

**STOP 3**

---

## Phase 4 — Requirements, project-files, implemented-design

**Goal:** Human inputs, project plan, and design doc shells under `docs/`.

### A. `docs/requirements/slices/`

- Copy **`README.md`**, **`_xx-slice-name/`** template, and **`_template/success-criteria/`** (from kit `vendor/agent-product-manager/templates/success-criteria/`).
- Seed `00-foundations/00-foundations-requirements.md` with **only**: main doc + optional `deviations/README.md` + `input-files/README.md` + `success-criteria/README.md`.
- **Never** create `database/`, `tests/`, `docs/`, `src/`, `addendums/`, or `fixes/` under a slice folder.

### B. `docs/project-files/project-plan/`

Requirements → `slices/*-tasks.md`. Create `solution/solution-overview.md` (no tasks). Seed `slices/00-foundations-tasks.md` from kit [`templates/_TEMPLATE-slice-tasks.md`](new-repo-bootstrap-kit/templates/_TEMPLATE-slice-tasks.md) — **must include final phase**: SC-xx completion, test **create + register + execute**, SCAFFOLD update, regression-plan rows, as-built docs.

Copy `slices/_TEMPLATE-slice-tasks.md` from the same kit template for future slices.

### C. `docs/implemented-design/` and `docs/modules/`

Create `implemented-design/README.md` (feature as-built lives in **`docs/modules/`**, not `implemented-design/features/`), `design/naming.md`, `design/modules.md`, `design/feature-ownership.md`, `design/app-database-boundary.md`, `design/ui-controls.md`. Seed `docs/modules/README.md`.

### D. `docs/product-manager-agent/`, build-evidence, verification

#### Org default — install PM agent (Phase 4)

The bootstrap kit ships a **committed vendor copy** at `new-repo-bootstrap-kit/vendor/agent-product-manager/`. Phase 4 usually needs **no GitLab token**.

```bash
bash docs/bootstrap/new-repo-bootstrap-kit/scripts/fetch-product-manager-agent.sh docs/product-manager-agent
```

| Step | Behavior |
|------|----------|
| **Default** | Copies from kit `vendor/agent-product-manager/` → `docs/product-manager-agent/` |
| **Pull only if needed** | If vendor is empty: `export GITLAB_TOKEN=glpat-…` (read_repository), then re-run the script |

Project ID is **not** used for install — only for API / MCP in `project-connection.md` (after install).

Details: [`vendor/README.md`](new-repo-bootstrap-kit/vendor/README.md)

Replace `MFGCIDashboard` placeholders in `implementation-catalog.md` and fill `project-connection.md`.

Copy mockup verification pattern to running repo:

`docs/product-manager-agent/design-patterns/mockup-verification.md` → `docs/project-files/verification/design-patterns/mockup-verification.md`

| Path | Seed |
|------|------|
| `build-evidence/` | README |
| `regression/regression-plan.md` | From kit [`templates/regression-plan.md`](new-repo-bootstrap-kit/templates/regression-plan.md) |
| `verification/README.md` | Hub — SC-xx vs DP-xx vs executable tests |
| `verification/design-patterns/README.md` | DP-xx pattern stubs + mockup-verification |
| `verification-reports/README.md` + `_example/` | Optional report shape |
| `product-manager-agent/` | **Vendor copy** from kit, or **pull** if vendor empty (see fetch script) |

Optional legacy path `docs/gpt-instructions/` may hold a symlink or README pointing to `docs/product-manager-agent/` — prefer the new path for new repos.

### E. `docs/developer.md`

Already copied in Phase 0 — verify placeholders replaced and root `README.md` links to it. This is the **primary short guide** for humans (modules, slices, prompts, env, skills, `/v`).

**STOP 4**

---

## Phase 5 — Cursor: HANDOFF, rules, stop hook

**Goal:** Session continuity without session-end agent hangs.

### A. `HANDOFF.md`

- Repo root, gitignored; target **~80 lines**
- Seed from `.cursor/hooks/PROGRESS_HANDOFF_TEMPLATE.md` (adapt title to `MFGCIDashboard`)
- **Never** embed full `git status` output

### B. `.cursor/rules/`

Also copy **`docs/bootstrap/new-repo-bootstrap-kit/templates/active-slice.example`** → `.cursor/active-slice.example`.

Scaffold or copy:

- `session-handoff.mdc` — new chats read first ~120 lines of `HANDOFF.md`; stop hook refreshes git state
- `active-slice.mdc` + `active-slice.example`
- `slice-deviations.mdc` — mid-slice pivot workflow
- `verification-mode.mdc` + `.cursor/commands/v.md` — `/v` verification
- `cleanup-mode.mdc` + `.cursor/commands/cleanup.md` — `/cleanup` lint/test pass
- `verification-codex.mdc` + `.cursor/commands/vcodex.md` — **optional** `/v+codex`
- `ui-page-patterns.mdc`, `ui-title-case.mdc` — **optional** when UI-heavy
- `defect-workflow.mdc` + `active-defects.example` — **only if using ClickUp defects**

After handoff: `.cursor/active-slice` → `AGENTS.md` → `.cursor/skills/mfgcidashboard-core/SKILL.md` (+ `slice-plan` when syncing tasks)

### C. Stop hook

- `update_handoff.py` — refreshes **Last updated**, **Updated by**, **Repository state**; stdout **`{}` only**
- `PROGRESS_HANDOFF_TEMPLATE.md`
- `update-progress-handoff.ps1` — optional Windows wrapper

**Critical:** do **not** use `followup_message` in hook output.

Create **local** `.cursor/hooks.json`:

```json
{
  "version": 1,
  "hooks": {
    "stop": [
      {
        "command": "python3 .cursor/hooks/update_handoff.py"
      }
    ]
  }
}
```

On Windows: `"command": "pwsh -NoProfile -File .cursor/hooks/update-progress-handoff.ps1"`

### D. ClickUp defects (optional — skip if project does not use ClickUp)

**Skip this subsection entirely** when the project has no ClickUp integration. Leave ClickUp vars commented in env files; do not scaffold `clickup-defects` skill or `defect-workflow.mdc`.

**If using ClickUp:**

**Human:**

1. Create a dedicated **defects** list (separate from feature/task lists).
2. Set in env: `CLICKUP_BUG_LIST_ID`, `CLICKUP_BUG_LIST_NAME`, `CLICKUP_API_TOKEN`.

**Agent (scaffold):**

| Path | Role |
|------|------|
| `docs/project-files/system/bug-workflow.md` | End-to-end defect lane |
| `docs/project-files/defects/` | Inbox mirror + template |
| `docs/project-files/regression/regression-plan.md` | Required test per bug |
| `tools/ci/clickup_sync_defects.py` | Sync list → `defects/inbox/*.md` |
| `src/mfgcidashboard_app/integrations/clickup/` | REST client |
| `.cursor/skills/clickup-defects/SKILL.md` | Agent instructions — **API only, not MCP** |
| `.cursor/rules/defect-workflow.mdc` | Fix loop when `active-defects` set |

Verify: `python tools/ci/clickup_sync_defects.py --dry-run`

### E. `.cursor/skills/`

| Skill | Required | Role |
|-------|----------|------|
| `mfgcidashboard-core/SKILL.md` | **Yes** | Repo layout, slice loop, env, docs lifecycle, HANDOFF |
| `mfgcidashboard-slice-plan/SKILL.md` | **Recommended** | From [`templates/skills/slice-plan-SKILL.md.template`](new-repo-bootstrap-kit/templates/skills/slice-plan-SKILL.md.template) — sync `*-tasks.md`, `traceability.md`, SCAFFOLD, closeout |
| `mfgcidashboard-verify-codex/SKILL.md` | Optional | `/v+codex` — from [`templates/skills/verify-codex-SKILL.md.template`](new-repo-bootstrap-kit/templates/skills/verify-codex-SKILL.md.template) or reference monorepo |
| `mfgcidashboard-clickup-defects/SKILL.md` | Optional | ClickUp defect sync — API only, not MCP |

Seed `mfgcidashboard-core` with pointers to: `AGENTS.md`, `docs/developer.md`, vision docs, active slice, `/v`, slice-plan skill, as-built paths under `docs/modules/`, gpt-instructions catalog.

Optional skills and commands (`slice-plan`, `verify-codex`, `clickup-defects`) can be copied from [`new-repo-bootstrap-kit/templates/skills/`](new-repo-bootstrap-kit/templates/skills/), a **reference monorepo**, or authored from command stubs (`vcodex.md`, `v.md`).

**STOP 5**

---

## Phase 6 — Deployment environments

**Goal:** DEV / TST / PRD config in git when the solution is deployed to shared hosts; servers build `.env.local` from committed env files.

### Org deployment profile (optional)

The kit is **platform-neutral**. If your organization standardizes on SQL Server, Windows/IIS, GitLab CI, or similar, document the **actual** hosts, accounts, and runbooks in:

`docs/project-files/system/org-deployment-profile.md`

Seed that file during Phase 6 with placeholders your team fills (SQL hosts, web hosts, CI runner, pool names). **Do not** treat IIS or GitLab as required by the bootstrap kit — skip `deployments/web/` and CI scripts when vision is API-on-Linux, serverless, or laptop-only.

**Step:** copy **`org-deployment-profile.md`** and (when full-stack) **`org-standard-fullstack-stack.md`** into `docs/project-files/system/`; replace placeholders.

### Two-layer env model

| Layer | Files | Used by |
|-------|-------|---------|
| **Local dev** | `.env.example` → `.env.local` | Developers on laptop |
| **Deployed** | `deployments/env/mfgcidashboard.{dev,tst,prd}.env` | Shared hosts after `Install-ProjectEnv.ps1` (or equivalent) |

Root **`.env.local`** remains gitignored everywhere — runtime copy only.

### `deployments/env/` files

| File | Purpose |
|------|---------|
| `mfgcidashboard.dev.env` | DEV — SQL hosts, app URLs, integrations, poll flags |
| `mfgcidashboard.tst.env` | TST — typically stricter integration policy |
| `mfgcidashboard.prd.env` | PRD — production hosts; human hardens before go-live |
| `nav-visibility.txt` | Per-menu **dev / tst / prd** visibility — **UI with menu only** |
| `local-dev-sql.env.example` | Optional SQL block for local → DEV database |
| `local-tst-sql.env.example` | Optional SQL block for local → TST database |
| `README.md` | Env policy, SQL account matrix, integration poll flags |

**Navigation (UI only):** edit `nav-visibility.txt`; optional env override `APP_NAV_DISABLED` in `mfgcidashboard.<tier>.env`. Skip both when vision has no navigable menu.

**Integrations section:** each `mfgcidashboard.<tier>.env` uses **comment blocks** in the bootstrap templates. Document `*_POLL_ENABLED` only for integrations the project actually ships.

**ClickUp:** optional — omit or leave vars empty; set `CLICKUP_POLL_ENABLED=false` on TST by default when used.

### `deployments/scripts/Install-ProjectEnv.ps1`

Scaffold a script (PowerShell or shell — match your org profile) that:

1. Accepts `-Environment dev|tst|prd` and optional `-AppPath`
2. Merges `deployments/env/mfgcidashboard.$Environment.env` → repo-root `.env.local`
3. Optionally merges `deployments/env/secrets.$Environment.env.local` if present (legacy override)
4. Warns on missing required secrets (`APP_DB_USER`, `APP_DB_PASSWORD`, etc. — per vision)

**Example (Windows / IIS org profile):**

```powershell
.\deployments\scripts\Install-ProjectEnv.ps1 -Environment dev
Restart-WebAppPool -Name mfgcidashboard
```

Adapt pool name and paths in `org-deployment-profile.md` and `deployments/web/setup_mfgcidashboard.ps1` when IIS is used.

### `deployments/DEPLOY.md`

Document for humans (fill from `org-deployment-profile.md`):

| Target | SQL host | Web / runtime host | Public URL |
|--------|----------|-------------------|------------|
| **DEV** | `SRVIRQSQLDEV` or `SRVIRQSQLDEV` | `SRVIRQETLDEV` (if applicable) | _(per org)_ |
| **TST** | _(confirm with IT)_ | _(confirm)_ | _(confirm)_ |
| **PRD** | _(confirm with IT)_ | _(confirm)_ | _(confirm)_ |

| Layer | Script |
|-------|--------|
| SQL | `Deploy-AppSql.ps1` (when `databases/` exists) |
| App | `Deploy-App.ps1` (pull, install deps, env install, recycle/restart) |

First-time web host setup: `deployments/web/README.md` when used. URL quick reference: `deployments/web-addresses.md`.

### SQL account policy (document in `deployments/env/README.md`)

Typical pattern — **adjust per project**:

| Context | SQL host | Login |
|---------|----------|-------|
| Web server → DEV SQL | `SRVIRQSQLDEV` | Service account in `mfgcidashboard.dev.env` |
| Local machine → DEV SQL | `SRVIRQSQLDEV` | Developer domain account in `.env.local` via `local-dev-sql.env.example` |
| Web server → TST SQL | TST host | Service account in `mfgcidashboard.tst.env` |
| PRD | PRD host | Human-approved account in `mfgcidashboard.prd.env` |

Web servers use the committed env file; local developers use `.env.local`. This is **SQL access**, separate from app auth (LDAP / IIS / dev bypass vars).

### Verify

- [ ] `deployments/env/mfgcidashboard.dev.env` committed with placeholders replaced
- [ ] `Install-ProjectEnv.ps1` produces `.env.local` on a test machine
- [ ] `deployments/DEPLOY.md` and `deployments/env/README.md` describe DEV/TST/PRD flow
- [ ] `docs/project-files/system/org-deployment-profile.md` seeded when using shared hosts or CI
- [ ] `nav-visibility.txt` seeded **only when UI has a menu** (or generator documented)

**STOP 6**

---

## Phase 7 — Closeout

### Final verification

- [ ] **`AGENTS.md`**, **`.cursorignore`**, **`.env.example`** committed; placeholders replaced
- [ ] `docs/requirements/vision/` intact
- [ ] All docs under `docs/` — no top-level `requirements/`
- [ ] `docs/requirements/slices/` uses **deviations/ + input-files/ + success-criteria/** only (no nested code)
- [ ] **`docs/developer.md`** present; env files copied from kit `templates/`
- [ ] **`docs/product-manager-agent/`** fetched via `fetch-product-manager-agent.sh`; `implementation-catalog.md` seeded
- [ ] **`docs/project-files/regression/regression-plan.md`** seeded from kit template
- [ ] **`docs/bootstrap/new-repo-bootstrap-kit/`** kit present (templates + **committed** `vendor/agent-product-manager/` + fetch script)
- [ ] `*-tasks.md` templates include **mandatory final phase** (tests create + register + **execute**)
- [ ] Defects workflow **only if ClickUp enabled**: `bug-workflow.md`, `clickup-defects` skill, sync script
- [ ] `src/mfgcidashboard_app/` runs per architecture
- [ ] `databases/CIDashboard/`, `deployments/env/`, `deployments/scripts/`, `servers/schedules/` present
- [ ] Deploy env: `mfgcidashboard.{dev,tst,prd}.env` + `Install-ProjectEnv.ps1` + `DEPLOY.md`
- [ ] `HANDOFF.md` + `session-handoff.mdc` + stop hook (`hooks.json` local)
- [ ] `tests/` regression layout seeded

**STOP 7 (done)**

---

## Appendix — New chat prompt

```text
Read the first ~120 lines of HANDOFF.md, then .cursor/active-slice (feature work) or .cursor/active-defects (if using ClickUp), then AGENTS.md, then .cursor/skills/mfgcidashboard-core/SKILL.md.
Human guide: docs/developer.md
Slice drafting: docs/product-manager-agent/ (Codex/ChatGPT PM agent — not Cursor)

Architecture authority: docs/requirements/vision/
Before building: sync docs/project-files/project-plan/slices/<slice>-tasks.md from requirements.
App code: src/mfgcidashboard_app/modules/<module_id>/. SQL: databases/CIDashboard/modules/<module_id>/ (when used).
Env (local): set -a && source .env.local && set +a
Env (server): deployments/env/mfgcidashboard.<tier>.env → Install-ProjectEnv.ps1 (or org equivalent)

Do not commit unless I ask.
```

---

## Appendix — Optional reference monorepo

When your organization maintains a **mature monorepo** with patterns you want to reuse:

1. Copy artifacts into the new repo and **rename all placeholders** (`mfgcidashboard`, `mfgcidashboard_app`, `CIDashboard`, product display names).
2. **Do not** copy product-specific routes, menu keys, defect list ids, or env secret values.
3. Prefer kit templates for env files and `bootstrap.md`; use the reference repo for **skills**, **Cursor rules/commands**, **deploy scripts**, and a **populated `tests/SCAFFOLD.md`** when those exist.

| Artifact type | Typical location in a reference repo | New repo target |
|---------------|--------------------------------------|-----------------|
| Database layout guide | `databases/AGENTS.md` | Same path |
| Deploy order | `deployments/shared/deployment_order.md` | Same path |
| Install-env script | `deployments/scripts/Install-ProjectEnv.ps1` | Same path (adapt to org profile) |
| Session handoff rule | `.cursor/rules/session-handoff.mdc` | Same path |
| Active slice rule | `.cursor/rules/active-slice.mdc` | Same path |
| Optional defect workflow | `.cursor/rules/defect-workflow.mdc` | Same path |
| Slice-plan / verify-codex skills | `.cursor/skills/*-slice-plan/`, `*-verify-codex/` | `.cursor/skills/mfgcidashboard-*/` |
| Slash commands | `.cursor/commands/v.md`, `vcodex.md`, `cleanup.md` | Same names |
| Stop hook | `.cursor/hooks/update_handoff.py` | Same path |
| Regression layout | `tests/README.md`, `tests/SCAFFOLD.md` | Adapt layer names; keep **no new tests in validation/** |
| Verification hub | `docs/project-files/verification/` | design-patterns stubs |
| Codex CI scripts | `tools/ci/resolve_success_criteria.py`, `codex_second_opinion.sh` | Optional — `/v+codex` only |

Keep **`docs/bootstrap/`** kit files as the generic source of truth; merge reference copies only where they add proven automation your team already operates.
