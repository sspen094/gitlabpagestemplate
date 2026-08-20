# Success criteria — Slice 03 navigation

## SC-01 Navbar renders top-level + sections + dropdown subsections
- [ ] Navbar renders top-level pages, a section grouping, and a dropdown subsection (e.g. About > Contact/Members)
- verify: component test rendering the sample nav config
- evidence: _(test result at closeout)_

## SC-02 Nav items/subsections are data-driven
- [ ] Adding a config entry adds a nav item/subsection without bespoke markup changes
- verify: component/unit test adding a config entry
- evidence: _(test result at closeout)_

## SC-03 Active page/section indicated
- [ ] The current page/section is visually highlighted in the navbar
- verify: component test on active route state
- evidence: _(test result at closeout)_

## SC-04 Keyboard-accessible navbar + dropdowns
- [ ] Navbar + dropdowns are operable by keyboard (tab/arrow/enter/escape) with correct ARIA
- verify: Playwright keyboard flow + axe accessibility check
- evidence: _(a11y + e2e result at closeout)_
