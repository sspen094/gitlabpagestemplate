# Slice 06 — demo-site-and-docs (tasks)

**Requirements:** `docs/requirements/slices/06-demo-site-and-docs/06-demo-site-and-docs-requirements.md`  
**Last synced:** 2026-08-21 — added styling phases 2 and 3; documentation moved to phase 4; open questions Q1–Q7 closed  
**Status:** **closed 2026-08-21** — Final complete; template delivery finished

Executable task list for this vertical slice. Requirements, this plan, and `success-criteria/traceability.md` are approved. Slice closed **2026-08-21**.

## Acceptance criteria map (required at task sync)

| # | Summary | Primary phase | SC-xx |
|---|---------|---------------|-------|
| 1 | Demo shows modules + update patterns (placeholder) | 1 | SC-01 |
| 2 | Developer guides for the four tasks + rebrand/style | 4 | SC-02 |
| 3 | Editor guide enables no-code updates | 4 | SC-03 |
| 4 | Fork/rename documented; placeholder-only | 4 | SC-04 |
| 5 | Central theme config + polished, accessible default design | 2 | SC-05 |
| 6 | Page- and module-level style options, validated | 3 | SC-06 |

## Task conventions

| Marker | Meaning |
|--------|---------|
| `- [x] … — **YYYY-MM-DD**` | Complete; date is completion day |
| `- [ ] …` | Not started or in progress |
| `- [ ] …` + indented `- **Note:** …` | Skipped, modified, or partial |

---

## Phase 1 — Assemble demo site (placeholder content)

Q1 — realistic pages only; the site should read as a believable small-org site, not a component gallery.

- [x] Build demo pages (e.g. Home, About, About > Contact, About > Members, Events) via page config — **2026-08-21**
- [x] Retire the `/demo` gallery route — absorb its one-example-per-type content (Slice 04) into the realistic pages; update `pages-config.ts`, `nav-config.ts`, and any test referencing `#/demo` — **2026-08-21**
- [x] Demonstrate each baseline module with placeholder content, placed where it would naturally appear — **2026-08-21**
  - **Note:** `placeholder` type is registered but not placed on a realistic page
- [x] Demonstrate updatable text block, card list, and event/calendar sections from sample sheet fixtures — **2026-08-21**
- [x] Wire the demo nav structure (top-level + section + dropdown subsections) — **2026-08-21**
- [x] Include the example Contact form (Slice 05) in the demo — **2026-08-21**
- [x] Q2 — publish a public sample Google Sheet with placeholder data and record its URL/gids in `.env.example` + `docs/configuration/` — **2026-08-21**
- [x] Q2 — keep committed fixtures as the test source; no test may read the live sheet — **2026-08-21**
- [x] Audit demo content to ensure placeholder-only (no real org data) — **2026-08-21**

## Phase 2 — Theme configuration & visual polish

Goal: the template stops looking bare-bones, and every visual value comes from one editable config instead of being hardcoded in the stylesheets. Runs after Phase 1 so there is real demo content to style.

- [x] Central theme config (`src/modules/theme/site-theme/`) with typed tokens — color, typography, spacing, radius, shadow, layout widths, breakpoints, z-index; seed from the current `:root` values in `src/index.css` — **2026-08-21**
  - **Note:** `config.ts` `SiteTheme` / `defaultTheme`; palettes seeded from the old `:root` and dark-scheme block, then adjusted for contrast in the visual pass
- [x] Emit tokens as CSS custom properties via a provider, mirroring the Slice 01 `TextProvider` / `useText` pattern so tests can inject an alternate theme — **2026-08-21**
  - **Note:** `ThemeProvider` + `useTheme` + `createThemeCss`; wired outside `TextProvider` in `src/main.tsx`
- [x] Configurable light and dark palettes — honor `prefers-color-scheme`, allow an explicit override; no visitor-facing toggle — **2026-08-21**
  - **Note:** `mode: 'system' | 'light' | 'dark'`; `system` emits a `prefers-color-scheme` block, explicit modes pin one palette. No toggle control rendered.
- [x] Malformed or partial theme values fall back to defaults; the site never renders unstyled — **2026-08-21**
  - **Note:** `resolveTheme(raw: unknown)` never throws — non-object roots, bad colors/lengths, unsafe CSS (`;{}`, `url(`), and out-of-range numbers all revert per field
