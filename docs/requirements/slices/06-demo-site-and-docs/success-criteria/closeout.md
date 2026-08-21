# Success criteria — Slice 06 demo-site-and-docs

## SC-01 Demo site shows all modules + update patterns (placeholder only)
- [x] Demo pages render each baseline module and updatable text/card/event patterns with placeholder content only — **2026-08-21**
- verify: `tests/unit/demo-site.test.ts` + `updatable-modules.test.tsx`
- evidence: `npm test` 159 passed; [build evidence](../../../project-files/build-evidence/06-demo-site-and-docs.md)

## SC-02 Developer guides: page / module / updatable section / sheet mapping / rebrand
- [x] Docs cover adding a page, adding a module, configuring an updatable section, mapping a Google Sheets source, and rebranding/styling via theme config and style options — **2026-08-21**
- verify: `docs/guides/` hub + five developer guides
- evidence: [guides/README.md](../../../guides/README.md)

## SC-03 Editor guide enables no-code updates
- [x] A non-technical user can update an approved section via the sample sheet by following the editor guide — **2026-08-21**
- verify: `docs/guides/editor-google-sheets.md` vs sample tabs
- evidence: Phase 4 editor guide; sample sheet URL in `.env.example`

## SC-04 Fork/rename/adapt documented; placeholder-only content
- [x] Fork/rename/adapt steps are documented and the demo contains placeholder-only content — **2026-08-21**
- verify: `docs/guides/fork-and-rename.md` + `demo-site.test.ts` placeholder pin
- evidence: fork guide + demo-site test

## SC-05 Central theme config drives a polished, accessible default design
- [x] Changing colors, fonts, and spacing in the central theme config restyles the whole site with no component style edits; both palettes are configurable with OS preference, explicit override, and safe fallback; the site shows consistent hierarchy and rhythm, visible `:focus-visible` and hover states, contrast meeting `requirements.md` §13 in both palettes, and intact mobile patterns DP-ML-01..05 — **2026-08-21**
- verify: `tests/unit/site-theme.test.tsx`, `tests/unit/mobile-quality-gate.test.tsx`; human review at both breakpoints/palettes
- evidence: 159 tests; phase 2 visual approval **2026-08-21**

## SC-06 Validated page- and module-level style options
- [x] A page sets content width, tone, and section rhythm through page configuration, and module instances accept typed style options from a closed set; unknown or malformed values fall back to the default variant and the page still renders — **2026-08-21**
- verify: `tests/unit/module-style.test.tsx`; card/calendar layout tests remain green
- evidence: 159 tests; [ui-controls.md](../../../implemented-design/design/ui-controls.md)
