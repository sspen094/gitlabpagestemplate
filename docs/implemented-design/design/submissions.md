# Implemented design — external submissions

Cross-cutting notes for public forms. Feature as-built: [`docs/modules/submissions/features/external-forms/README.md`](../../modules/submissions/features/external-forms/README.md).

## Rules

- Adapters expose only `kind` and `submit`. There is no persist/save path.
- HTTPS email-service endpoints and redirect URLs come from public `VITE_*` config. Provider secrets are never read.
- When no HTTPS email endpoint is set, Contact uses a `mailto:` handoff (D01). Recipient, subject, and body templates are optional owner config.
- The example Contact module lives on `#/about/contact` (`type: 'contact-form'`). Contact *details* from Sheets remain `type: 'contact'` (Slice 04).

## Related

- Page composition: [pages.md](pages.md).
- Sheet-backed contact lines: [updatable-content.md](updatable-content.md).
