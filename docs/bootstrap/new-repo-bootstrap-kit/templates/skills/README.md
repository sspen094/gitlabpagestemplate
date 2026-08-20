# Cursor skill templates

Copy into `.cursor/skills/` during bootstrap Phase 5 (or from a reference monorepo). Replace `MFGCIDashboard` / `mfgcidashboard` placeholders to match vision docs and `AGENTS.md`.

| Template | Target path | Required |
|----------|-------------|----------|
| [`slice-plan-SKILL.md.template`](slice-plan-SKILL.md.template) | `.cursor/skills/mfgcidashboard-slice-plan/SKILL.md` | **Recommended** — sync tasks, **traceability.md**, regression closeout |
| [`verify-codex-SKILL.md.template`](verify-codex-SKILL.md.template) | `.cursor/skills/mfgcidashboard-verify-codex/SKILL.md` | Optional — `/v+codex`, SC-xx PASS/FAIL, **traceability closeout** |

Also seed `mfgcidashboard-core/SKILL.md` from a reference monorepo or minimal pointers in `bootstrap.md` Phase 5.

Optional: `mfgcidashboard-clickup-defects` when using ClickUp for QA defects — copy from reference monorepo only.

## Traceability split

| Skill | Traceability role |
|-------|-------------------|
| **slice-plan** | Create `traceability.md` at task sync; Verify = `planned` |
| **verify-codex** | Update Result PASS/FAIL/N/A + Evidence at closeout |

See `docs/product-manager-agent/templates/success-criteria/traceability.md`.
