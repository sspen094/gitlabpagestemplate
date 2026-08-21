# Text lookup (as-built)

**Module:** text  
**Feature:** t-lookup  
**Slice:** 01-text-management  
**Shipped:** 2026-08-20

## What it is

A build-time text system. Components call `t('page.section.item')` (or `useText()`). Strings live in one tree so copy edits do not require hunting through JSX.

## Runtime surface

| Path | Responsibility |
|------|----------------|
| `src/modules/text/t-lookup/text-config.ts` | Central `defaultText` tree — edit copy here |
| `src/modules/text/t-lookup/keys.ts` | `[page].[section]` grouping and full-key checks |
| `src/modules/text/t-lookup/resolve.ts` | Lookup against a given tree |
| `src/modules/text/t-lookup/fallback.ts` | Missing-key behavior (`echo` default, optional `placeholder`) |
| `src/modules/text/t-lookup/text-runtime.ts` | Active tree for module-level `t()` |
| `src/modules/text/t-lookup/t.ts` | `t()` and `createT(tree)` |
| `src/modules/text/t-lookup/TextProvider.tsx` | React swap point for an alternate tree |
| `src/modules/text/t-lookup/useText.ts` | Hook used by the app shell |
| `src/main.tsx` | Wraps the app in `TextProvider` |
| `src/App.tsx` | Shell copy via `useText()` keys |

## How to change copy

Edit the matching leaf under `defaultText` in `text-config.ts`. Keys are `page.section.item`. The shell currently uses `home.header.brand` plus page module keys. Navbar labels live under `nav.chrome` and `nav.items`.

The HTML `<title>` in `index.html` is not on this path.

## Fallback

Unknown or malformed keys do not throw. Default: echo the key string. Optional: `setTextFallback({ mode: 'placeholder', placeholder: '[{key}]' })`.

## Alternate text set

Call sites keep the same keys. Swap the tree with:

- `<TextProvider tree={alt}>` (React)
- `createT(altTree)` (bound function)
- `setActiveTextTree(altTree)` (module-level `t()`)

No locale picker or runtime UI in this slice.

## Out of scope (later slices)

Google Sheets–driven copy (Slice 04). Full localization UI.

## Tests

- `tests/unit/t-lookup.test.tsx` — known keys, missing-key fallback, `createT` / `setActiveTextTree` / `TextProvider`
- `tests/unit/app-shell.test.tsx` — shell reads from `defaultText`
