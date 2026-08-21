# Slice 06 — demo-site-and-docs (requirements)

**Status:** Approved — 2026-08-21 (owner: "approved but don't start")  
**Owner:** Template maintainer  
**Last updated:** 2026-08-21 — styling and theming added to scope; Q1–Q7 closed; approved  
**Slice id:** 06  
**Module(s):** demo-site, docs, theme  
**Primary feature name (code):** demo-and-guides  
**Feature folders touched:** `src/` (demo pages/content config, theme module, global stylesheets, module frame, page/module definition types), `docs/` (editor + developer guides)  
**Target database (intent):** N/A — static site  
**Runtime database (if different):** N/A

Traces to product [`requirements.md`](../../requirements.md) §2, §5.2, §9, §12, §13, §14, §15, §16.

---

## Objective

Assemble a coherent example/demo site using placeholder content that demonstrates all shipped modules and update patterns, give the template a deliberate and configurable visual design, and author the guides that make the template easy to fork: an editor guide (Google Sheets updates) and developer guides (add a page, add a module, configure an updatable section, map a Sheets source, rebrand and style).

The template currently renders correct but bare-bones pages, with every visual decision hardcoded in two global stylesheets. As the template-completion slice, 06 is where appearance becomes both **good** and **configurable**: a forker should set their own colors, typography, spacing, and layout in one place, and choose per-page and per-module styling from a defined set of options without rewriting component CSS.

## Scope

### In scope

- Demo pages composed from the module system (static + updatable) with **placeholder content only**, presented as a believable site rather than a component gallery (Q1) — the existing `/demo` route is retired and its examples are absorbed into the realistic pages.
- A demonstration of each baseline module and at least one updatable text block, card list, and event/calendar section.
- Example navigation structure (top-level + section + dropdown subsections).
- A public sample Google Sheet with placeholder data for the editor-guide walkthrough, alongside committed fixtures that back the tests (Q2).
- Editor guide: how a non-technical user updates approved sections via Google Sheets (no code).
- Developer guides: adding a page, adding a module, configuring an updatable section, mapping a Google Sheets source.
- Fork/rename/adapt guidance for turning the template into a real site.
- Example sheet structure documentation (sample/placeholder data only).
- A central, typed theme configuration covering color, typography, spacing, radius, shadow, layout widths, breakpoints, and z-index.
- Configurable light and dark palettes, honoring OS preference with an explicit override.
- A visual quality pass across the app shell and every shipped module so the default template looks finished.
- Page-level appearance options in the page definition and module-level style options on module instances, drawn from a closed, validated set.

### Out of scope

- Real organization-specific content.
- New module types or new integrations beyond what Slices 02–05 shipped.
- Theme values sourced from Google Sheets — appearance is developer/forker configuration, not editor-updatable content.
- A visitor-facing light/dark toggle control.
- Arbitrary or freeform CSS injected through page configuration.
- A new styling technology — no CSS framework, preprocessor, or CSS-in-JS dependency.
- Multiple shipped starter presets — one well-designed default theme.

## Users and workflows

- **Visitor:** browses the demo to understand the feature set, on desktop or mobile, in light or dark according to OS preference.
- **Editor:** follows the editor guide to update an approved section via a sample sheet.
- **Developer:** follows developer guides to fork the template, add a page/module, and wire an updatable section.
- **Developer forking the template:** edits one theme config file to set brand colors, fonts, spacing, and container widths, and the whole site — chrome, navbar, modules, forms — picks up the new look with no component edits.
- **Developer building a page:** declares modules in the page config as today, and additionally selects named style options per page and per module to vary layout and emphasis without writing CSS.

## Functional requirements

1. The delivered site includes an example/demo experience illustrating available modules and update patterns using **placeholder content only**.
2. Documentation covers: adding a page, adding a module, configuring an updatable section, and mapping a Google Sheets data source.
3. An editor guide lets a non-technical user update approved sections without editing code.
4. The repository is structured and documented so it is easy to fork, rename, and adapt into a real website.
5. Example sheets/structures use sample or placeholder data only.
6. Site appearance is driven by a single central theme configuration; changing it restyles the whole site with no component style edits. Tokens cover color, typography, spacing, radius, shadow, layout widths, breakpoints, and z-index, and component styles consume them instead of literal values. Light and dark palettes are both configurable, OS preference is honored, an explicit override is available, and malformed values fall back safely. The delivered template presents a polished default design with consistent hierarchy, spacing rhythm, visible focus and hover states, and accessible contrast in both palettes.
7. A page can declare its own layout/appearance options through page configuration, and a module instance can declare style options from a defined, validated set; invalid values fall back to the default variant and still render. Existing module layout options (card grid/list, calendar list/month/hybrid) are expressed through the same style model without behavior change.

## UI and navigation

- **Page purpose:** Realistic demo pages (e.g. Home, About, About > Contact, About > Members, Events) showcasing modules **and** the available style options in context. No gallery/showcase route — the `/demo` route is retired (Q1).
- **Layout mockups:** None — no approved mockups exist. Visual acceptance is by human review during Manual confirmation against the accessibility and mobile design patterns cited below.
- **User-visible behaviors:** Static + updatable modules render with placeholder content; nav demonstrates sections/subsections; example form present; the site is restyled in light and dark with visible focus/hover states; layout variants are visible across the pages. Content sits at a capped reading measure by default, with pages able to opt into wider layouts (Q7).

