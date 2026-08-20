# Success criteria — Slice 02 modular-page-system

## SC-01 Add a page from config with minimal code
- [ ] A new page can be registered via config (module list + route) without bespoke per-page rendering code
- verify: add a sample page in test/demo; component test renders it
- evidence: _(test result at closeout)_

## SC-02 Baseline modules render from config
- [ ] header/hero, text, image, card list/grid, and section wrapper each render from config props
- verify: component tests per module with example content
- evidence: _(test results at closeout)_

## SC-03 Consistent rendering + module definition model
- [ ] All modules render through one pipeline and conform to the module definition model (type, mode, config, data source ref, validation, fallback)
- verify: unit test on definition model validation + fallback; render pipeline test
- evidence: _(test results at closeout)_

## SC-04 Accessible headings + image alt
- [ ] Rendered pages preserve heading hierarchy and image modules require/emit alt text
- verify: accessibility smoke (component or Playwright axe check)
- evidence: _(a11y result at closeout)_
