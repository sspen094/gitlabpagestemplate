# Slice 06 — demo-site-and-docs (requirements)

**Status:** Draft  
**Owner:** Template maintainer  
**Last updated:** 2026-08-20  
**Slice id:** 06  
**Module(s):** demo-site, docs  
**Primary feature name (code):** demo-and-guides  
**Feature folders touched:** `src/` (demo pages/content config), `docs/` (editor + developer guides)  
**Target database (intent):** N/A — static site  
**Runtime database (if different):** N/A

Traces to product [`requirements.md`](../../requirements.md) §2, §5.2, §9, §14, §16.

---

## Objective

Assemble a coherent example/demo site using placeholder content that demonstrates all shipped modules and update patterns, and author the guides that make the template easy to fork: an editor guide (Google Sheets updates) and developer guides (add a page, add a module, configure an updatable section, map a Sheets source).

## Scope

### In scope

- Demo pages composed from the module system (static + updatable) with **placeholder content only**.
- A demonstration of each baseline module and at least one updatable text block, card list, and event/calendar section.
- Example navigation structure (top-level + section + dropdown subsections).
- Editor guide: how a non-technical user updates approved sections via Google Sheets (no code).
- Developer guides: adding a page, adding a module, configuring an updatable section, mapping a Google Sheets source.
- Fork/rename/adapt guidance for turning the template into a real site.
- Example sheet structure documentation (sample/placeholder data only).

### Out of scope

- Real organization-specific content.
- New module types or new integrations beyond what Slices 02–05 shipped.

## Users and workflows

- **Visitor:** browses the demo to understand the feature set.
- **Editor:** follows the editor guide to update an approved section via a sample sheet.
- **Developer:** follows developer guides to fork the template, add a page/module, and wire an updatable section.

## Functional requirements

1. The delivered site includes an example/demo experience illustrating available modules and update patterns using **placeholder content only**.
2. Documentation covers: adding a page, adding a module, configuring an updatable section, and mapping a Google Sheets data source.
3. An editor guide lets a non-technical user update approved sections without editing code.
4. The repository is structured and documented so it is easy to fork, rename, and adapt into a real website.
5. Example sheets/structures use sample or placeholder data only.

## UI and navigation

- **Page purpose:** Demo pages (e.g. Home, About, About > Contact, About > Members, Events) showcasing modules.
- **User-visible behaviors:** Static + updatable modules render with placeholder content; nav demonstrates sections/subsections; example form present.

## Data and integrations

- **Reads / external:** Sample published sheet(s) with placeholder data for the updatable demo sections.

## Non-functional requirements

- Placeholder-only content; no real org data (§2, §15).
- Docs are concise and forkable; editor guide is short and non-technical (§9).

## Dependencies

- **Other slices:** Slices 00–05 (this slice assembles and documents them).

## Acceptance criteria

1. The delivered site includes an example/demo experience that illustrates the available modules and update patterns using placeholder content only.
2. Documentation clearly covers adding a page, adding a module, configuring an updatable section, and mapping a Google Sheets data source.
3. A non-technical user can update approved sections without editing code by following the editor guide.
4. The repository is easy to fork, rename, and adapt (documented), with placeholder-only example content.

## Success criteria

See [closeout.md](success-criteria/closeout.md) and [traceability.md](success-criteria/traceability.md).

| Id | Title | Maps to acceptance # |
|----|-------|----------------------|
| SC-01 | Demo site shows all modules + update patterns (placeholder only) | 1 |
| SC-02 | Developer guides: page / module / updatable section / sheet mapping | 2 |
| SC-03 | Editor guide enables no-code updates | 3 |
| SC-04 | Fork/rename/adapt documented; placeholder-only content | 4 |

## Testing and verification

**Regression intent:**

- Demo pages render all module types with placeholder content (component / UI smoke).
- Updatable demo sections hydrate from sample sheet fixtures and fall back safely (component).
- Docs exist and cover the four developer tasks + editor guide (docs presence check / review).
- Full-site UI smoke across demo pages (Playwright).

## Open questions

| # | Question | Status |
|---|----------|--------|
| Q1 | Which demo pages/sections best showcase the module set? | Open |
| Q2 | Should the demo ship a public sample Google Sheet, or documented fixtures only? | Open |
