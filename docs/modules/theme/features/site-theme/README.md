# Site theme (as-built)

**Module:** theme  
**Feature:** site-theme  
**Slice:** 06-demo-site-and-docs  
**Shipped:** 2026-08-21

## What it is

Typed tokens (color, type, spacing, radius, shadow, layout widths, breakpoints, z-index) emitted as CSS custom properties. Light and dark palettes honor `prefers-color-scheme` or an explicit `mode`. Malformed values fall back per field; the site never renders unstyled.

## Runtime surface

| Path | Responsibility |
|------|----------------|
| `src/modules/theme/site-theme/config.ts` | `SiteTheme` / `defaultTheme` |
| `src/modules/theme/site-theme/resolve.ts` | `resolveTheme` — never throws |
| `src/modules/theme/site-theme/theme-css.ts` | Custom-property emission |
| `src/modules/theme/site-theme/ThemeProvider.tsx` | Injects CSS; tests can pass an alternate theme |
| `src/modules/theme/site-theme/useTheme.ts` | Read the resolved theme |

Wired in `src/main.tsx` outside `TextProvider`. `MOBILE_MEDIA_QUERY` derives from `defaultTheme.breakpoints`.

## How it is configured

Edit `defaultTheme` in `config.ts`, or pass a partial theme into `ThemeProvider`. There is no visitor-facing light/dark toggle. Theme is never loaded from Sheets.

See [`docs/guides/rebrand-and-style.md`](../../../../guides/rebrand-and-style.md) and [`docs/implemented-design/design/ui-controls.md`](../../../../implemented-design/design/ui-controls.md).

## Tests

- `tests/unit/site-theme.test.tsx`
- `tests/unit/mobile-quality-gate.test.tsx` (tokenized stylesheet invariants)
