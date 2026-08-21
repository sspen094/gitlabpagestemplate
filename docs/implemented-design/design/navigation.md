# Implemented design — navigation

Cross-cutting notes for site chrome. Feature as-built: [`docs/modules/navigation/features/navbar/README.md`](../../modules/navigation/features/navbar/README.md).

## Rules

- Nav is a TypeScript list (`defaultNav`), not hardcoded markup in the shell.
- Labels use `t()` keys under `nav.chrome` and `nav.items`.
- Desktop: inline links + hover/keyboard dropdowns. Mobile (`max-width: 767px`): hamburger + side drawer of the same tree.
- Active state follows the hash router pathname (`aria-current` + `is-active`).
- Adding a destination page is still a `pages-config.ts` change (Slice 02).

## Not this slice

- Sheets-backed nav items.
- Playwright/axe package.
