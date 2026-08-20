# New repo bootstrap kit

Generic files for **bootstrapping a new repo** with Cursor + optional ChatGPT slice authoring. No product-specific names — replace placeholders before use.

**Canonical bootstrap runbook:** [`../bootstrap.md`](../bootstrap.md) (not duplicated in this folder).

---

## Kit contents

| File / folder | In new repo | Audience |
|---------------|-------------|----------|
| **Whole folder** `docs/bootstrap/new-repo-bootstrap-kit/` | Copy as-is | — |
| [`../bootstrap.md`](../bootstrap.md) | Copy → repo root `bootstrap.md` (gitignored) | Bootstrap agent |
| [**agent-product-manager**](https://srvirqisgitlab1.rossvideo.com/manufacturing-data-infrastructure-and-applications/agent-product-manager) | Canonical PM agent — **vendor snapshot** in kit `vendor/agent-product-manager/` |
| [`vendor/agent-product-manager/`](vendor/agent-product-manager/) | Committed copy — Phase 4 default (no token) |
| [`scripts/fetch-product-manager-agent.sh`](scripts/fetch-product-manager-agent.sh) | Install → `docs/product-manager-agent/` (copy, or pull if vendor empty) |
| [`scripts/sync-vendor-product-manager.sh`](scripts/sync-vendor-product-manager.sh) | Maintainers: refresh vendor snapshot from source repo |
| [`developer.md`](developer.md) | Copy → `docs/developer.md` | Humans |
| [`templates/`](templates/) | Env stubs, **org-standard-fullstack-stack**, vision full-stack stubs, SCAFFOLD, org-deployment-profile, **[`templates/skills/`](templates/skills/)** (slice-plan + verify-codex) | Bootstrap agent |

---

## What bootstrap scaffolds (phase summary)

| Area | Kit provides | Vision / org may add |
|------|--------------|----------------------|
| **Stack** | Org **full-stack default:** React + FastAPI + SQL Server + IIS — [`org-standard-fullstack-stack.md`](templates/org-standard-fullstack-stack.md) | API-only, batch, or alternate UI per vision |
| **Slice requirements** | main doc + `deviations/` + `input-files/` + **`success-criteria/`** + **`traceability.md`** (Cursor at task sync) | `_template/success-criteria/` |
| **PM agent** | `docs/product-manager-agent/` — requirements, SC-xx, regression intent, traceability awareness | Catalog growth per shipped slice |
| **Verification** | `docs/project-files/verification/` + `verification-reports/` + **traceability PASS/FAIL** | design-patterns, `/v+codex`, Codex CI scripts |
| **Tests** | Layered `tests/` + **`SCAFFOLD.md`** + **final-phase execute gate** | Populated tree from reference monorepo |
| **Cursor skills** | `mfgcidashboard-core` (required) | `slice-plan` (traceability + tasks), `verify-codex`, `clickup-defects` |
| **Slash commands** | `/v` (recommended) | `/v+codex`, `/cleanup` |
| **Rules** | handoff, active-slice, verification-mode | slice-deviations, ui-patterns, cleanup-mode, verification-codex |
| **Deploy** | Env file templates + README stubs | SQL/IIS/GitLab details in `org-deployment-profile.md` |

See [`../bootstrap.md`](../bootstrap.md) phases 0–7 for step-by-step scaffolding.

---

## Codex / ChatGPT product manager setup

1. Create a Codex or ChatGPT project for requirements authoring.
2. Attach **`docs/product-manager-agent/`** in the product repo after Phase 4 (or `vendor/agent-product-manager/` when editing the bootstrap kit).
3. Optionally attach vision architecture + `modules.md`.
4. PM agent drafts requirements → human saves to `docs/requirements/slices/NN-name/` → Cursor syncs tasks + **`traceability.md`** with **mandatory final phase** (see `developer.md` §4).

**Placeholders:** `MFGCIDashboard`, `mfgcidashboard`, `mfgcidashboard_app`, `CIDashboard` — defined in `bootstrap.md`.

---

## Optional reference monorepo

When a mature project in your org already has skills, deploy scripts, or regression layout you trust, copy and rename placeholders — see **`bootstrap.md` Appendix — Optional reference monorepo**. Do not copy product names, routes, or integration ids.
