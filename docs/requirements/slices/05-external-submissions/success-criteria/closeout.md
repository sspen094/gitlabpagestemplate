# Success criteria — Slice 05 external-submissions

## SC-01 Submissions use email/external service only
- [x] Submission is routed only to an external email service or external app/workflow
- verify: `npm test` — `tests/unit/submit-adapters.test.ts` (adapter keys are `kind` + `submit`; POST/redirect/mailto only)
- evidence: Vitest 139 passed 2026-08-21; [verification report](../../../project-files/verification-reports/20260821-143500-05-external-submissions/cursor-criteria.md)

## SC-02 No site-side storage of submissions
- [x] No backend/DB/local persistence of submitted data exists
- verify: code review of adapters + tests that `localStorage`/`sessionStorage.setItem` is not called on submit
- evidence: `submit-adapters.test.ts` and `contact-form.test.tsx` storage spies; no persist path on `SubmitAdapter`

## SC-03 Working example form with graceful states
- [x] Example contact form validates, submits externally, and shows success/failure states gracefully (HTTPS service or D01 `mailto:` fallback)
- verify: `tests/unit/contact-form.test.tsx` — validation, success, failure, handoff, `createConfiguredSubmitAdapter` selection
- evidence: Vitest 139 passed 2026-08-21; Contact module on `#/about/contact`
