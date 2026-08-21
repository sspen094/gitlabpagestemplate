# Slice 03 — navigation (requirements)

**Status:** Draft  
**Owner:** Template maintainer  
**Last updated:** 2026-08-20  
**Slice id:** 03  
**Module(s):** navigation  
**Primary feature name (code):** navbar  
**Feature folders touched:** `src/` (nav config, navbar + dropdown components, active-state)  
**Target database (intent):** N/A — static site  
**Runtime database (if different):** N/A

Traces to product [`requirements.md`](../../requirements.md) §7.3, §13.

---

## Objective

Provide a data-driven top navigation bar supporting top-level pages, section groupings, and dropdown subsections, with a clearly indicated active page/section and full keyboard accessibility.

## Scope

### In scope

- Top navigation bar rendered from a data-driven nav configuration.
- Support for top-level pages, section groupings, and dropdown subsections (e.g. `About`, `About > Contact`, `About > Members`).
- Visible active/current page/section indication.
- Keyboard-accessible navbar and dropdowns (focus, arrow/enter/escape, ARIA).

### Out of scope

- Page content/modules themselves (Slice 02).
- Externally driven nav from Google Sheets (nav is developer config).

## Users and workflows

A developer adds a nav item or subsection by editing the nav configuration. A visitor navigates via the navbar, opens dropdown subsections, and can always tell which page/section is active — using mouse or keyboard.

## Functional requirements

1. A top navigation bar renders from a data-driven config.
2. The navbar supports top-level pages, section groupings, and dropdown subsections.
3. Adding a navbar item + subsection is a data-driven config change (minimal code).
4. The current page/section is visually identifiable.
5. The navbar and dropdowns are fully keyboard accessible (focusable, operable, escape closes, ARIA roles/states).

## UI and navigation

- **Nav section:** Global navbar for the whole site.
- **Page purpose:** Chrome, not a page — wraps the page composer from Slice 02.
- **User-visible behaviors:** Hover/focus dropdowns, active highlight, keyboard operation.
- **Example structure:** `About`, `About > Contact`, `About > Members`.

## Data and integrations

- **Reads / external:** None — nav is developer-authored config.

## Non-functional requirements

- Data-driven config over hardcoded markup.
- Meets standard web accessibility expectations for menus.
- Labels use `t()` where practical.

## Dependencies

- **Other slices:** Slice 00 (scaffold), Slice 02 (pages/routes to link to). Slice 01 for labels.

## Acceptance criteria

1. The navbar supports top-level pages, section groupings, and dropdown subsections (e.g. `About > Contact`, `About > Members`).
2. A developer can add a navbar item and subsection via data-driven configuration.
3. The active page/section is visually indicated.
4. The navbar and dropdowns are keyboard accessible.

## Success criteria

See [closeout.md](success-criteria/closeout.md) and [traceability.md](success-criteria/traceability.md).

| Id | Title | Maps to acceptance # |
|----|-------|----------------------|
| SC-01 | Navbar renders top-level + sections + dropdown subsections | 1 |
| SC-02 | Nav items/subsections are data-driven | 2 |
| SC-03 | Active page/section indicated | 3 |
| SC-04 | Keyboard-accessible navbar + dropdowns | 4 |

## Testing and verification

**Regression intent:**

- Navbar renders the configured structure incl. a dropdown subsection (component).
- Adding a config entry surfaces a new nav item (component/unit).
- Active-state reflects current route (component).
- Keyboard operation + ARIA smoke (Playwright / axe).

## Open questions

| # | Question | Status |
|---|----------|--------|
| Q1 | Mobile nav pattern — hamburger drawer or collapsed accordion? | Closed — hamburger + side drawer ([D01](deviations/D01-mobile-nav-and-layout.md)) |
