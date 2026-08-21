# Implemented design — modular pages

Cross-cutting notes for config-driven composition. Feature as-built: [`docs/modules/pages/features/modular-pages/README.md`](../../modules/pages/features/modular-pages/README.md).

## Rules

- A page is an ordered list of module instances in TypeScript config, not a custom page component.
- All types (static now, updatable later) go through `ModulePipeline`: validate, then registry component or fallback.
- New pages: append `defaultPages`. New types: `registerModule` plus type-specific validation.
- Module copy uses `t()` keys and/or literals. Image `alt` is required.
- Calendar events are `{ date, title }` rows so a published sheet can map date + display columns in Slice 04.

## Not this slice

- Sheets fetch/hydration.
- Site navigation chrome (shipped in Slice 03 — see [navigation.md](navigation.md)).
