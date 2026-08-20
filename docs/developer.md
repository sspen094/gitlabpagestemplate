# Developer guide — Ex-React

Short onboarding for humans running this repo in Cursor. **Agents read `AGENTS.md`; you read this.**

**Product requirements (template stage):** [`requirements/requirements.md`](requirements/requirements.md). Delivery slices: [`requirements/README.md`](requirements/README.md).

**ChatGPT / Codex:** attach `docs/product-manager-agent/` for slice requirements drafting.

---

## 1. Before you open Cursor

| Step | You provide |
|------|-------------|
| **Project profile** | Static React site on GitHub Pages; Google Sheets for selected updatable content; no custom backend. |
| **Git branch** | `main` until the first feature slice. **Before slice 01:** create a branch per slice (e.g. `01-navigation-v1`). Put `BRANCH=` in `.cursor/active-slice`. |
| **Vision** | Keep refining [`requirements/requirements.md`](requirements/requirements.md); later move architecture + UI spec to `docs/requirements/vision/`. |
| **Slice 01+** | Draft with PM agent (`docs/product-manager-agent/`), then save under `docs/requirements/slices/` (§3). Include **SC-xx** and **regression intent**. |
| **Env** | Optional `.env.example` → `.env.local` for Vite base path and published sheet URLs. See §7. |
| **Local Cursor** | `cp .cursor/active-slice.example .cursor/active-slice`, set `SLICE_ID`, `MODULE_ID`, `FEATURE_NAME`. `.cursor/hooks.json` is already present for the stop hook. |

**Branching rule:** requirements and project plan on `main` (or a short-lived `plan/NN-name` branch); implementation on the branch named in `active-slice`. Merge plan before agents build.

---

## 2. Modules vs slices (how to think)

| Concept | What it is | Where it lives |
|---------|------------|----------------|
| **Slice** | A **delivery unit** — one increment you ship (requirements → tasks → code → tests). Numbered `01-…`, `02-…`. | `docs/requirements/slices/NN-name/` |
| **Module** | A **product / ownership area** (pages, shared blocks, sheets mapping, navigation). | `src/` (and as-built under `docs/modules/<module_id>/`) |
| **Feature** | One capability inside a module (kebab-case id). A slice may touch one or more features. | Colocated under `src/` for that area |

**Example:** slice `02-updatable-cards-v1` → module `content-modules` → feature `card-grid`.

Register modules in `docs/implemented-design/design/modules.md` when you add the first slice that uses them.

---

## 3. Where requirements go (first feature slice)

Copy `docs/requirements/slices/_xx-slice-name/` → `docs/requirements/slices/01-your-feature/` when that template exists.

**Allowed in that folder only:**

```text
01-your-feature-requirements.md    ← you write this (PM agent can draft)
deviations/                        ← mid-slice pivots (optional)
input-files/                       ← approved mockups (optional)
success-criteria/                  ← SC-xx checklists (recommended always)
```

**Never** put `src/` or `tests/` inside the slice folder.

Header of the requirements doc should include: **Module(s):**, **Feature id(s):**, acceptance criteria, out of scope.

---

## 4. Sync the project plan (prompt)

After requirements are draft or approved, ask Cursor (uses **slice-plan** skill when present):

```text
Read docs/requirements/slices/01-your-feature/01-your-feature-requirements.md.
Sync docs/project-files/project-plan/slices/01-your-feature-tasks.md from it
(phased tasks, **mandatory final phase**: SC-xx, test create+register+**execute**, regression-plan, SCAFFOLD, as-built + **project-wide docs update** — no implementation yet).
Stop when the tasks file matches requirements.
```

**You stay in control:** review the tasks file before any build chat. Edit requirements yourself; agents sync tasks, they do not rewrite your requirements without ask.

---

## 5. Build loop (stay in control)

