# Implemented design — modular pages

Cross-cutting notes for config-driven composition. Feature as-built: [`docs/modules/pages/features/modular-pages/README.md`](../../modules/pages/features/modular-pages/README.md).

## Rules

- A page is an ordered list of module instances in TypeScript config, not a custom page component.
- All types go through `ModulePipeline`: validate, then fallback, `UpdatableModule` hydration, or the registry component.
- New pages: append `defaultPages`. New types: `registerModule` plus type-specific validation.
- Module copy uses `t()` keys and/or literals. Image `alt` is required.
- Calendar events are `{ date, title }` rows so a published sheet can map date + display columns in Slice 04.

## Related

- Sheets fetch/hydration: [updatable-content.md](updatable-content.md) (Slice 04).
- Site navigation chrome: [navigation.md](navigation.md) (Slice 03).
- Contact form submit: [submissions.md](submissions.md) (Slice 05).