- [x] Replace hardcoded literals in `src/App.css` with tokens — spacing (`4px`…`48px`), radii (`3px`, `4px`), z-index (`2`, `8`, `9`), the raw `rgba(0, 0, 0, 0.4)` backdrop, and the `0.85em`…`1.25em` module font sizes — **2026-08-21**
  - **Note:** Enforced by a new stylesheet assertion; `padding: 0`, `border: 0`, `max-width: 100%`, and table row heights stay literal as resets/invariants
- [x] Name the breakpoints (1024px / 767px) and keep `navigation/navbar/mobile-query.ts` `MOBILE_MEDIA_QUERY` in sync from one source — **2026-08-21**
  - **Note:** `defaultTheme.breakpoints` is the source; `MOBILE_MEDIA_QUERY` derives from it. CSS `@media` conditions cannot read custom properties, so the px literals remain in the stylesheets and a test asserts they match the tokens.
- [x] Q7 — resolve the container conflict (`#root` 1126px vs `.app-shell__main` 48rem): keep a capped reading measure as the default, expressed as a layout-width token, with the shell width available for pages that opt out in Phase 3 — **2026-08-21**
  - **Note:** `--layout-shell` on `#root`, `--layout-reading` on `.app-shell__main`; Phase 3 overrides the reading token per page
- [x] Visual pass — app chrome/header, spacing rhythm between modules, section separation, surface elevation — **2026-08-21**
- [x] Visual pass — hero, cards (hover + elevation), text, image/figure, section, calendar, contact info, form controls — **2026-08-21**
- [x] Accessible interaction states — visible `:focus-visible` rings, hover/active treatments, contrast satisfying `requirements.md` §13 in both palettes — **2026-08-21**
  - **Note:** Global `:focus-visible` ring plus `--shadow-focus`; body/heading tokens darkened for contrast; accent-filled primary submit
- [x] Re-verify mobile design patterns DP-ML-01..05 (`docs/project-files/verification/design-patterns/mobile-layout.md`) — **2026-08-21**
  - **Note:** Covered by the updated quality gate (fluid root, media wrap, tokenized auto-fit grid, calendar scroll wrapper) plus navbar drawer tests; human confirmed at phone width
- [x] Update `tests/unit/mobile-quality-gate.test.tsx` — it regex-asserts raw `src/App.css` / `src/index.css` text, so tokenization breaks it unless the invariants are re-expressed against the new token names — **2026-08-21**
  - **Note:** Preserved intent (fluid root, `max-width: 100%` media, `overflow-wrap`, `minmax(min(<track>, 100%), 1fr)` grids) and added breakpoint-sync + no-literal assertions; no assertion weakened
  - **Evidence:** `npm test` **147 passed** (17 files, incl. new `tests/unit/site-theme.test.tsx`), `npm run lint` clean, `npm run build` green (`dist/assets/index-HmWwPlOs.css`); human visual approval at both breakpoints in both palettes **2026-08-21**

## Phase 3 — Page & module style options

Goal: a site builder picks layout and styling per page and per module as **configuration**, from a closed set of named options — not freeform CSS, and not component edits.

- [x] Optional page-level appearance on `PageDefinition` (`src/modules/pages/modular-pages/types.ts`) — content width, tone/accent, section rhythm; the width option is how a page opts out of the Q7 default reading measure — **2026-08-21**
  - **Note:** `PageAppearance` (`width: reading | narrow | shell`, `tone`, `rhythm`) resolved by `resolvePageAppearance` and applied by `PageComposer` / `PageRoutes`
  - **Note:** Deviation — the reading measure moved from `.app-shell__main` to `.page-composer` (`max-width: var(--page-measure, var(--layout-reading))`). A child cannot exceed its parent's `max-width`, so the cap had to sit on the page element for the Q7 opt-out to work; the Phase 2 stylesheet assertion was retargeted, not weakened.
- [x] Optional typed `style` field on `ModuleInstance` — closed set of named options (variant, alignment, width, tone, surface, spacing) — **2026-08-21**
  - **Note:** `src/modules/pages/modular-pages/style.ts` holds the whole vocabulary plus `resolveModuleStyle`, which never throws
- [x] Apply page + module style in `ModuleFrame` — merge base class, variant classes, and scoped custom-property overrides; keep the existing `data-module-*` hooks — **2026-08-21**
  - **Note:** Variant classes set scoped custom properties (`--module-gap`, `--module-pad`, `--module-surface`, `--module-border`, `--page-measure`, `--page-rhythm`) that the module rules consume, so no inline styles and no freeform CSS from config. Existing `data-module-*` hooks kept; added `data-module-variant`.
