# Success criteria — Slice 03 navigation

## SC-01 Navbar renders top-level + sections + dropdown subsections
- [x] Navbar renders top-level pages, a section grouping, and a dropdown subsection (e.g. About > Contact/Members)
- verify: component test rendering the sample nav config
- evidence: `tests/unit/navbar.test.tsx` — Home, Demo, About, Contact, Members; `npm test` 2026-08-21 43 passed

## SC-02 Nav items/subsections are data-driven
- [x] Adding a config entry adds a nav item/subsection without bespoke markup changes
- verify: component/unit test adding a config entry
- evidence: `navbar.test.tsx` extra `faq` item; `npm test` 2026-08-21

## SC-03 Active page/section indicated
- [x] The current page/section is visually highlighted in the navbar
- verify: component test on active route state
- evidence: `aria-current="page"` + `is-active` on Demo and About/Contact; UI smoke `#/demo`, `#/about`

## SC-04 Keyboard-accessible navbar + dropdowns
- [x] Navbar + dropdowns are operable by keyboard (tab/arrow/enter/escape) with correct ARIA
- verify: Playwright keyboard flow + axe accessibility check
- evidence: Vitest keyboard suite in `navbar.test.tsx` (ArrowRight/Left, ArrowDown, Escape, `aria-expanded` / `menuitem`). Playwright/axe **N/A** — no `@playwright/test` in this repo (same as Slices 00–02)

## SC-05 Mobile hamburger + side drawer
- [x] Narrow viewports show a hamburger control that opens a side menu of the configured nav
- verify: component test with mobile `matchMedia`
- evidence: `navbar.test.tsx` “navbar mobile drawer”; Escape closes dialog

## SC-06 Mobile layout quality gate
- [x] Chrome and content modules wrap or scroll inside the viewport (no layout CSS that forces overflow)
- verify: `tests/unit/mobile-quality-gate.test.ts` + DP `mobile-layout.md`
- evidence: `tests/unit/mobile-quality-gate.test.tsx` PASS; DP-ML-01..05 PASS in verification report
