# Slice NN — slice-name (tasks template)

**Requirements:** `docs/requirements/slices/NN-kebab-name/NN-kebab-name-requirements.md`  
**Last synced:** YYYY-MM-DD

Executable task list for this vertical slice. Sync from human requirements (main doc + deviations + success-criteria intent). Do not invent tasks without a requirements source.

Use `mfgcidashboard-slice-plan` skill when present.

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

## Final phase — Documentation, tests, and verification (required)

**Every slice** ends with this phase. **Do not mark the slice complete** until all items below are done or explicitly N/A with rationale in a **Note**.

A slice with merged feature code but **no executed tests** is **not** done.

### Documentation

- [ ] As-built doc in `docs/modules/<module_id>/features/<feature-id>/`
- [ ] Build evidence in `docs/project-files/build-evidence/` (`FEAT_<NAME>_*.md`)
- [ ] Update `docs/product-manager-agent/implementation-catalog.md` when user-facing behavior ships

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
| Unit / service logic | `src/mfgcidashboard_app/modules/<module>/<feature>/tests/` or `tests/unit/` |
| HTTP API | `tests/integration/api/` |
| Schema / deploy gate | `tests/database/schema_validation/` |
| Slice acceptance flow | `tests/end_to_end/workflows/` |
| Client UI smoke | `tests/end_to_end/smoke/` |

**Mandatory closeout tasks:**

- [ ] **Create** — add or extend tests for regression intent in requirements (list paths in **Note** or build evidence)
- [ ] **Register** — add rows to [regression-plan.md](../../regression/regression-plan.md)
- [ ] **SCAFFOLD** — update [tests/SCAFFOLD.md](../../../../tests/SCAFFOLD.md): **Planned → Populated**
- [ ] **Execute** — `python -m pytest -m "not integration" <paths> --tb=short -q`
- [ ] **Execute** — flow scripts and UI smoke when UI or DB flows touched (see `.cursor/commands/v.md`)
- [ ] **Execute** (optional gate) — `./tests/orchestrators/run_mfgcidashboard_regression.sh --skip-deploy --strict` before merge

---

## Links

- PM agent: `docs/product-manager-agent/regression-and-closeout.md`
- Regression plan: `docs/project-files/regression/regression-plan.md`
- Test scaffold: `tests/SCAFFOLD.md`
- Verification: `docs/project-files/verification/`
