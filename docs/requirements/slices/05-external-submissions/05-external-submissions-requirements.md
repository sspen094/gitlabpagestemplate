# Slice 05 — external-submissions (requirements)

**Status:** Approved  
**Owner:** Template maintainer  
**Last updated:** 2026-08-21  
**Slice id:** 05  
**Module(s):** submissions  
**Primary feature name (code):** external-forms  
**Feature folders touched:** `src/` (form modules, external submit adapters)  
**Target database (intent):** N/A — no owned storage  
**Runtime database (if different):** N/A

Traces to product [`requirements.md`](../../requirements.md) §7.6, §16.

---

## Objective

Provide public-facing form flows (contact, event registration, volunteer sign-up, mailing list) that submit only via an external email service or by redirecting to an external app/workflow — with no custom backend and no site-side storage of submitted data.

## Scope

### In scope

- Reusable form module(s) for public submissions.
- Submission adapters that either send email through an external service or redirect users to an external app/workflow.
- At least one working example form (contact) using an external mechanism.
- Graceful handling of submission success/failure states in the UI.

### Out of scope

- Any custom backend, database, or server-side storage of submissions.
- Authenticated flows / user accounts.
- Storing or processing submitted data within the site.

## Users and workflows

A visitor fills a public form (e.g. contact). On submit, the data is sent through an external email service or the visitor is handed off to an external workflow (e.g. a hosted form/app). The site never persists the submission itself.

## Functional requirements

1. Public forms exist for actions such as contact, event registration, volunteer, and mailing list (at least contact shipped as example).
2. Submission is limited to sending email via an external service, or redirecting to an external app/workflow.
3. The website stores no submitted data (no backend, no DB).
4. Success and failure states are handled gracefully in the UI.

## UI and navigation

- **Page purpose:** A page/section hosting an example public form (e.g. Contact).
- **User-visible behaviors:** Validation, submit, confirmation/success message, error message, external redirect where applicable.
- **Accessibility:** Labeled fields, keyboard operable, error messaging.

## Data and integrations

- **Writes (owned):** None — no site-side storage.
- **External APIs:** External email service and/or external form/app; configuration is non-secret where public, secrets never committed.

## Non-functional requirements

- No backend/SSR/DB.
- External endpoints configured via non-secret config; provider secrets are not committed.
- Fails gracefully — a failed submit does not break the page.

## Dependencies

- **Other slices:** Slice 02 (module system), Slice 01 (`t()` labels), Slice 03 (nav link to the form page).

## Acceptance criteria

1. Public submission flows rely only on email or external services, not custom backend storage.
2. The website stores no submitted data.
3. At least one working example form (contact) submits via an external mechanism, with graceful success/failure handling.

## Success criteria

See [closeout.md](success-criteria/closeout.md) and [traceability.md](success-criteria/traceability.md).

| Id | Title | Maps to acceptance # |
|----|-------|----------------------|
| SC-01 | Submissions use email/external service only | 1 |
| SC-02 | No site-side storage of submissions | 2 |
| SC-03 | Working example form with graceful states | 3 |

## Testing and verification

**Regression intent:**

- Form validates input and calls the external submit adapter (not a local store) (unit/component).
- No persistence path exists (code review / test asserting adapter-only submit).
- Success and failure UI states render correctly (component).

## Open questions

| # | Question | Status |
|---|----------|--------|
| Q1 | Preferred email service / external form provider for the reference example? | Open |
