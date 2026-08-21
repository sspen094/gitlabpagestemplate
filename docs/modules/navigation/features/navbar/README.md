# Navbar (as-built)

**Module:** navigation  
**Feature:** navbar  
**Slice:** 03-navigation  
**Shipped:** 2026-08-21  
**Deviation:** [D01](../../../../requirements/slices/03-navigation/deviations/D01-mobile-nav-and-layout.md) — hamburger drawer + mobile layout quality gate

## What it is

Site chrome rendered from a developer-authored nav tree (`id`, `kind`, `labelKey`, `href`, optional children). The shell mounts one `Navbar`. There is no per-item React component. Labels go through `t()`.

## Runtime surface

| Path | Responsibility |
|------|----------------|
| `src/modules/navigation/navbar/types.ts` | `link` vs `section` items |
| `src/modules/navigation/navbar/nav-config.ts` | `defaultNav` (Home, Demo, About → Contact / Members) |
| `src/modules/navigation/navbar/Navbar.tsx` | Desktop inline nav + dropdowns |
| `src/modules/navigation/navbar/MobileNavbar.tsx` | Hamburger + side drawer (D01) |
| `src/modules/navigation/navbar/useIsMobile.ts` | `matchMedia('(max-width: 767px)')` |
| `src/modules/navigation/navbar/active.ts` | Current route vs href / section children |
| `src/modules/navigation/navbar/keyboard.ts` | Collect + move focus among top-level / submenu items |
| `src/App.tsx` | Header brand + `Navbar`; hash routes stay in `PageRoutes` |

## How to add a nav item

Append an entry to `defaultNav` in `nav-config.ts`. Use `kind: 'link'` for a page, or `kind: 'section'` with `children` for a dropdown. Add matching `nav.items.*` (and `nav.chrome.*` if needed) in `text-config.ts`. Register the destination in `pages-config.ts` if the route should render content.

## Default tree

| Item | Kind | Hash path |
|------|------|-----------|
| Home | link | `#/` |
| Demo | link | `#/demo` |
| About | section (optional landing) | `#/about` |
| Contact | child link | `#/about/contact` |
| Members | child link | `#/about/members` |

About landing and subsection pages are thin hero pages in `pages-config.ts` so dropdown targets are not 404s.

## Desktop behavior

- Hover opens a section dropdown; pointer-down outside closes it.
- Arrow left/right move among top-level items; Arrow down/up open a submenu and focus first/last item; Escape closes and returns focus to the trigger.
- Submenu uses `role="menu"` / `menuitem`. Triggers expose `aria-haspopup`, `aria-expanded`, `aria-controls`.
- Current href gets `aria-current="page"` and `is-active`. A section is `is-active` when any child (or its own href) matches.

## Mobile behavior (D01)

Below 768px the inline bar is replaced by a hamburger that opens a dialog drawer of the same config. Escape and the close control dismiss it and restore focus to the hamburger. Body scroll is locked while open.

## Layout quality gate (D01)

Chrome and modules must wrap or scroll inside the viewport. See DP [`mobile-layout.md`](../../../../project-files/verification/design-patterns/mobile-layout.md) and `tests/unit/mobile-quality-gate.test.tsx`.

## Out of scope

- Google Sheets–driven nav (nav stays developer config)
- Playwright / axe CI (not in this repo; keyboard + ARIA covered in Vitest)

## Tests

- `tests/unit/navbar.test.tsx` — structure, data-driven extra item, active route/section, keyboard, mobile drawer
- `tests/unit/mobile-quality-gate.test.tsx` — viewport, wrapping CSS, calendar scroll wrapper
