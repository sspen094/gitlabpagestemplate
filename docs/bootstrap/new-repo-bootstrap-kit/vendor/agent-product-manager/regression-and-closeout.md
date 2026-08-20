# Regression, tests, and slice closeout

**Audience:** `agent-product-manager` + humans approving requirements.  
**Build execution:** Cursor (`slice-plan` skill, `/v` verification).

A recurring failure mode: feature code ships but **regression tests and verification are deferred or skipped**. Requirements and task plans must make closeout **non-optional**.

---

## Definition of slice done

A slice is **complete** only when **all** are true:

| Gate | Evidence |
|------|----------|
| Requirements **Approved** | Status in main doc |
| **Traceability** complete | `success-criteria/traceability.md` — all rows PASS or N/A at closeout |
| Implementation matches scope | Code review / human sign-off |
| **SC-xx** evaluated | PASS/FAIL/N/A in verification report or build evidence |
| **Tests exist** in canonical `tests/` paths | Not only `tests/validation/` (legacy shim) |
| **Tests executed** | Pytest, flow scripts, UI smoke — logs in closeout |
| **regression-plan.md** updated | New rows for slice scripts |
| **SCAFFOLD.md** updated | Planned → Populated for folders used |
| **As-built** doc | `docs/modules/<module_id>/features/<feature>/` |
| **Catalog** updated | `implementation-catalog.md` |

If any row is "we'll add tests later," the slice is **not** closed.

---

## PM responsibilities (requirements time)

In every slice requirements doc, include **Testing and verification**:

1. **Acceptance criteria** — numbered, owner-verifiable.
2. **SC-xx mapping** — table or `success-criteria/` draft listing each criterion.
3. **Regression intent** — bullet list of flows/contracts/schema gates to prove.
4. **Mockup verification** — when `input-files/` contains approved UI images, reference [mockup-verification.md](design-patterns/mockup-verification.md).
5. **Explicit statement:** *Final project-plan phase must create, register, and execute tests before slice closeout.*
6. **Traceability awareness:** Cursor will create `success-criteria/traceability.md` at task sync — you supply numbered AC and SC-xx drafts only.

### Regression intent example

```markdown
## Testing and verification

Regression intent (Cursor maps to concrete tests during task sync):

- API: list + filter + detail for <entity>; 403 when user lacks <permission>
- DB: deploy script applies CIDashboard objects; seed data supports reference scenario RS-01
- UI: dashboard loads at <route>; metric tiles match reference scenario; mobile layout smoke optional

Final phase in *-tasks.md must: SC-xx files, traceability.md, tests in tests/SCAFFOLD.md paths,
regression-plan rows, execute pytest + UI smoke, as-built + catalog update.
```

---

## Cursor responsibilities (build + final phase)

At **task sync** (before build):

| Task | Action |
|------|--------|
| Acceptance criteria map | Table in `*-tasks.md`: AC # → summary → phase → SC-xx |
| **Traceability** | Create `success-criteria/traceability.md`; fill **Verify (planned)**; Result = `planned` |
| Plan gate | No orphan AC; no SC-xx without verify method; human approves plan |

Synced from project `*-tasks.md` **final phase** (or bootstrap [templates/_TEMPLATE-slice-tasks.md](../templates/_TEMPLATE-slice-tasks.md) when present):

| Task | Action |
|------|--------|
| Success criteria | Complete `success-criteria/*.md`; fill `verify:` links |
| **Traceability** | Update `traceability.md` Result PASS/FAIL/N/A + Evidence at closeout |
| **Create tests** | Pytest / flow / smoke in SCAFFOLD canonical paths |
| **Register** | Rows in `docs/project-files/regression/regression-plan.md` |
| **SCAFFOLD** | Mark folders Populated |
| **Execute** | Run scoped pytest and validation scripts |
| **Mockup fidelity** | Side-by-side screenshots vs approved `input-files/` |
| As-built + evidence | `docs/modules/…`, `FEAT_*` in build-evidence |
| Verification report | `/v` or `/v+codex` when milestone closes |

Mark tasks `- [x]` only when deliverable exists **and tests have been run**.

### Test layer picker

| Slice delivers… | Prefer |
|-----------------|--------|
| Domain logic | `src/mfgcidashboard_app/modules/**/tests/` or `tests/unit/` |
| HTTP API | `tests/integration/api/` |
| SQL schema | `tests/database/schema_validation/` |
| Multi-step flow | `tests/end_to_end/workflows/` |
| Client UI | `tests/end_to_end/smoke/` |
| External API | `tests/contract/<system>/` |

---

## SC-xx vs DP-xx vs pytest

| Artifact | Type | Who authors | When verified |
|----------|------|-------------|---------------|
| **SC-xx** | Slice checklist | PM agent drafts; Cursor completes `verify:` | `/v`, `/v+codex` |
| **DP-xx** | Project-wide pattern | Cursor when patterns emerge | `/v+codex` |
| **pytest / scripts** | Executable | Cursor in build | CI + final phase execute |

SC-xx **passing** does not replace pytest — both are required when applicable.

---

## Mockup closeout (UI slices)

When mockups are acceptance references:

1. **reference-scenario.md** — stable data + permission profile for visual review
2. **mockup-checklist.md** — element-level PASS/FAIL rows
3. Rendered screenshots at required viewport(s)
4. Empty state verified separately from populated mockup
5. Evidence in verification report or `FEAT_*_closeout.md`

---

## Deviations and regression

When a deviation changes acceptance:

- Update SC-xx (add/modify/remove)
- Re-sync `*-tasks.md` — final phase still mandatory
- Add regression intent for new behaviors

---

## Related templates

- [templates/success-criteria/traceability.md](templates/success-criteria/traceability.md)
- [templates/success-criteria/closeout.md](templates/success-criteria/closeout.md)
- [templates/regression-plan.md](../templates/regression-plan.md)
- [templates/_TEMPLATE-slice-tasks.md](../templates/_TEMPLATE-slice-tasks.md)
- [templates/SCAFFOLD.md](../templates/SCAFFOLD.md)