## Data and integrations

- **Reads / external:** A public sample published Google Sheet with placeholder data for the updatable demo sections, plus committed fixtures (Q2). Tests read fixtures, never the live sheet, so the suite stays hermetic and cannot break when the sheet is edited. Theme is build-time developer configuration and is explicitly **not** sourced from Google Sheets. No webfont CDN may be required for the site to render correctly.

## Non-functional requirements

- Placeholder-only content; no real org data (§2, §15).
- Docs are concise and forkable; editor guide is short and non-technical (§9).
- Plain CSS with custom properties; no new styling dependency, preprocessor, or CSS-in-JS.
- Static build only — theme resolution must not require a server runtime and must not block initial render.
- Configuration-driven appearance over per-page hardcoding (§15); style options are a closed vocabulary, not freeform CSS, consistent with the constrained-input posture in §10.
- Accessibility per §13 — keyboard focus visibility, contrast, preserved heading hierarchy.
- Mobile layout patterns DP-ML-01..05 continue to hold; no regression in the existing test suite (139 passing at slice start).

## Dependencies

- **Other slices:** Slices 00–05 (this slice assembles and documents them).

## Acceptance criteria

1. The delivered site includes an example/demo experience that illustrates the available modules and update patterns using placeholder content only.
2. Documentation clearly covers adding a page, adding a module, configuring an updatable section, and mapping a Google Sheets data source.
3. A non-technical user can update approved sections without editing code by following the editor guide.
4. The repository is easy to fork, rename, and adapt (documented), with placeholder-only example content.
5. A developer can change colors, fonts, and spacing in one central theme configuration and the whole site updates with no component style edits; both palettes are configurable with safe fallback; and the delivered site is visually polished with accessible contrast, hover, and focus states in both palettes on desktop and mobile.
6. A page can set its layout/appearance through page configuration, and a module instance accepts typed style options from a closed set, with invalid values falling back to the default variant while the page still renders.

## Success criteria

See [closeout.md](success-criteria/closeout.md) and [traceability.md](success-criteria/traceability.md).

| Id | Title | Maps to acceptance # |
|----|-------|----------------------|
| SC-01 | Demo site shows all modules + update patterns (placeholder only) | 1 |
| SC-02 | Developer guides: page / module / updatable section / sheet mapping / rebrand | 2 |
| SC-03 | Editor guide enables no-code updates | 3 |
| SC-04 | Fork/rename/adapt documented; placeholder-only content | 4 |
| SC-05 | Central theme config drives a polished, accessible default design | 5 |
| SC-06 | Validated page- and module-level style options | 6 |

## Testing and verification

**Regression intent:**

- Demo pages render all module types with placeholder content (component / UI smoke).
- Updatable demo sections hydrate from sample sheet fixtures and fall back safely (component).
- Docs exist and cover the four developer tasks + editor guide + rebrand/style guide (docs presence check / review).
- Full-site UI smoke across demo pages (Playwright).
- Theme config emits the expected custom properties; an injected alternate theme changes them (unit).
- Malformed or partial theme config falls back to defaults without throwing; palette selection honors OS preference and explicit override (unit).
- Component styles contain no literal values for tokenized categories, and the mobile CSS invariants still hold (stylesheet assertions).
- Page-level appearance config applies to the rendered page; module style options apply and unknown values fall back to the default variant while still rendering (component).
- Existing card grid/list and calendar list/month/hybrid behavior unchanged (existing tests stay green).
- Visual evidence: before/after screenshots at both breakpoints in both palettes, reviewed during Manual confirmation.

## Open questions

| # | Question | Status |
|---|----------|--------|
| Q1 | Which demo pages/sections best showcase the module set? | Closed — **realistic pages only** (owner, 2026-08-21); retire the `/demo` gallery route so the template ships as a believable site |
| Q2 | Should the demo ship a public sample Google Sheet, or documented fixtures only? | Closed — **both** (owner, 2026-08-21); a public sample sheet for the editor-guide walkthrough, with fixtures backing the tests |
| Q3 | Plain CSS + custom properties, CSS Modules, or a utility framework? | Closed — **plain CSS + custom properties** (owner, 2026-08-21); no new dependency, keeps the static build and stylesheet tests valid |
| Q4 | Visitor-facing light/dark toggle? | Closed — **no toggle**; OS preference plus a builder-set default |
| Q5 | Theme values overridable from Google Sheets? | Closed — **no**; appearance is developer/forker config |
| Q6 | How many starter themes ship? | Closed — **one** well-designed default theme (owner, 2026-08-21) |
| Q7 | Reading measure capped (current `.app-shell__main` 48rem) or full shell width (`#root` 1126px) by default? | Closed — **capped by default, overridable per page** (owner, 2026-08-21); the cap is a layout-width token and pages opt into wider layouts via the Phase 3 width option |
