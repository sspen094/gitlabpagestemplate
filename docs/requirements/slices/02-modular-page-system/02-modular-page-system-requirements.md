# Slice 02 — modular-page-system (requirements)

**Status:** Draft  
**Owner:** Template maintainer  
**Last updated:** 2026-08-20  
**Slice id:** 02  
**Module(s):** pages, modules  
**Primary feature name (code):** modular-pages  
**Feature folders touched:** `src/` (page composition, module registry, baseline modules)  
**Target database (intent):** N/A — static site  
**Runtime database (if different):** N/A

Traces to product [`requirements.md`](../../requirements.md) §7.1, §8.1, §13, §15.

---

## Objective

Deliver a configuration-driven page system where each page is composed from reusable, configurable content modules, plus a baseline set of module types rendered with example content. This is the rendering foundation both static and (later) updatable modules share.

## Scope

### In scope

- Config-driven page composition: a page is a list of module instances with config.
- Adding a new page requires minimal code (register page config + route).
- Baseline module types: header/hero, text block, image block, card list / card grid, section wrapper.
- Module definition model: type, static/updatable mode, layout/config options, data source reference, validation expectations, fallback behavior.
- Consistent rendering pipeline all modules flow through (shared by static + future updatable).
- Accessibility: readable heading hierarchy, image alt text.

### Out of scope

- Google Sheets data hydration of updatable modules (Slice 04 — but the definition model reserves `updatable` mode + data source ref here).
- Navbar/navigation chrome (Slice 03).
- Optional future modules (FAQ, CTA, timeline, calendar, gallery, embed) beyond the baseline set.

## Users and workflows

A developer defines a page by listing configured module instances (via config, not bespoke JSX per page). Each module reads its config and renders. New pages and new module instances are added with minimal, predictable changes.

## Functional requirements

1. Pages are defined by configuration (ordered list of module instances) and added with minimal code changes.
2. The baseline modules render from config: header/hero, text block, image block, card list/grid, section wrapper.
3. Modules are configurable via props/layout options, not hardcoded for a single page.
4. A module definition model captures type, static/updatable mode, layout config, data source reference, validation expectations, and fallback behavior.
5. Static and (future) updatable modules share one consistent rendering system.
6. Rendered output preserves heading hierarchy and supports image alt text.

## UI and navigation

- **Page purpose:** Demonstrate reusable modules on one or more example pages with placeholder content.
- **User-visible behaviors:** Each baseline module renders with example content; section wrapper groups modules.
- **Layout mockups:** N/A — pattern-driven; use standard, accessible layout.

## Data and integrations

- **Reads / external:** Static/config-provided content this slice (external hydration deferred to Slice 04).

## Non-functional requirements

- Configuration-driven composition over page-specific hardcoding (§15).
- Modules extensible: new module types can be added later without redesign.
- Text uses `t()` from Slice 01 for developer-authored copy.

## Dependencies

- **Other slices:** Slice 00 (scaffold), Slice 01 (`t()` text).

## Acceptance criteria

1. A developer can add a new page composed from reusable modules with minimal code changes.
2. Each baseline module type (header/hero, text, image, card list/grid, section wrapper) renders from configuration with example content.
3. Modules share a consistent rendering system and follow the module definition model (incl. static/updatable mode + data source ref + fallback).
4. Rendered pages preserve heading hierarchy and provide image alt text.

## Success criteria

See [closeout.md](success-criteria/closeout.md) and [traceability.md](success-criteria/traceability.md).

| Id | Title | Maps to acceptance # |
|----|-------|----------------------|
| SC-01 | Add a page from config with minimal code | 1 |
| SC-02 | Baseline modules render from config | 2 |
| SC-03 | Consistent rendering + module definition model | 3 |
| SC-04 | Accessible headings + image alt | 4 |

## Testing and verification

**Regression intent:**

- Page composer renders a config-defined page with the expected module instances (component).
- Each baseline module renders its config props (component/unit).
- Module definition model validates required fields and applies fallback (unit).
- Accessibility smoke: headings/alt present (component or Playwright).

## Open questions

| # | Question | Status |
|---|----------|--------|
| Q1 | Should page config live in code modules or a data file (JSON/TS)? | Open |
| Q2 | Card grid: fixed columns or responsive auto-fit default? | Open |