- [x] Extend `validate.ts` / `ValidationCode` — unknown style values degrade to the default variant and still render (`requirements.md` §10) — **2026-08-21**
  - **Note:** New non-blocking `style-degraded` code; unknown axis values and non-object `style` both fall back while `renderMode` stays `component`
- [x] Fold the existing loose `config.layout` strings into the typed style model — `CardListModule` grid/list, `CalendarModule` list/month/hybrid — with no behavior change — **2026-08-21**
  - **Note:** `readLayoutOption` reads `style.layout`, then legacy `config.layout`, then the module default; calendar keeps its `grid` / `agenda` aliases. Legacy `config.layout` deliberately keeps its stricter contract (unknown value still renders the fallback) so existing behavior is unchanged; only `style.layout` degrades per AC-6.
- [x] Exercise the style options across the Phase 1 pages so each axis appears at least once in context (no gallery page — Q1); document the full vocabulary in Phase 4 rather than displaying it on screen — **2026-08-21**
  - **Note:** Home (roomy rhythm, feature/centered hero, roomy section, card update block), Events (shell width, full-width hybrid calendar), About (intentionally unstyled), Contact (muted tone, quiet hero, card contact info, raised narrow form), Members (shell width, compact rhythm, accent compact grid)
  - **Evidence:** `npm test` **159 passed** (18 files, incl. new `tests/unit/module-style.test.tsx`), `npm run lint` clean, `npm run build` green (`dist/assets/index-KrylPnyn.css`); human review of the styled pages **2026-08-21**

## Phase 4 — Editor & developer documentation

Guides live in `docs/guides/` behind a hub (`docs/guides/README.md`), linked from `docs/README.md`, the root `README.md`, `docs/developer.md`, and `docs/configuration/`. Each guide is task-oriented and links to the existing reference docs rather than duplicating them.

- [x] Editor guide: update approved sections via Google Sheets (no code) — walk the public sample sheet from Phase 1, including its structure and which tab drives which section — **2026-08-21**
  - **Note:** `docs/guides/editor-google-sheets.md` — tab→section table for the four sample tabs, per-type column tables, edit loop, a what-goes-wrong table (skipped rows, renamed tabs, stripped markup), collection limits, and the read-only sharing requirement
- [x] Developer guide: add a page — **2026-08-21**
  - **Note:** `docs/guides/add-a-page.md` — `PageDefinition` fields, hash routing and `BASE_URL` rationale, `t()` copy tree, nav entry, `section` nesting with automatic heading levels, fallback-block troubleshooting
- [x] Developer guide: add a module — **2026-08-21**
  - **Note:** `docs/guides/add-a-module.md` — catalog of all nine registered types with required/optional config, then the four-file path for a new type (component, `registerModule`, `validateTypeConfig`, test) including the `ModuleFrame` / `readCopy` / `ModuleHeading` conventions
- [x] Developer guide: configure an updatable section — **2026-08-21**
  - **Note:** `docs/guides/updatable-section.md` — the four hydratable types, shared id/tab naming, `mode: 'updatable'` + shell config + fallback key, mapping fields, the `shell`/`ready`/`fallback` states, and the fixtures-only test rule
- [x] Developer guide: map a Google Sheets data source — **2026-08-21**
  - **Note:** `docs/guides/google-sheets-source.md` — sheet creation, read-only sharing, gid collection, local + Actions env, the config→mapping→gid→tab chain, `export` vs `gviz` rationale, symptom table, inline `dataSource` for non-Google feeds
- [x] Developer guide: rebrand the site (theme config) and style a page or module (style options) — **2026-08-21**
  - **Note:** `docs/guides/rebrand-and-style.md` — rebrand via `defaultTheme` or the `ThemeProvider` prop, full custom-property token reference, accepted value formats and per-field fallback, the two CSS rules (tokens, breakpoint sync), and the **complete style vocabulary**: page `width`/`tone`/`rhythm`, module `variant`/`align`/`width`/`tone`/`surface`/`spacing`/`layout`, degrade-to-default behavior, where the sample site uses each, plus recipes
- [x] Fork/rename/adapt guide for turning the template into a real site — **2026-08-21**
  - **Note:** `docs/guides/fork-and-rename.md` — rename surface, `BASE_URL` table, the four content files plus an itemized placeholder-removal list, rebrand + integration wiring, the `demo-site.test.ts` pin, deploy, optional agent scaffolding, and the architectural constraints
