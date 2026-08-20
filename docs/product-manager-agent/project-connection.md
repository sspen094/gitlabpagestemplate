# Project connection — fill in before use

Single source for **project identity** and **GitLab repo connection**. Copy values from here into the product repo during bootstrap, or keep this file alongside the agent when Codex runs outside the repo.

**Status:** Identity filled for Ex-React (2026-08-20). Git host still TBD.

---

## Project identity

| Field | Your value | Example |
|-------|------------|---------|
| **Display name** (`Ex-React`) | Ex-React | Acme Portal |
| **Repo slug** (`ex-react`) | `ex-react` | `acme` |
| **Python app package** | N/A (React / Vite) | `acme_app` |
| **Primary app database** | N/A | `AcmeDb` |
| **Next slice id** | `01` | `01` |

Placeholders are applied in [`AGENTS.md`](../../AGENTS.md) and [`implementation-catalog.md`](implementation-catalog.md).

---

## GitLab repository

| Field | Your value | Notes |
|-------|------------|-------|
| **GitLab host** | FILL | `gitlab.com` or `gitlab.your-company.com` (hostname only, no `https://`) |
| **Group / namespace** | FILL | e.g. `my-org` |
| **Project name** | FILL | e.g. `acme-portal` |
| **Project path** (`group/project`) | FILL | e.g. `my-org/acme-portal` — used by Duo flows and glab |
| **Clone URL (HTTPS)** | FILL | `https://gitlab.com/my-org/acme-portal.git` |
| **Default branch** | FILL | Usually `main` or `master` |
| **GitLab project ID** | FILL or TBD | Project **Settings → General** — for **API / MCP / Duo only**; not required to install this kit via `git clone` or vendor copy |

---

## Paths in the product repo

These paths live **in the GitLab repo**, not in this instruction kit.

| Path | Purpose |
|------|---------|
| `docs/product-manager-agent/` | Fetched copy of this repo after bootstrap (alias `docs/agent-product-manager/` OK if documented) |
| `docs/requirements/slices/` | Where the PM agent writes slice requirements |
| `docs/requirements/vision/` | Architecture / UI vision (optional context) |
| `docs/project-files/project-plan/slices/` | Cursor task files (`*-tasks.md`) |
| `docs/project-files/regression/regression-plan.md` | Executable test inventory |
| `docs/modules/` | As-built module docs (Cursor updates on closeout) |

---

## GitLab CI/CD variables (Duo / external Codex agent)

Set in the product repo: **Settings → CI/CD → Variables**. Use **Masked** for tokens. Clear **Protect variable** unless you only run on protected branches.

| Variable | Your value | Required when |
|----------|------------|---------------|
| `GITLAB_HOST` | FILL | Custom external agent or self-managed |
| `GITLAB_TOKEN_<AGENT_NAME>` | FILL (secret) | Custom external agent — service account PAT |
| `ADDITIONAL_INSTRUCTIONS` | See below | Duo Codex / Claude flow uses PM agent rules |

**Suggested `ADDITIONAL_INSTRUCTIONS`** (paste after filling project name):

```text
You are the `agent-product-manager` agent for Ex-React.

Read and follow all Markdown in docs/product-manager-agent/, starting with AGENTS.md and implementation-catalog.md.

Default writes: docs/requirements/** only. Do not modify application code, tests, or CI unless the human explicitly asks.

Keep slice requirements Status: Draft until a human sets Approved. Surface Open questions in the conversation, not only buried in documents.
```

**Service account PAT scopes** (if you create a custom Duo external agent): `api`, `write_repository`, `ai_features`.

---

## Local Codex + GitLab MCP (optional)

Use when Codex runs on your machine and needs API access to the GitLab project (issues, MRs, file browse).

1. Copy [`connection.env.example`](connection.env.example) → `.env.local` (gitignored if you add it locally).
2. Fill `GITLAB_PERSONAL_ACCESS_TOKEN`, `GITLAB_API_URL`, and project path/id.
3. **Cursor:** project [`.cursor/mcp.json`](.cursor/mcp.json) loads `.env.local` for the GitLab MCP server — reload the window after editing secrets.
4. **Codex:** use [`.codex/config.toml`](.codex/config.toml) in this repo (sources `.env.local`) or copy [`.codex/config.toml.example`](.codex/config.toml.example) for a manual setup.

**PAT scopes (read/write requirements):** at minimum `read_api`; add `api` if the agent should create branches or commit requirements files.

**API URL format:** `https://<gitlab-host>/api/v4` — not the web UI root.

Verify: run `codex`, then `/mcp` — GitLab server should appear as connected.

---

## Bootstrap checklist (product repo)

- [ ] GitLab project created; default branch set
- [ ] PM agent installed to `docs/product-manager-agent/` (vendor copy or fetch with git auth — **project ID not required for install**)
- [ ] `project-connection.md` values applied; `Ex-React` placeholders updated in catalog + AGENTS
- [ ] Vision docs present under `docs/requirements/vision/` (if applicable)
- [ ] Duo Codex agent enabled **or** local Codex MCP configured
- [ ] `ADDITIONAL_INSTRUCTIONS` CI variable set (Duo path)
- [ ] Human workflow agreed: PM agent drafts → human approves → Cursor syncs tasks and builds

---

## Open questions

| # | Question | Owner | Blocks connection? |
|---|----------|-------|--------------------|
| 1 | GitLab.com or self-managed instance? | FILL | Yes |
| 2 | Duo managed Codex agent vs local Codex + MCP? | FILL | Yes |
| 3 | Should the PM agent commit requirements to GitLab, or only output drafts for human save? | FILL | No |
