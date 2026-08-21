# Modular pages (as-built)

**Module:** pages  
**Feature:** modular-pages  
**Slice:** 02-modular-page-system  
**Shipped:** 2026-08-20  
**Deviation:** [D01](../../../../requirements/slices/02-modular-page-system/deviations/D01-calendar-module.md) — calendar module in this slice

## What it is

Pages are registered as configuration (`id`, `path`, ordered `modules`). Hash routes are derived from that list. Each instance goes through one pipeline: validate → fallback, `UpdatableModule`, or registry component. There is no per-page React component.

## Runtime surface

| Path | Responsibility |
|------|----------------|
| `src/modules/pages/modular-pages/types.ts` | Definition model: type, `static` / `updatable`, config, `dataSource`, fallback |
| `src/modules/pages/modular-pages/validate.ts` | Structural + type-specific config checks |
| `src/modules/pages/modular-pages/registry.ts` | Module type → component |
| `src/modules/pages/modular-pages/pipeline.tsx` | `ModulePipeline` + `PageComposer` |
| `src/modules/pages/modular-pages/pages-config.ts` | `defaultPages` (home, Events, About/Contact/Members) |
| `src/modules/pages/modular-pages/style.ts` | Closed page appearance + module style vocabulary |
| `src/modules/pages/modular-pages/PageRoutes.tsx` | Hash routes from page config |
| `src/modules/pages/modular-pages/heading-level.tsx` | Nested heading levels |
| `src/modules/pages/modular-pages/calendar-events.ts` | Event shape + date helpers, including upcoming-event selection |
| Baseline modules | `HeroModule`, `TextBlockModule`, `ImageBlockModule`, `CardListModule`, `SectionModule`, `CalendarModule`, `ContactInfoModule` |
| Slice 05 form | `ContactFormModule` (`type: 'contact-form'`) — owned by [external-forms](../../../submissions/features/external-forms/README.md) |
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
| `calendar` | `events` with `date` (`YYYY-MM-DD`) + title; `layout` `list` (default), `month` / `grid`, or `hybrid` / `agenda`; optional `month` `YYYY-MM`, `upcomingCount`, `upcomingTitle` / `upcomingTitleKey` |
| `contact` | Label/value list; `type` `email` / `phone` / `url` / `plain` |
| `contact-form` | Example Contact form; submits via Slice 05 adapters |
| `placeholder` | Title required; Phase 1 stub |

Unknown types, missing required fields, or a calendar `month` that is not `YYYY-MM` render `FallbackModule`. `mode: 'updatable'` goes through Slice 04 `UpdatableModule` (static `config` is the shell).

## Calendar layouts (D01 + Manual confirmation)

The same event rows feed every layout (`date` column + display/title column), so a published sheet maps onto any of them (Slice 04 hydration).

- **List:** dated entries with optional detail.
- **Month grid:** HTML table; events on their day; events outside the viewed month are omitted. Previous/Next steps one month at a time, limited to January of the current year through December of the following year; a configured month outside that window clamps to the nearest bound.
- **Hybrid:** next-events cards beside the month grid. `selectUpcomingEvents` in `calendar-events.ts` takes up to `upcomingCount` (default 5) dated events from today forward, soonest first, and falls back to the most recent past events so the cards are never empty; rows whose `date` is not an ISO day are kept in config order. The grid still receives every event and shares the same year-limited stepping. Two columns above 1024px, stacked below.

## Accessibility

- Page composer starts sibling modules at `h2`; `hero` uses `h1`.
- Sections with a title increment heading level for children.
- Image modules require alt text or fall back.

## Routes

| Hash path | Page id |
|-----------|---------|
| `#/` | `home` — hero + CTA to demo |
| `#/demo` | `demo` — one sheet-backed example per updatable type; the calendar uses the hybrid layout |
| `#/about` | `about` — section landing (Slice 03 nav target) |
| `#/about/contact` | `contact` — hero + sheet-backed `contact-info` + `contact-form` |
| `#/about/members` | `members` — About subsection |

## Out of scope

- Sheets fetch client (owned by [sheets-hydration](../../../updatable-content/features/sheets-hydration/README.md))
- FAQ, CTA-only, timeline, gallery, embed module types

Navbar chrome shipped in Slice 03 — [navbar as-built](../../../navigation/features/navbar/README.md). About/Contact/Members heroes exist so dropdown targets resolve.

## Tests

- `tests/unit/page-composer.test.tsx` — ordered modules, unknown-type fallback, config-only extra page
- `tests/unit/module-definition.test.ts` — model, `dataSource`, type-specific fallback
- `tests/unit/baseline-modules.test.tsx` — hero/text/image/cards/section/calendar/contact; heading levels; missing alt; month-grid day placement; hybrid cards + grid; upcoming-event selection; month stepping; demo + contact composition
- `tests/unit/contact-form.test.tsx` — Contact form module (Slice 05)
