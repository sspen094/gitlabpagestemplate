# Deviation D01 — local mail app fallback

**Slice:** `05-external-submissions`  
**Deviation id:** `D01`  
**Date:** 2026-08-21  
**Status:** Approved  
**Discovered during:** Phase 2 of `docs/project-files/project-plan/slices/05-external-submissions-tasks.md`  
**Trigger:** During Contact form review, the owner required external service configuration to remain optional. When no service is configured, submission must use the standard local-app handoff supported by Windows and mobile devices.

Mid-slice scope change during **build** — not post-test QA bugs.

---

## 1. Change summary

The Contact form may POST to an administrator-configured HTTPS form service. Without that endpoint, it must fall back to a `mailto:` handoff that opens the visitor's default mail application with the form values prefilled. The site still stores nothing.

## 2. Requirements delta

### Modified

- An external email-service endpoint is optional, not required for the example form to work.
- Missing service configuration selects a local `mailto:` app handoff instead of showing a configuration failure.
- A non-secret recipient email may be configured; when omitted, the mail composer opens without a recipient.
- The owner may configure the mail subject and body template. `{name}`, `{email}`, and `{message}` placeholders are replaced with submitted values, and `\n` creates line breaks.

## 3. Main doc callouts

| Main doc section | Callout text |
|------------------|--------------|
| Users and workflows | The visitor is handed off to the local mail app when no external service is configured. |
| Functional requirements | Prefer a configured HTTPS email service; otherwise use a `mailto:` handoff. |
| Data and integrations | `mailto:` is an allowed local-app handoff and never persists data on the site. |

## 4. Project plan impact

| Impact | Detail |
|--------|--------|
| **New tasks** | Phase 2 — implement and test a local mail-app adapter, automatic service-to-mail fallback, recipient, and message templates. |
| **Modified tasks** | Contact example must work without a service endpoint; owners can format the local-app message. |
| **Final phase** | Re-confirm adapter-only, no-storage, service, and mail-app fallback tests. |

## 5. Success criteria (delta)

| Id | Action | Detail |
|----|--------|--------|
| SC-03 | Modify | Working Contact example uses a configured service or falls back to the local mail app, with graceful states. |

## 6. Regression intent (delta)

- Configured HTTPS endpoint selects the email-service adapter.
- Missing endpoint selects `mailto:` and opens the local mail app with encoded form values.
- Recipient, subject, body template, placeholders, and line breaks are configurable.
- Neither path writes browser storage.

## 7. Approval

| Role | Name | Date |
|------|------|------|
| Owner | sam.spencer | 2026-08-21 |

Approved in chat: “it should allow an admin to set a service but should fall back on the standard 'open a local app interface' that windows and mobile supports”.