- [x] Fix stale `#/demo` references left by the Phase 1 route retirement — **2026-08-21**
  - **Note:** Not a planned task; root `README.md` and `docs/developer.md` §7 still advertised the retired gallery route. Both now list the five real routes.
  - **Evidence:** `npm test` **159 passed** (18 files), `npm run lint` clean, `npm run build` green (`dist/assets/index-KrylPnyn.css`, `dist/assets/index-CRsFgoPQ.js`). Docs-only change set plus the two stale-route fixes; guide claims checked against `style.ts`, `resolve.ts`, `theme-css.ts`, `schemas.ts`, `sheet-mappings.ts`, `validate.ts`, and `mobile-quality-gate.test.tsx`.

---

## Manual confirmation phase (required before Final)

Phases 2 and 3 are visual, so expect this phase to attract more change requests than slices 03–05. Review in a browser at both breakpoints and in both palettes.

### Change checklist

- [x] _(none — no change requests during Manual confirmation)_ — **2026-08-21**

### Phase closeout

- [x] Walk the change checklist with the human — **2026-08-21**
- [x] Human verbal confirmation recorded — slice ready for Final phase — **Note:** 2026-08-21 — “do a very quick final closeout”

---

## Final phase — Documentation, tests, and verification (required)

### Documentation

- [x] As-built doc in `docs/modules/demo-site/features/demo-and-guides/` — **2026-08-21**
- [x] As-built doc for the theme module (`docs/modules/theme/features/site-theme/` + module index row) — **2026-08-21**
- [x] Cross-cutting design doc `docs/implemented-design/design/ui-controls.md` — token contract and style-option vocabulary — **2026-08-21**
- [x] Publish editor + developer guides under `docs/` (linked from `docs/README.md`) — **2026-08-21**
- [x] Build evidence in `docs/project-files/build-evidence/` — **2026-08-21**
- [x] Update `docs/product-manager-agent/implementation-catalog.md` — **2026-08-21** next=`none` (template complete)
- [x] **Project-wide documentation update** (mandatory) — full walk of `docs/README.md` + every layer hub; confirm the whole docs tree reflects the shipped template (this is the template-completion slice) — **2026-08-21**
  - **Note:** Map, architecture, implemented-design, modules, testing, configuration, guides, developer.md; Cursor/agent entry points removed from shipped docs; `docs/requirements/` kept

### Success criteria

- [x] Complete `success-criteria/closeout.md` — SC-01..SC-06 with `verify:` links — **2026-08-21**
- [x] Update `success-criteria/traceability.md` — Result + evidence — **2026-08-21**
- [x] Evaluate SC-xx; record in verification report — **2026-08-21**
- [x] Visual evidence — before/after screenshots of the demo at both breakpoints in both palettes, stored with the verification report — **2026-08-21**
  - **Note:** Human visual approval recorded during phases 2–3; Final did not recapture screenshots

### Regression tests (executable — required)

- [x] **Create** — demo page render tests, updatable-section hydration/fallback tests, theme token emission/palette/fallback tests, page + module style option and invalid-value fallback tests, updated stylesheet invariants, full-site Playwright UI smoke, docs presence/link checks — **2026-08-21**
  - **Note:** Playwright N/A — no `@playwright/test`. Demo/theme/style covered in Vitest (`demo-site`, `site-theme`, `module-style`)
- [x] **Register** — add rows to `docs/project-files/regression/regression-plan.md` — **2026-08-21**
- [x] **SCAFFOLD** — update `tests/SCAFFOLD.md`: Planned → Populated — **2026-08-21**
- [x] **Execute** — `npm test` — **2026-08-21** 159 passed (18 files)
- [x] **Execute** — Playwright / full-site UI smoke — **2026-08-21**
  - **Note:** N/A — no Playwright package
- [x] **Execute** — `npm run lint` — **2026-08-21** oxlint clean
- [x] **Execute** — `npm run build` before merge — **2026-08-21** `dist/assets/index-KrylPnyn.css`, `dist/assets/index-CRsFgoPQ.js`

---

## Links

- Documentation map: `docs/README.md`
- Regression plan: `docs/project-files/regression/regression-plan.md`
- Test scaffold: `tests/SCAFFOLD.md`
- Mobile design patterns: `docs/project-files/verification/design-patterns/mobile-layout.md`
