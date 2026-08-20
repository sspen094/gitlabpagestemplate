# Slice requirements authoring

Companion to [AGENTS.md](AGENTS.md). Use with [slice-requirements-template.md](slice-requirements-template.md).

---

## Concepts

| Term | Meaning | Repo path |
|------|---------|-----------|
| **Slice** | One delivery increment | `docs/requirements/slices/NN-kebab-name/` |
| **Module** | Long-lived ownership area | `src/` (and `docs/modules/<module_id>/`) |
| **Feature** | One capability (kebab-case) | colocated under that module in `src/` |
| **Tasks** | Phased build checklist | `docs/project-files/project-plan/slices/NN-name-tasks.md` |
| **SC-xx** | Slice success criteria (verification) | `…/success-criteria/` |
| **Traceability** | AC → SC-xx → verify → PASS/FAIL matrix | `…/success-criteria/traceability.md` (Cursor at task sync) |
| **DP-xx** | Project-wide design patterns | `docs/project-files/verification/design-patterns/` |
| **Regression plan** | Traceability for executable tests | `docs/project-files/regression/regression-plan.md` |

Vision docs choose stack (API-only, SPA, SQL, jobs). Requirements do not mandate a UI framework.

---

## Allowed slice folder

```text
docs/requirements/slices/NN-kebab-name/
  NN-kebab-name-requirements.md
  deviations/
  input-files/             optional — mockups, seed CSV, SME SQL
  success-criteria/        recommended at approval; required for UI-heavy slices
```

**Never:** `src/`, `tests/`, `database/`, `addendums/`, `fixes/` under the slice folder.

---

## New slice workflow

1. Read [implementation-catalog.md](implementation-catalog.md) — avoid duplicating shipped behavior.
2. Ask **business** questions (batch them).
3. Draft main requirements from [slice-requirements-template.md](slice-requirements-template.md).
4. Draft **SC-xx** rows — one file or `closeout.md` + per-screen checklists.
5. State **regression intent** (see [regression-and-closeout.md](regression-and-closeout.md)).
6. Human approves → Cursor syncs `*-tasks.md` with **final phase** + **`traceability.md`** → human approves plan → build.

---

## Deviation workflow (same slice id)

1. Human describes pivot during active build.
2. Draft [slice-deviation-template.md](slice-deviation-template.md) → `deviations/DNN-topic.md`.
3. Update main doc register + inline **_(Deviation DNN)_** callouts.
4. Update affected **SC-xx** (add/modify/remove).
5. Human approves → Cursor **re-syncs** `*-tasks.md` and **`traceability.md`** before continuing.

---

## Mockup-driven slices

When visual match **is** acceptance:

| Artifact | Location |
|----------|----------|
| Approved PNG/PDF | `input-files/ui-<screen>-mockup.png` (one per page/state) |
| Reference scenario | `success-criteria/reference-scenario.md` |
| Element checklist | `success-criteria/<screen>-mockup-checklist.md` |
| Closeout gate | `success-criteria/closeout.md` |

Requirements text must say mockups are **acceptance references**, not wireframes. Cursor must capture rendered screenshots and compare side-by-side.

When **pattern-only** UI (standard list + filters like an existing feature): cite the pattern — no mockup required.

---

## Success criteria authoring

Format:

```markdown
## SC-01 Short outcome title
- [ ] Observable acceptance statement (owner/QA perspective)
- verify: _flow, route, or permission profile — Cursor adds pytest/Playwright path_
- evidence: _screenshot, report path, or build-evidence doc (filled at closeout)_
```

Map every numbered **acceptance criterion** in the main doc to SC-xx.

Templates: [templates/success-criteria/](templates/success-criteria/)

---

## Regression intent (what PM specifies)

State **what must be provable**, not pytest module names:

| Slice delivers… | Regression intent examples |
|-----------------|----------------------------|
| HTTP API | CRUD happy path, auth denial, validation errors |
| SQL schema | Deploy succeeds; required tables/procs exist |
| User workflow | End-to-end flow with reference data fixture |
| UI page | Smoke load, primary actions, permission variants |
| Integration poll | Config flag off on TST; smoke when enabled on DEV |

Cursor maps intent to `tests/unit/`, `tests/integration/`, `tests/end_to_end/`, feature colocated tests, and registers rows in `regression-plan.md`.

**Slice cannot close** until final-phase tasks confirm tests are **created, registered, executed**, and SC-xx marked PASS/FAIL.

---

## What you must NOT produce

- Application code, SQL DDL, React/Vue components
- `*-tasks.md` (Cursor slice-plan skill)
- Pytest or Playwright files
- **Status: Approved**

---

## Handoff prompt (for human → Cursor)

```text
Read docs/requirements/slices/NN-name/NN-name-requirements.md and success-criteria/.
Sync docs/project-files/project-plan/slices/NN-name-tasks.md including:
  Acceptance criteria map, success-criteria/traceability.md (verify planned),
  mandatory final phase: SC-xx files, tests in tests/SCAFFOLD.md paths,
  regression-plan rows, execute npm test/smoke, as-built docs.
Do not start implementation until I approve the tasks file and traceability matrix.
```
