# External forms (as-built)

**Module:** submissions  
**Feature:** external-forms  
**Slice:** 05-external-submissions  
**Shipped:** 2026-08-21  
**Deviations:** [D01](../../../../requirements/slices/05-external-submissions/deviations/D01-local-mail-app-fallback.md) — HTTPS email service preferred; otherwise `mailto:` local mail-app handoff

## What it is

Public forms submit only through an external adapter: an administrator-configured HTTPS form/email endpoint, a hosted-form redirect, or (when no HTTPS endpoint is set) the visitor's platform mail app via `mailto:`. The static site never persists the payload.

## Runtime surface

| Path | Responsibility |
|------|----------------|
| `src/modules/submissions/external-forms/types.ts` | `SubmitAdapter` is `kind` + `submit` only |
| `src/modules/submissions/external-forms/config.ts` | Public `VITE_SUBMIT_*` env; secrets ignored |
| `src/modules/submissions/external-forms/email-adapter.ts` | POST `application/x-www-form-urlencoded` to https |
| `src/modules/submissions/external-forms/redirect-adapter.ts` | Navigate to https URL with query params |
| `src/modules/submissions/external-forms/mail-app-adapter.ts` | `mailto:` handoff; `{name}` / `{email}` / `{message}` templates |
| `src/modules/submissions/external-forms/resolve-adapter.ts` | Email-service when endpoint is https; else mail-app |
| `src/modules/submissions/external-forms/ExternalForm.tsx` | Fields, validation, success / handoff / error states |
| `src/modules/submissions/external-forms/ContactFormModule.tsx` | Example Contact module (`type: 'contact-form'`) |
| `src/modules/submissions/external-forms/fields.ts` | Default name / email / message specs; labels via `t()` |

## How it is configured

1. Register `contact-form` on a page (`pages-config.ts`). Demo: `#/about/contact`.
2. Optional: `VITE_SUBMIT_EMAIL_ENDPOINT` — public https form endpoint. Empty selects D01 mail-app fallback.
3. Optional mail-app: `VITE_SUBMIT_EMAIL_RECIPIENT`, `VITE_SUBMIT_EMAIL_SUBJECT`, `VITE_SUBMIT_EMAIL_BODY_TEMPLATE` (`\n` for line breaks).
4. Optional redirect adapter: page `config.adapter: 'redirect'` plus `VITE_SUBMIT_REDIRECT_URL`.

See [`docs/configuration/README.md`](../../../../configuration/README.md).

## Adapter selection (D01)

`createConfiguredSubmitAdapter('email-service')` POSTs when the endpoint is https. Otherwise it opens `mailto:` with the configured recipient (or an empty To: line) and rendered subject/body. Neither path writes `localStorage` / `sessionStorage`.

## UI states

Validation errors stay on the fields. Successful email-service submit shows success copy and clears the form. Mail-app success shows handoff copy. Adapter `config` / `network` / `http` failures show an alert without breaking the page.

## Out of scope

- Custom backend, database, or storing submissions on this origin
- Authenticated forms
- Playwright / axe CI (covered in Vitest)

## Tests

- `tests/unit/submit-adapters.test.ts`
- `tests/unit/contact-form.test.tsx`
