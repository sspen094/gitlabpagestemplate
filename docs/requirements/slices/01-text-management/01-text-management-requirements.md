# Slice 01 — text-management (requirements)

**Status:** Draft  
**Owner:** Template maintainer  
**Last updated:** 2026-08-20  
**Slice id:** 01  
**Module(s):** text  
**Primary feature name (code):** t-lookup  
**Feature folders touched:** `src/` (text config + `t()` helper + hook)  
**Target database (intent):** N/A — static site  
**Runtime database (if different):** N/A

Traces to product [`requirements.md`](../../requirements.md) §7.4, §12.

---

## Objective

Provide a centralized developer-authored text system so all static copy is referenced through a `t()` lookup using `[page].[section].[item]` keys, keeping text editable in one place and ready for future localization.

## Scope

### In scope

- A `t(key)` lookup function/hook resolving keys against a central text store.
- Key format `[page].[section].[item]` with at least `[page].[section]` grouping enforced/encouraged.
- Central, easy-to-edit text configuration (single tree/module).
- Safe fallback when a key is missing (no crash; visible fallback).
- Structure that allows an alternate text set / locale to be swapped later.

### Out of scope

- Full localization UI or runtime locale switching (structure-ready only).
- Externally updatable text from Google Sheets (Slice 04).

## Users and workflows

Developer stores all static copy in the central text config and references it in components via `t('home.hero.title')`. Editing site copy means editing one config location, not many components.

## Functional requirements

1. `t(key)` returns the configured string for a valid key.
2. Keys follow `[page].[section].[item]`; the design enforces at least `[page].[section]` grouping.
3. A missing/unknown key falls back safely (e.g. returns the key or a default) without throwing.
4. Text config is centralized and easy to edit.
5. The structure supports future localization / alternate text sets.

## UI and navigation

- **Page purpose:** No new page; wires text into the existing app shell.
- **User-visible behaviors:** Copy on the shell/landing renders via `t()`.

## Data and integrations

- **Reads / external:** None — text is bundled at build time.

## Non-functional requirements

- Central config; no scattered inline strings for developer-authored copy.
- Lookup is synchronous and build-time safe.

## Dependencies

- **Other slices:** Slice 00 (app scaffold).

## Acceptance criteria

1. Static text is referenced through `t()` keys in the `[page].[section].[item]` pattern.
2. Text configuration is centralized and edited in a single location.
3. A missing or malformed key does not crash rendering (safe fallback).
4. The text structure supports future localization / alternate text sets.

## Success criteria

See [closeout.md](success-criteria/closeout.md) and [traceability.md](success-criteria/traceability.md).

| Id | Title | Maps to acceptance # |
|----|-------|----------------------|
| SC-01 | `t()` resolves `[page].[section].[item]` keys | 1 |
| SC-02 | Centralized, single-location text config | 2 |
| SC-03 | Missing key falls back safely | 3 |
| SC-04 | Localization-ready structure | 4 |

## Testing and verification

**Regression intent:**

- `t()` returns correct value for known keys (unit).
- `t()` on unknown key returns fallback and does not throw (unit).
- Key format helper validates/normalizes `[page].[section].[item]` (unit).

## Open questions

| # | Question | Status |
|---|----------|--------|
| Q1 | Should unknown keys render the raw key or a configurable placeholder? | Open |
