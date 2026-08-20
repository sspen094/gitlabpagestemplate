# Slice 05 — external-submissions (tasks)

**Requirements:** `docs/requirements/slices/05-external-submissions/05-external-submissions-requirements.md`  
**Last synced:** 2026-08-20

Executable task list for this vertical slice. Do not start implementation until the human approves this file and `success-criteria/traceability.md`.

## Acceptance criteria map (required at task sync)

| # | Summary | Primary phase | SC-xx |
|---|---------|---------------|-------|
| 1 | Submissions via email/external only | 1 | SC-01 |
| 2 | No site-side storage of submissions | 1 | SC-02 |
| 3 | Working example form, graceful states | 2 | SC-03 |

## Task conventions

| Marker | Meaning |
|--------|---------|
| `- [x] … — **YYYY-MM-DD**` | Complete; date is completion day |
| `- [ ] …` | Not started or in progress |
| `- [ ] …` + indented `- **Note:** …` | Skipped, modified, or partial |

---

## Phase 1 — Submission adapters (external-only)

- [ ] Define a submit-adapter interface (email service send / external redirect) — no persistence path
- [ ] Implement an external email-service adapter (config-driven endpoint; no committed secrets)
- [ ] Implement an external redirect/handoff adapter
- [ ] Configure endpoints via non-secret config / `.env.example`

## Phase 2 — Example form module & states

- [ ] Reusable form module (fields, validation, labels via `t()`)
- [ ] Ship an example Contact form wired to an external adapter
- [ ] Handle success and failure UI states gracefully
- [ ] Accessible fields (labels, keyboard, error messaging)

---

## Manual confirmation phase (required before Final)

### Change checklist

- [ ] _(none yet — populated during Manual confirmation)_

### Phase closeout

- [ ] Walk the change checklist with the human
- [ ] Human verbal confirmation recorded — slice ready for Final phase — **Note:** _date + paraphrase_

---

## Final phase — Documentation, tests, and verification (required)

### Documentation

- [ ] As-built doc in `docs/modules/submissions/features/external-forms/`
- [ ] Build evidence in `docs/project-files/build-evidence/`
- [ ] Update `docs/product-manager-agent/implementation-catalog.md`
- [ ] **Project-wide documentation update** (mandatory) — walk `docs/README.md` + layer hubs

### Success criteria

- [ ] Complete `success-criteria/closeout.md` — SC-01..SC-03 with `verify:` links
- [ ] Update `success-criteria/traceability.md` — Result + evidence
- [ ] Evaluate SC-xx; record in verification report

### Regression tests (executable — required)

- [ ] **Create** — adapter-only submit test, no-storage assertion, example form validation/success/failure component tests
- [ ] **Register** — add rows to `docs/project-files/regression/regression-plan.md`
- [ ] **SCAFFOLD** — update `tests/SCAFFOLD.md`: Planned → Populated
- [ ] **Execute** — `npm test`
- [ ] **Execute** — Playwright / UI smoke (pages changed)
- [ ] **Execute** — `npm run build` before merge

---

## Links

- Documentation map: `docs/README.md`
- Regression plan: `docs/project-files/regression/regression-plan.md`
- Test scaffold: `tests/SCAFFOLD.md`
