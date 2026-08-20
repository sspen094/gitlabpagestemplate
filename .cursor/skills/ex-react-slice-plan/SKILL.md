---
name: ex-react-slice-plan
description: Sync slice requirements to project-plan *-tasks.md. Use when creating or updating slice task files, syncing from requirements, closing a slice phase, or adding regression test closeout tasks. Covers Manual confirmation, SCAFFOLD.md, regression-plan.md, success-criteria, traceability.md, final-phase test create+execute, and mandatory project-wide documentation update at slice end.
---

# Ex-React slice plan skill

Use when **syncing** `docs/project-files/project-plan/slices/<slice-id>-tasks.md` from requirements, **authoring a new slice plan**, or **closing a slice phase** with tests and verification.

Pair with [`ex-react-core/SKILL.md`](../ex-react-core/SKILL.md) for build execution and [`ex-react-verify-codex/SKILL.md`](../ex-react-verify-codex/SKILL.md) for `/v+codex` when present.

## Gate: requirements before tasks before code

```text
docs/requirements/slices/<NN-name>/  (approved)
  → sync *-tasks.md from _TEMPLATE-slice-tasks.md
  → create success-criteria/traceability.md (AC → SC-xx → verify → planned)
  → human approves plan
  → build only after tasks + traceability reflect requirements + deviations
```

Do **not** start feature implementation until the tasks file is current **and** `success-criteria/traceability.md` passes the task-sync gate below.

## Sync workflow

1. Read main requirements + relevant `deviations/` + `success-criteria/` + numbered acceptance criteria.
2. Open or create `docs/project-files/project-plan/slices/<NN-name>-tasks.md` from [_TEMPLATE-slice-tasks.md](../../../docs/project-files/project-plan/slices/_TEMPLATE-slice-tasks.md).
3. Break acceptance criteria into phased tasks (implementation phases first).
4. **Always include Manual confirmation** (after implementation, before Final) **and** the **Final phase** from the template.
5. Set **Last synced:** to today; reference deviation ids in notes when scope changed.
6. Map each acceptance criterion to at least one task **and** one **SC-xx** row in `success-criteria/`.
7. Add **Acceptance criteria map** section to `*-tasks.md` (AC # → summary → primary phase → SC-xx).
8. **Create or update** `docs/requirements/slices/<NN-name>/success-criteria/traceability.md` from [traceability template](../../../docs/product-manager-agent/templates/success-criteria/traceability.md).

### Traceability task-sync gate

Before build starts, `traceability.md` must satisfy:

| Check | Rule |
|-------|------|
| AC coverage | Every numbered acceptance criterion has ≥1 row |
| SC coverage | Every **SC-xx** in `success-criteria/*.md` appears in ≥1 row |
| Verify column | Every row has **Verify (planned)** filled |
| Result | All rows `planned` until closeout |
| Tasks mirror | `*-tasks.md` Acceptance criteria map matches traceability AC → SC-xx |

If any check fails, fix requirements/SC-xx gaps or fill verify methods — **do not start Phase 1**.

After deviations: re-sync tasks **and** traceability before continuing build.

## Manual confirmation phase (required before Final)

Every synced `*-tasks.md` must include a **Manual confirmation** phase **after** implementation phases and **before** Final. See [_TEMPLATE-slice-tasks.md](../../../docs/project-files/project-plan/slices/_TEMPLATE-slice-tasks.md).

**During the phase (execution):** follow [`ex-react-manual-confirmation/SKILL.md`](../ex-react-manual-confirmation/SKILL.md) — update the **Change checklist** on every review turn (requests, defects, env/SQL blockers); do not only fix in chat.

| Rule | Action |
|------|--------|
| When phase starts | Stop treating feature work as ready for Final; enter human review mode |
| Change requests | While this phase is active, **every** human-requested change **and** review defect is added to the phase **Change checklist**, then implemented (or deferred with a **Note**) |
| Walk checklist | Before leaving the phase, run through every checklist item with the human |
| Verbal gate | Do **not** start Final until the human gives **explicit verbal confirmation** in chat that the slice is ready for docs/tests closeout |
| Record | Add `- [x] Human verbal confirmation…` with **Note:** date + short paraphrase |

Do not invent checklist items at task sync — the Change checklist starts empty (or with a placeholder). It fills during the phase.

## Final phase — mandatory checklist

Starts only after Manual confirmation verbal gate is recorded.

| Task | Action |
|------|--------|
| Success criteria MD | `success-criteria/*.md` with SC-xx + `verify:` links |
| **Traceability** | Update `traceability.md` — **Result** PASS/FAIL/N/A + **Evidence** |
| **Create tests** | Unit / component / Playwright in canonical `tests/SCAFFOLD.md` paths |
| **Register** | Rows in `docs/project-files/regression/regression-plan.md` |
| **SCAFFOLD** | Planned → Populated in `tests/SCAFFOLD.md` |
| **Execute** | `npm test` + UI smoke when pages changed |
| As-built + catalog | `docs/modules/…`, `implementation-catalog.md` |
| **Project-wide docs** | **Mandatory every slice.** Walk [`docs/README.md`](../../../docs/README.md) + layer hubs + module indexes; update the overall project documentation tree so it reflects what shipped (not only the feature README). Record what changed, or **Note:** checked with no hub/map edits needed. |
| Verification report | `/v` or `/v+codex` when milestone closes |

**Hard rule:** a slice is not documentation-complete if only the feature as-built was written. Final must leave the **project-wide** docs accurate.

## Verification vs tests

| Path | Content |
|------|---------|
| `docs/project-files/verification/design-patterns/` | **DP-xx** (not executable tests) |
| `docs/requirements/slices/<id>/success-criteria/` | **SC-xx** + **traceability.md** |
| `tests/` | Executable regression |

## Related

- [`docs/product-manager-agent/regression-and-closeout.md`](../../../docs/product-manager-agent/regression-and-closeout.md)
- [`docs/project-files/project-plan/README.md`](../../../docs/project-files/project-plan/README.md) (when present)
- [`docs/README.md`](../../../docs/README.md) — documentation map (Final structure review)
- `tests/SCAFFOLD.md`
