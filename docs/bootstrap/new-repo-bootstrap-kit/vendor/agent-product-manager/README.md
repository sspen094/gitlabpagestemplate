# agent-product-manager

**Solution-agnostic** instructions for a **Codex** (or ChatGPT) agent acting as **senior product manager** — authoring slice requirements, deviations, success criteria, and closeout expectations that dovetail with the bootstrap kit.

**Not for Cursor build agents** — Cursor reads root `AGENTS.md`, `.cursor/skills/mfgcidashboard-core/`, and syncs `*-tasks.md`.

---

## Connect to your GitLab repo

1. **Fill in** [`project-connection.md`](project-connection.md) — project name, GitLab host, project path, clone URL, and paths in the product repo.
2. **Secrets** — copy [`connection.env.example`](connection.env.example) → `.env.local` (local only; gitignored).
3. **MCP** — [`.cursor/mcp.json`](.cursor/mcp.json) wires GitLab MCP to `.env.local`; reload Cursor after filling secrets.
3. **Local Codex + GitLab API** (optional) — copy [`.codex/config.toml.example`](.codex/config.toml.example) and set your PAT + repo path.
4. **GitLab Duo agent** (optional) — copy [`.gitlab/duo/flows/pm-agent.yaml`](.gitlab/duo/flows/pm-agent.yaml) into the **product** repo; set CI/CD variables `GITLAB_HOST`, `ADDITIONAL_INSTRUCTIONS`, and service-account token per `project-connection.md`.
5. **Bootstrap** — Phase 4 runs `fetch-product-manager-agent.sh` → `docs/product-manager-agent/` in the product repo ([agent-cursor-bootstrap](https://srvirqisgitlab1.rossvideo.com/manufacturing-data-infrastructure-and-applications/agent-cursor-bootstrap)).

---

## Attach to the PM agent

Load **all** Markdown files in this folder before every session. Start with [`AGENTS.md`](AGENTS.md), then [`implementation-catalog.md`](implementation-catalog.md).

| File | Purpose |
|------|---------|
| [**AGENTS.md**](AGENTS.md) | Role, guardrails, three-way split (PM · human · Cursor) |
| [slice-authoring.md](slice-authoring.md) | Workflow, folder layout, mockups, regression intent |
| [slice-requirements-template.md](slice-requirements-template.md) | Main requirements document shape |
| [slice-deviation-template.md](slice-deviation-template.md) | Mid-slice pivots (same `NN`) |
| [implementation-catalog.md](implementation-catalog.md) | What the product has built — **update after each slice ships** |
| [regression-and-closeout.md](regression-and-closeout.md) | SC-xx, traceability, regression plan, tests-before-close — **mandatory read** |
| [design-patterns/mockup-verification.md](design-patterns/mockup-verification.md) | When approved mockups are acceptance |
| [**project-connection.md**](project-connection.md) | GitLab + project identity — **fill in first** |

Optional context: `docs/requirements/vision/`, `docs/implemented-design/design/modules.md`.

---

## Bootstrap deployment (new repo)

During **Phase 4** of [agent-cursor-bootstrap](https://srvirqisgitlab1.rossvideo.com/manufacturing-data-infrastructure-and-applications/agent-cursor-bootstrap), run:

```bash
bash docs/bootstrap/new-repo-bootstrap-kit/scripts/fetch-product-manager-agent.sh docs/product-manager-agent
```

That shallow-clones this repo at the pin in `vendor/agent-product-manager.ref`. **Canonical source:** agent-product-manager GitLab repo. **Bootstrap kit** carries a committed vendor snapshot; maintainers refresh with `sync-vendor-product-manager.sh`.

Seed an empty [`implementation-catalog.md`](implementation-catalog.md) and grow it as slices ship.

---

## Workflow

```text
Human goal
  → PM agent (this folder) drafts requirements + SC-xx + regression intent
  → Human approves business intent; attaches mockups to input-files/ when visual match matters
  → Cursor syncs *-tasks.md (slice-plan skill) + traceability.md — human approves plan
  → Cursor builds; runs /v; marks SC-xx PASS/FAIL; updates traceability + regression-plan + SCAFFOLD
  → Slice closes only when final-phase tasks are done and traceability is all PASS or N/A
```

**New slice** = separate deliverable (`09-…`). **Deviation** = pivot on current `NN`. **Defects** = post-QA bug workflow — not PM slice output.

---

## Related bootstrap kit paths

| Path | Role |
|------|------|
| [`../project-setup.md`](../project-setup.md) | Bootstrap phases 0–7 |
| [`../developer.md`](../developer.md) | Human onboarding |
| [`../templates/SCAFFOLD.md`](../templates/SCAFFOLD.md) | Test layer checklist |
| [`../templates/regression-plan.md`](../templates/regression-plan.md) | Regression traceability template |
| [`../templates/_TEMPLATE-slice-tasks.md`](../templates/_TEMPLATE-slice-tasks.md) | Task file — includes mandatory final phase |
