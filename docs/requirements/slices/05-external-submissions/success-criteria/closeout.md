# Success criteria — Slice 05 external-submissions

## SC-01 Submissions use email/external service only
- [ ] Submission is routed only to an external email service or external app/workflow
- verify: unit/component test asserting the submit adapter is external (no local persistence call)
- evidence: _(test result at closeout)_

## SC-02 No site-side storage of submissions
- [ ] No backend/DB/local persistence of submitted data exists
- verify: code review + test that no storage path is invoked on submit
- evidence: _(review note + test at closeout)_

## SC-03 Working example form with graceful states
- [ ] Example contact form validates, submits externally, and shows success/failure states gracefully
- verify: component test on validation + success + failure states
- evidence: _(test result at closeout)_
