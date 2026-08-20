# Slice NN — kebab-name (requirements template)

Copy when authoring a new slice. Save as:

`docs/requirements/slices/NN-kebab-name/NN-kebab-name-requirements.md`

Use the next available slice number (`00`, `01`, …). Letter suffix (`03A`, `03B`) when parallel deliverables share a number.

**Allowed subfolders:** `deviations/`, `input-files/`, `success-criteria/` only.

---

**Status:** Draft | Approved  
**Owner:** _name or team_  
**Last updated:** YYYY-MM-DD  
**Slice id:** NN  
**Module(s):** _from `docs/implemented-design/design/modules.md`_  
**Primary feature name (code/SQL):** _kebab-case_  
**Feature folders touched:** _comma-separated_  
**Target database (intent):** _N/A — static site; Google Sheets is read-only published data, not an owned app DB_  
**Runtime database (if different):** _optional_

Human-authored **outcome-focused** requirements. State **what** must be achieved; Cursor decides **how** during build. After approval, Cursor syncs `docs/project-files/project-plan/slices/NN-kebab-name-tasks.md` **including mandatory final phase**.

---

## Objective

_One paragraph: user/business outcome._

## Scope

### In scope

-

### Out of scope

-

## Users and workflows

_Who acts, step-by-step, what decision this supports._

## Functional requirements

1. _Observable behaviors — not implementation steps_
2.
3.

## UI and navigation _(omit section if API-only / no UI)_

_Nav section + page **purpose**. When approved mockups exist, they are **acceptance references** — see `docs/agent-product-manager/design-patterns/mockup-verification.md`._

- **Nav section:** _
- **Page purpose:** _
- **Route(s):** _when obvious; else "Cursor: register under …"_
- **Layout mockups:** _link to `input-files/` or N/A — cite existing pattern_
- **User-visible behaviors:** _search, save, empty states, permissions_

## Cursor deferrals _(optional)_

- _Cursor: layout per ui-controls.md_
- _Cursor: reuse existing list/form pattern from feature X_

## Input files _(optional)_

| File | Purpose |
|------|---------|
| _[input-files/ui-….png](input-files/ui-….png)_ | _Approved visual acceptance reference_ |
| _[input-files/seed-….csv](input-files/seed-….csv)_ | _Authoritative seed data for reference scenario_ |

## Data and integrations

- **Target database (intent):** _repeat from header_
- **Writes (owned):** _summary_
- **Reads / external:** _read-only unless approved_
- **External APIs:** _behavior needed — field names TBD until SME/Cursor_

## Non-functional requirements

- Thin routes/UI; logic in services; SQL in repositories; no secrets in repo.

## Dependencies

- **Other slices:** _
- **Platform:** _

## Acceptance criteria

_Owner/QA verifiable outcomes — each maps to SC-xx and a project-plan task._

1.
2.
3.

## Success criteria _(draft at requirements time — required at approval)_

Create `docs/requirements/slices/NN-kebab-name/success-criteria/` using [templates/success-criteria/](templates/success-criteria/).

| Id | Title | Maps to acceptance # |
|----|-------|----------------------|
| SC-01 | _…_ | 1 |

_Mockup-driven slices: add `reference-scenario.md` and `<screen>-mockup-checklist.md`._

## Testing and verification _(mandatory)_

**Regression intent** — what must be provable (Cursor maps to concrete tests during task sync):

-
-

**Closeout gate (non-optional):** Cursor syncs `*-tasks.md` and creates `success-criteria/traceability.md` at task sync (you do not author traceability). Final phase must:

1. Complete `success-criteria/*.md` with `verify:` links  
2. **Traceability** — `traceability.md` updated with PASS/FAIL/N/A and evidence at closeout  
3. **Create** tests in canonical `tests/SCAFFOLD.md` paths — **not** `tests/validation/`  
4. **Register** rows in `docs/project-files/regression/regression-plan.md`  
5. **Execute** `npm test`, Playwright, and UI smoke as applicable  
6. Evaluate SC-xx PASS/FAIL with evidence  
7. Publish as-built in `docs/modules/` and update `implementation-catalog.md`

See [regression-and-closeout.md](regression-and-closeout.md).

## Open questions

_Business/stakeholder decisions only._

| # | Question | Status |
|---|----------|--------|
| Q1 | _…_ | Open |

## References

- Architecture: `docs/requirements/vision/ex-react_architecture_for_cursor.md`
- UI spec: `docs/requirements/vision/ex-react_ui_spec_for_cursor.md` _(when UI exists)_
- Modules: `docs/implemented-design/design/modules.md`
- PM agent: `docs/agent-product-manager/AGENTS.md`

## Deviations

| Id | Document | Approved | Summary | Plan impact |
|----|----------|----------|---------|-------------|
| _D01_ | _[deviations/D01-short-topic.md](deviations/D01-short-topic.md)_ | _YYYY-MM-DD_ | _One line_ | _Phase N_ |

After approved deviation: callouts in main doc + re-sync `*-tasks.md` + update affected SC-xx.

**Do not** create `addendums/`, `fixes/`, `notes/`, or code folders under slice requirements.
