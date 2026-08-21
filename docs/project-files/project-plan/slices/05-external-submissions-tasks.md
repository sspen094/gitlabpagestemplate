# Slice 05 — external-submissions (tasks)

**Requirements:** `docs/requirements/slices/05-external-submissions/05-external-submissions-requirements.md`  
**Last synced:** 2026-08-21 — D01 local mail-app fallback  
**Status:** shipped **2026-08-21** — Manual confirmation + Final closed

Executable task list for this vertical slice. Plan is approved; start implementation only via `/start-phase`.

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

- [x] Define a submit-adapter interface (email service send / external redirect) — no persistence path — **2026-08-21** `SubmitAdapter` is `kind` + `submit` only (`types.ts`); contract asserted in `submit-adapters.test.ts`
- [x] Implement an external email-service adapter (config-driven endpoint; no committed secrets) — **2026-08-21** `createEmailServiceAdapter` POSTs `application/x-www-form-urlencoded` to https; never throws; `submit-adapters.test.ts` (9 passed)
- [x] Implement an external redirect/handoff adapter — **2026-08-21** `createRedirectAdapter` navigates to https URL + query params; `submit-adapters.test.ts`
- [x] Configure endpoints via non-secret config / `.env.example` — **2026-08-21** `VITE_SUBMIT_EMAIL_ENDPOINT` / `VITE_SUBMIT_REDIRECT_URL`; `resolveSubmitConfig` ignores secrets; `docs/configuration/README.md`

## Phase 2 — Example form module & states

- [x] Reusable form module (fields, validation, labels via `t()`) — **2026-08-21** `ExternalForm` + `defaultContactFields`; labels from `text-config`; `contact-form.test.tsx`
- [x] Ship an example Contact form wired to an external adapter — **2026-08-21** `ContactFormModule` registered as `contact-form` on `#/about/contact`; adapter via `createConfiguredSubmitAdapter`
- [x] Handle success and failure UI states gracefully — **2026-08-21** sending / success / handoff / error / config-error; `contact-form.test.tsx`
- [x] Accessible fields (labels, keyboard, error messaging) — **2026-08-21** labeled inputs, native submit, field-level + status messages
- [x] D01 — Prefer an admin-configured HTTPS service; otherwise open the local mail app via `mailto:` with configurable recipient, subject, and body template (`{name}`, `{email}`, `{message}`) — **2026-08-21** `createMailAppAdapter`; empty `VITE_SUBMIT_EMAIL_ENDPOINT` selects mailto; owner templates in submit config

---

## Manual confirmation phase (required before Final)

### Change checklist

- [x] _(none)_ — **2026-08-21**
  - **Note:** No change requests or review defects during Manual confirmation

### Phase closeout

- [x] Walk the change checklist with the human — **2026-08-21** empty checklist; owner asked to finish Manual confirmation and Final
- [x] Human verbal confirmation recorded — slice ready for Final phase — **2026-08-21**
  - **Note:** Paraphrase: “finish out this and the final steps.”

---

## Final phase — Documentation, tests, and verification (required)

### Documentation

- [x] As-built doc in `docs/modules/submissions/features/external-forms/` — **2026-08-21**
- [x] Build evidence in `docs/project-files/build-evidence/` — **2026-08-21** `05-external-submissions.md`
- [x] Update `docs/product-manager-agent/implementation-catalog.md` — **2026-08-21** next=`06`
- [x] **Project-wide documentation update** (mandatory) — walk `docs/README.md` + layer hubs — **2026-08-21** map, architecture, implemented-design, modules indexes, configuration, testing, catalog, developer, root README

### Success criteria

- [x] Complete `success-criteria/closeout.md` — SC-01..SC-03 with `verify:` links — **2026-08-21**
- [x] Update `success-criteria/traceability.md` — Result + evidence — **2026-08-21** all PASS
- [x] Evaluate SC-xx; record in verification report — **2026-08-21** `docs/project-files/verification-reports/20260821-143500-05-external-submissions/`

### Regression tests (executable — required)

- [x] **Create** — adapter-only submit test, no-storage assertion, example form validation/success/failure component tests — **2026-08-21** `submit-adapters.test.ts`, `contact-form.test.tsx`
- [x] **Register** — add rows to `docs/project-files/regression/regression-plan.md` — **2026-08-21** R-05 / U-05
- [x] **SCAFFOLD** — update `tests/SCAFFOLD.md`: Planned → Populated — **2026-08-21** unit files listed; e2e smoke remains Planned (no Playwright)
- [x] **Execute** — `npm test` — **2026-08-21** 15 files, **139 passed**
- [x] **Execute** — Playwright / UI smoke (pages changed) — **2026-08-21**
  - **Note:** N/A — `@playwright/test` not a dependency; form states covered in Vitest; Contact on `#/about/contact`
- [x] **Execute** — `npm run build` before merge — **2026-08-21** `dist/assets/index-CeUXqrAB.css`, `dist/assets/index-CMSkdbGH.js`

---

## Links

- Documentation map: `docs/README.md`
- Regression plan: `docs/project-files/regression/regression-plan.md`
- Test scaffold: `tests/SCAFFOLD.md`