1. Set `.cursor/active-slice` (`SLICE_ID`, `MODULE_ID`, `FEATURE_NAME`, `SCOPE_OVERRIDE=false` for slice work).
2. New chat — agent reads `HANDOFF.md` → `active-slice` → `AGENTS.md` → `ex-react-core` skill.
3. Prompt: *Execute tasks in `docs/project-files/project-plan/slices/<SLICE_ID>-tasks.md` for the next unchecked item.*
4. Agent marks tasks `- [x]` with dates as it finishes; you review diffs.
5. **Slice closeout:** final-phase tasks are not optional — tests must be **written and executed**; SC-xx evaluated; `regression-plan.md` updated; **and** a **project-wide documentation update** before you merge.
6. **STOP gates** in `bootstrap.md` apply only during initial bootstrap — for features, **you** approve merges and deploys.

**Scope:** with `SCOPE_OVERRIDE=false`, agents should not edit other slices or platform files unless you say so in chat.

**Verification:** append `/v` to a message (or use the `/v` slash command) to force implement + test + runtime proof before “done”.

**Verification + Codex (optional):** `/v+codex` when you want a read-only second opinion.

**Cleanup:** `/cleanup` — tests, lint, format, build.

**Commits:** agents commit only when you explicitly ask.

---

## 6. Cursor skills and slash commands

| Item | Purpose |
|------|---------|
| **`.cursor/skills/ex-react-core/SKILL.md`** | Repo layout, slice loop, env, docs lifecycle — **always on** for build chats. |
| **`.cursor/skills/ex-react-slice-plan/SKILL.md`** | Sync `*-tasks.md`, SCAFFOLD, success-criteria, regression closeout — **recommended**. |
| **`.cursor/skills/ex-react-manual-confirmation/SKILL.md`** | Living change checklist during human review. |
| **`.cursor/skills/ex-react-verify-codex/SKILL.md`** | **Optional** — `/v+codex` workflow. |
| **`/start-phase`** | Plan then implement the next incomplete **phase** (all remaining tasks in that phase). |
| **`/v`** | Verification mode — implement, test, smoke the page. |
| **`/cleanup`** | Lint + format + unit tests + build. |
| **`/v+codex`** | **Optional** — criteria gate + Codex review. |
| **Rules** | `session-handoff`, `active-slice`, `slice-deviations`, `verification-mode`, `cleanup-mode`, `ui-page-patterns`, `ui-title-case`. |

---

## 7. Environment — what you fill in

| File | Who edits | What to fill |
|------|-----------|--------------|
| **`.env.local`** | You (gitignored) | Non-secret local config (Vite base path, published Google Sheets URLs). Start from `.env.example` when it exists. |
| **GitHub Pages** | You | Repo Pages settings + `BASE_URL` / homepage path for the fork. |

**Load locally:**

```powershell
npm install
npm run dev
```

Production is a static `npm run build` deployed to GitHub Pages. There is no SQL, IIS, or FastAPI layer.

**Static copy:** edit strings in `src/modules/text/t-lookup/text-config.ts`. Components use `t('page.section.item')`. Local `npm run dev` hot-reloads those edits; GitHub Pages updates only after a deploy.

**Pages:** edit `src/modules/pages/modular-pages/pages-config.ts` to add pages or module instances. Preview `#/` and `#/demo`.

---

## 8. Defects

This template does not use ClickUp. Track issues in GitHub (or chat) unless you later add a defect lane.

---

## 9. What to do next (checklist)

- [ ] Placeholders replaced (`Ex-React`, `ex-react`)
- [ ] `requirements.md` reviewed
- [ ] React app scaffolds and `npm run dev` works
- [ ] First feature requirements in `docs/requirements/slices/01-…/` (PM agent draft → human edit → approve)
- [ ] Optional: `success-criteria/` SC-xx rows for acceptance criteria
- [ ] Tasks file synced; you approved it (includes final-phase test + verification tasks)
- [ ] Branch created; `active-slice` set
- [ ] Build chat: execute next task in slice tasks file

**Deeper reference:** `docs/bootstrap/bootstrap.md` (generic bootstrap kit), `AGENTS.md` (agents).
