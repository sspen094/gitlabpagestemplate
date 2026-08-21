# Modular pages (as-built)

**Module:** pages  
**Feature:** modular-pages  
**Slice:** 02-modular-page-system  
**Shipped:** 2026-08-20  
**Deviation:** [D01](../../../../requirements/slices/02-modular-page-system/deviations/D01-calendar-module.md) — calendar module in this slice

## What it is

Pages are registered as configuration (`id`, `path`, ordered `modules`). Hash routes are derived from that list. Each instance goes through one pipeline: validate → registry component or fallback. There is no per-page React component.

## Runtime surface

| Path | Responsibility |
|------|----------------|
| `src/modules/pages/modular-pages/types.ts` | Definition model: type, `static` / `updatable`, config, `dataSource`, fallback |
| `src/modules/pages/modular-pages/validate.ts` | Structural + type-specific config checks |
| `src/modules/pages/modular-pages/registry.ts` | Module type → component |
| `src/modules/pages/modular-pages/pipeline.tsx` | `ModulePipeline` + `PageComposer` |
| `src/modules/pages/modular-pages/pages-config.ts` | `defaultPages` (home + demo) |
| `src/modules/pages/modular-pages/PageRoutes.tsx` | Hash routes from page config |
| `src/modules/pages/modular-pages/heading-level.tsx` | Nested heading levels |
| Baseline modules | `HeroModule`, `TextBlockModule`, `ImageBlockModule`, `CardListModule`, `SectionModule`, `CalendarModule` |
| `PlaceholderModule` | Kept for tests / leftover config |

## How to add a page

Append an entry to `defaultPages` in `pages-config.ts` (`id`, `path`, `modules`). Routes update automatically. Copy uses `t()` keys in `text-config.ts` and/or literal strings in `config`.

## Registered module types

| Type | Config highlights |
|------|-------------------|
| `hero` | `title` / `titleKey`; optional subtitle, body, media (`mediaSrc` + `mediaAlt`), CTA |
| `text` | `title` and/or `body` (key or literal) |
| `image` | `src` + required `alt`; optional caption |
| `card-list` | `entries` with titles; `layout` `grid` (default, auto-fit) or `list` |
| `section` | `children` — nested instances through the same pipeline |
| `calendar` | `events` with `date` (`YYYY-MM-DD`) + title; `layout` `list` (default) or `month` / `grid`; optional `month` `YYYY-MM` |
| `placeholder` | Title required; Phase 1 stub |

Unknown types, missing required fields, or a calendar `month` that is not `YYYY-MM` render `FallbackModule`. `updatable` is reserved (Slice 04 hydrates `dataSource`); this slice still renders from `config` when valid.

## Calendar layouts (D01 + Manual confirmation)

The same event rows feed both layouts (`date` column + display/title column) so Slice 04 can map a published sheet later. Fetching is not in this slice.

- **List:** dated entries with optional detail.
- **Month grid:** HTML table; events on their day; events outside the resolved month are omitted.

## Accessibility

- Page composer starts sibling modules at `h2`; `hero` uses `h1`.
- Sections with a title increment heading level for children.
- Image modules require alt text or fall back.

## Routes

| Hash path | Page id |
|-----------|---------|
| `#/` | `home` — hero + CTA to demo |
| `#/demo` | `demo` — all baseline types, including list + month calendars |
| `#/about` | `about` — section landing (Slice 03 nav target) |
| `#/about/contact` | `contact` — About subsection |
| `#/about/members` | `members` — About subsection |

## Out of scope

- Google Sheets hydration (Slice 04)
- FAQ, CTA-only, timeline, gallery, embed module types

Navbar chrome shipped in Slice 03 — [navbar as-built](../../../navigation/features/navbar/README.md). About/Contact/Members heroes exist so dropdown targets resolve.

## Tests

- `tests/unit/page-composer.test.tsx` — ordered modules, unknown-type fallback, config-only extra page
- `tests/unit/module-definition.test.ts` — model, `dataSource`, type-specific fallback
- `tests/unit/baseline-modules.test.tsx` — hero/text/image/cards/section/calendar; heading levels; missing alt; month-grid day placement
