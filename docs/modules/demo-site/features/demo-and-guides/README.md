# Demo site and guides (as-built)

**Module:** demo-site  
**Feature:** demo-and-guides  
**Slice:** 06-demo-site-and-docs  
**Shipped:** 2026-08-21

## What it is

A believable small-org sample site plus task-oriented guides. The `/demo` gallery route is retired; examples live on real pages. Content is fictional placeholder data only.

## Runtime surface

| Path | Responsibility |
|------|----------------|
| `src/modules/pages/modular-pages/pages-config.ts` | Home, Events, About, Contact, Members |
| `src/modules/navigation/navbar/nav-config.ts` | Top-level + About dropdown |
| `src/modules/updatable-content/sheets-hydration/sheet-mappings.ts` | `demo-text`, `demo-cards`, `demo-calendar`, `contact-info` |
| `tests/fixtures/google-sheets/` | Committed CSV fixtures — tests never hit the live sheet |
| `docs/guides/` | Editor + developer walkthroughs |

## Routes

| Hash route | Role |
|------------|------|
| `#/` | Home — hero, text, cards, section |
| `#/events` | Hybrid calendar (sheet-driven) |
| `#/about` | About (intentionally unstyled sample) |
| `#/about/contact` | Contact info + contact form |
| `#/about/members` | Card directory (sheet-driven) |

## Guides

Hub: [`docs/guides/README.md`](../../../../guides/README.md).

## Out of scope

- Real organization data
- Live-sheet reads in `npm test`

## Tests

- `tests/unit/demo-site.test.ts`
