# Slice NN — slice-name (tasks template)

**Requirements:** `docs/requirements/slices/NN-kebab-name/NN-kebab-name-requirements.md`  
**Last synced:** YYYY-MM-DD

Executable task list for this vertical slice. Sync from human requirements (main doc + deviations + success-criteria intent). Do not invent tasks without a requirements source.

Use `ex-react-slice-plan` skill when present.

## Acceptance criteria map (required at task sync)

| # | Summary | Primary phase | SC-xx |
|---|---------|---------------|-------|
| 1 | _Short summary from requirements AC-1_ | 1 | SC-01 |

Create `docs/requirements/slices/NN-kebab-name/success-criteria/traceability.md` from the PM agent traceability template. Fill **Verify (planned)** before build; update **Result** PASS/FAIL/N/A at closeout.

## Task conventions

| Marker | Meaning |
|--------|---------|
| `- [x] … — **YYYY-MM-DD**` | Complete; date is completion day |
| `- [ ] …` | Not started or in progress |
| `- [ ] …` + indented `- **Note:** …` | Skipped, modified, or partial |

---

## Phase 1 — phase-name

- [ ] _Task from requirements acceptance criteria_

## Phase 2 — phase-name

- [ ] _Task_

---

## Manual confirmation phase (required before Final)

**Insert this phase after all implementation phases and before Final.** Do not start Final (docs/tests/verification) until this phase is complete.

When this phase **starts**, treat the slice as implementation-complete pending human review:

1. **Living change checklist** — While this phase is active, every human-requested change **and** review defect must be added as a checklist item under **Change checklist** below (then implemented or explicitly deferred with a **Note**). Agents: follow `.cursor/skills/ex-react-manual-confirmation/SKILL.md`.
2. **Walk the checklist** — Before closeout of this phase, run through every checklist item with the human (done, N/A with rationale, or still open).
3. **Verbal confirmation gate** — Do **not** proceed to Final until the human gives an explicit verbal confirmation in chat that the slice is ready for docs/tests closeout. Record the confirmation date and a short paraphrase in a **Note**.

### Change checklist

_Add items here as the human requests changes during this phase. Empty at task sync is normal._

- [ ] _(none yet — populated during Manual confirmation)_

### Phase closeout

- [ ] Walk the change checklist with the human (every item checked, N/A, or explicitly carried forward)
- [ ] Human verbal confirmation recorded — slice ready for Final phase — **Note:** _date + paraphrase_

---

## Final phase — Documentation, tests, and verification (required)

**Every slice** ends with this phase **after** Manual confirmation. **Do not mark the slice complete** until all items below are done or explicitly N/A with rationale in a **Note**.

A slice with merged feature code but **no executed tests** is **not** done.

### Documentation

**By the end of every slice, documentation must be updated project-wide** — not only the feature as-built. The overall docs tree (`docs/README.md` → layer hubs → module indexes → specific docs) must reflect what shipped.

- [ ] As-built doc in `docs/modules/<module_id>/features/<feature-id>/`
- [ ] Build evidence in `docs/project-files/build-evidence/` (`FEAT_<NAME>_*.md`)
- [ ] Update `docs/product-manager-agent/implementation-catalog.md` when user-facing behavior ships
- [ ] **Project-wide documentation update** (mandatory) — walk [`docs/README.md`](../../../README.md) and every affected layer hub (`architecture/`, `configuration/`, `requirements/`, `testing/`, `implemented-design/`, `modules/`); update map links, hub tables, module feature indexes, and cross-cutting as-built so the **overall project docs** stay accurate. Always do the walk; if no edits were needed, still check the box with **Note:** listing hubs reviewed and “no changes.”

### Success criteria (verification checklists)

- [ ] Complete `docs/requirements/slices/NN-kebab-name/success-criteria/*.md` — each acceptance criterion → **SC-xx** with `verify:` links
- [ ] Create or update `success-criteria/traceability.md` — AC → SC-xx → verify → Result at closeout
- [ ] Evaluate SC-xx PASS/FAIL/N/A; record in traceability + verification report
- [ ] Mockup slices: side-by-side screenshots vs `input-files/` per mockup checklist
- [ ] Run `/v` or `/v+codex` when closing milestone; report under `docs/project-files/verification-reports/` when appropriate

### Regression tests (executable — required)

Pick **canonical** paths from [tests/SCAFFOLD.md](../../../../tests/SCAFFOLD.md). **Do not** add new tests under `tests/validation/` (legacy shim).

| Deliverable | Typical path |
|-------------|--------------|
| Unit / component | `src/` colocated tests or `tests/unit/` |
| Page / module behavior | `tests/unit/` or `tests/integration/` |
| Slice acceptance flow | `tests/end_to_end/workflows/` |
| UI smoke | `tests/end_to_end/smoke/` (Playwright) |

**Mandatory closeout tasks:**

- [ ] **Create** — add or extend tests for regression intent in requirements (list paths in **Note** or build evidence)
- [ ] **Register** — add rows to [regression-plan.md](../../regression/regression-plan.md)
- [ ] **SCAFFOLD** — update [tests/SCAFFOLD.md](../../../../tests/SCAFFOLD.md): **Planned → Populated**
- [ ] **Execute** — `npm test`
- [ ] **Execute** — Playwright / UI smoke when pages or modules changed (see `.cursor/commands/v.md`)
- [ ] **Execute** — `npm run build` before merge

---

## Links

- Documentation map: `docs/README.md` (**mandatory project-wide docs update** at Final)
- PM agent: `docs/product-manager-agent/regression-and-closeout.md`
- Regression plan: `docs/project-files/regression/regression-plan.md`
- Test scaffold: `tests/SCAFFOLD.md`
- Verification: `docs/project-files/verification/`
- Configuration hub: `docs/configuration/README.md`
