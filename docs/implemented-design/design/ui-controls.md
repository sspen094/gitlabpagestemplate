# Implemented design — UI controls (theme + style)

Cross-cutting visual contract for Slice 06. Feature as-builts: [`site-theme`](../../modules/theme/features/site-theme/README.md), [`modular-pages`](../../modules/pages/features/modular-pages/README.md).

## Theme tokens

All visual values come from `src/modules/theme/site-theme/config.ts` and are emitted as CSS custom properties. Component CSS uses those tokens — not raw spacing, radii, z-index, or palette colors (resets such as `padding: 0` stay literal).

Palettes: `mode` is `'system' | 'light' | 'dark'`. `system` emits a `prefers-color-scheme` block. Breakpoints are named on the theme; CSS `@media` still uses matching px literals, asserted in tests.

`resolveTheme` never throws. Unsafe CSS (`;{}`, `url(`) and out-of-range numbers revert per field.

## Page appearance

Optional `PageDefinition.appearance`:

| Axis | Values | Default |
|------|--------|---------|
| `width` | `reading` \| `narrow` \| `shell` | `reading` |
| `tone` | `default` \| `accent` \| `muted` | `default` |
| `rhythm` | `default` \| `compact` \| `roomy` | `default` |

Reading measure lives on `.page-composer` (`max-width: var(--page-measure, var(--layout-reading))`) so a page can widen past the default.

## Module style

Optional `ModuleInstance.style` — closed vocabulary in `src/modules/pages/modular-pages/style.ts`:

`variant`, `align`, `width`, `tone`, `surface`, `spacing`, plus type-specific `layout` (`card-list`: grid/list; `calendar`: list/month/hybrid and aliases).

Unknown values raise non-blocking `style-degraded` and render the default variant. Legacy `config.layout` is still honored.

## Related

- [`guides/rebrand-and-style.md`](../../guides/rebrand-and-style.md)
- [`pages.md`](pages.md)
