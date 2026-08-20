# Developer guide — MFGCIDashboard

Short onboarding for humans running this repo in Cursor. **Agents read `AGENTS.md`; you read this.**

**ChatGPT / Codex:** attach `docs/product-manager-agent/` in the product repo after Phase 4.

**Phase 4 PM agent install (org default):** `bash …/scripts/fetch-product-manager-agent.sh docs/product-manager-agent` — copies from kit **vendor/** (no token). If vendor is empty, `export GITLAB_TOKEN=glpat-…` and re-run.

---

## 1. Before you open Cursor

| Step | You provide |
|------|-------------|
| **Project profile** | At bootstrap start, answer the agent’s short questions (app type, API vs UI, owned DB yes/no) — or pre-fill `docs/requirements/vision/mfgcidashboard_architecture_for_cursor.md` **Project profile** table. |
| **Git branch** | `main` for bootstrap only. **Before slice 01:** create a branch per slice (e.g. `01-inventory-v1`). Put `BRANCH=` in `.cursor/active-slice`. |
| **Vision** | Architecture + UI spec in `docs/requirements/vision/` — seeded from your profile answers if empty; you refine after bootstrap. |
| **Slice 00** | Bootstrap requirements in `docs/requirements/slices/00-foundations/` (already seeded). Approve bootstrap STOP gates. |
| **Slice 01+** | Draft with PM agent (`docs/product-manager-agent/`), then save under `docs/requirements/slices/` (§3). Include **SC-xx** and **regression intent**. |
| **Env** | Copy `.env.example` → `.env.local`, fill SQL + secrets (comments in file). See §7. |
| **Local Cursor** | `cp .cursor/active-slice.example .cursor/active-slice`, set `SLICE_ID`, `MODULE_ID`, `FEATURE_NAME`. Create `.cursor/hooks.json` (see `docs/bootstrap/bootstrap.md` Phase 5). |

**Branching rule:** requirements and project plan on `main` (or a short-lived `plan/NN-name` branch); implementation on `feature/NN-name` or the branch named in `active-slice`. Merge plan before agents build.

---

## 2. Modules vs slices (how to think)

| Concept | What it is | Where it lives |
|---------|------------|----------------|
| **Slice** | A **delivery unit** — one increment you ship (requirements → tasks → code → tests). Numbered `01-…`, `02-…`. | `docs/requirements/slices/NN-name/` |
| **Module** | A **product / ownership area** in the app (who owns the code long-term). | `src/mfgcidashboard_app/modules/<module_id>/` |
| **Feature** | One capability inside a module (kebab-case id). A slice may touch one or more features. | `…/modules/<module_id>/<feature>/` |

**Example:** slice `02-order-lookup-v1` → module `operations` → feature `order-lookup`.

Register modules in `docs/implemented-design/design/modules.md` when you add the first slice that uses them.

---

## 3. Where requirements go (first feature slice)

Copy `docs/requirements/slices/_xx-slice-name/` → `docs/requirements/slices/01-your-feature/`.

**Allowed in that folder only:**

```text
01-your-feature-requirements.md    ← you write this (PM agent can draft)
deviations/                        ← mid-slice pivots (optional)
input-files/                       ← approved mockups, seed CSV (optional)
success-criteria/                  ← SC-xx checklists (required at approval for UI slices; recommended always)
```

**Never** put `src/`, `tests/`, or SQL inside the slice folder — code goes under `src/…/modules/` and `databases/CIDashboard/modules/`.

Header of the requirements doc should include: **Module(s):**, **Feature id(s):**, acceptance criteria, out of scope.

---

## 4. Sync the project plan (prompt)

After requirements are draft or approved, ask Cursor (uses **slice-plan** skill when present):

```text
Read docs/requirements/slices/01-your-feature/01-your-feature-requirements.md.
Sync docs/project-files/project-plan/slices/01-your-feature-tasks.md from it
(phased tasks, **mandatory final phase**: SC-xx, test create+register+**execute**, regression-plan, SCAFFOLD, as-built — no implementation yet).
Stop when the tasks file matches requirements.
```

**You stay in control:** review the tasks file before any build chat. Edit requirements yourself; agents sync tasks, they do not rewrite your requirements without ask.

---

## 5. Build loop (stay in control)

1. Set `.cursor/active-slice` (`SLICE_ID`, `MODULE_ID`, `FEATURE_NAME`, `SCOPE_OVERRIDE=false` for slice devs).
2. New chat — agent reads `HANDOFF.md` → `active-slice` → `AGENTS.md` → `mfgcidashboard-core` skill.
3. Prompt: *Execute tasks in `docs/project-files/project-plan/slices/<SLICE_ID>-tasks.md` for the next unchecked item.*
4. Agent marks tasks `- [x]` with dates as it finishes; you review diffs.
5. **Slice closeout:** final-phase tasks are not optional — tests must be **written and executed**; SC-xx evaluated; `regression-plan.md` updated before you merge.
6. **STOP gates** in `bootstrap.md` apply only during initial bootstrap — for features, **you** approve merges and deploys.

**Scope:** with `SCOPE_OVERRIDE=false`, agents should not edit other slices or platform files unless you say so in chat.

**Verification:** append `/v` to a message (or use the `/v` slash command) to force implement + test + runtime proof before “done”.

**Verification + Codex (optional):** `/v+codex` when the project ships verify-codex skill — success-criteria gate + read-only diff review.

**Cleanup:** `/cleanup` — pytest, ruff check, ruff format.

**Commits:** agents commit only when you explicitly ask.

---

## 6. Cursor skills and slash commands

| Item | Purpose |
|------|---------|
| **`.cursor/skills/mfgcidashboard-core/SKILL.md`** | Repo layout, slice loop, env, docs lifecycle — **always on** for build chats. |
| **`.cursor/skills/mfgcidashboard-slice-plan/SKILL.md`** | Sync `*-tasks.md`, SCAFFOLD, success-criteria, regression closeout — **recommended**. |
| **`.cursor/skills/mfgcidashboard-verify-codex/SKILL.md`** | **Optional** — `/v+codex` workflow. |
| **`.cursor/skills/mfgcidashboard-clickup-defects/SKILL.md`** | **Optional** — only if this project uses ClickUp for QA defects (§8). |
| **`/v`** | Verification mode — implement, pytest, restart app, UI checks; see `.cursor/commands/v.md`. |
| **`/cleanup`** | Lint + format + unit tests; see `.cursor/commands/cleanup.md`. |
| **`/v+codex`** | **Optional** — criteria gate + Codex review; see `.cursor/commands/vcodex.md`. |
| **Rules** | `session-handoff`, `active-slice`, `slice-deviations`, `verification-mode`, `cleanup-mode`, optional `defect-workflow` and `verification-codex`. |

Optional skills and commands (`slice-plan`, `verify-codex`, `clickup-defects`) can be copied from a **reference monorepo** and renamed — see [`../bootstrap.md`](../bootstrap.md) Appendix — Optional reference monorepo.

---

## 7. Environment — what you fill in

| File | Who edits | What to fill |
|------|-----------|--------------|
| **`.env.local`** | You (gitignored) | Local DB (`APP_DB_ENGINE`, `APP_DB_URL`), API keys, `APP_HOST` / `APP_PORT`. Start from `.env.example`. |
| **`deployments/env/mfgcidashboard.dev.env`** | Team (committed) | DEV server — **SQL Server** service account, URLs, integration flags. |
| **`deployments/env/mfgcidashboard.tst.env`** | Team | TST hosts; usually disable background polls. |
| **`deployments/env/mfgcidashboard.prd.env`** | Team + lead | Production — harden before go-live. |
| **`local-dev-sqlite.env.example`** | Reference | **Recommended** when not using SQL Server on laptop — copy into `.env.local`. |
| **`local-dev-postgres.env.example`** | Reference | Local PostgreSQL when not using SQL Server on laptop. |
| **`local-dev-sql.env.example`** | Reference | Laptop → shared DEV **SQL Server** only when explicitly needed. |

**Load locally:** `set -a && source .env.local && set +a` then start the entrypoint per vision (e.g. `python -m mfgcidashboard_app.api_main`, or `cd frontend && npm run dev` when a SPA exists).

**On servers:** `git pull` → `Install-ProjectEnv.ps1 -Environment dev` → restart app per `deployments/DEPLOY.md` and `org-deployment-profile.md`.

**Local DB:** If vision says no local SQL Server, use **SQLite** or **PostgreSQL** — not a local MSSQL install. Deployed DEV/TST/PRD stay SQL Server. DDL under `databases/` is T-SQL; validate on shared DEV or CI.

---

## 8. Defects (optional — skip if no ClickUp)

If **not** using ClickUp: ignore `docs/project-files/defects/`, do not scaffold clickup-defects skill, leave ClickUp vars empty in env files.

If **using** ClickUp: dedicated defects list → set `CLICKUP_BUG_LIST_ID` in env → sync with `python tools/ci/clickup_sync_defects.py` → assign ids in `.cursor/active-defects`. See `docs/project-files/system/bug-workflow.md`.

---

## 9. What to do next (checklist)

- [ ] Placeholders replaced (`MFGCIDashboard`, `mfgcidashboard`, `mfgcidashboard_app`, `CIDashboard`)
- [ ] Vision docs reviewed or written
- [ ] `.env.local` works; app starts locally
- [ ] First feature requirements in `docs/requirements/slices/01-…/` (ChatGPT draft → human edit → approve)
- [ ] Optional: `success-criteria/` SC-xx rows for acceptance criteria
- [ ] Tasks file synced; you approved it (includes final-phase test + verification tasks)
- [ ] Branch created; `active-slice` set
- [ ] Build chat: execute next task in slice tasks file

**Deeper reference:** `docs/bootstrap/bootstrap.md` (bootstrap phases), `docs/bootstrap/new-repo-bootstrap-kit/` (kit + env templates), `deployments/DEPLOY.md` (servers), `AGENTS.md` (agents), `tests/SCAFFOLD.md` (test layers).

**Note:** This file is copied to `docs/developer.md` during bootstrap. The copy under `docs/bootstrap/new-repo-bootstrap-kit/` remains as part of the kit for new repos.
