# Deviation D01 — mobile nav and layout quality gate

**Slice:** `03-navigation`  
**Deviation id:** `D01`  
**Date:** 2026-08-21  
**Status:** Approved  
**Discovered during:** Phase 2 of `docs/project-files/project-plan/slices/03-navigation-tasks.md`  
**Trigger:** Human requested a mobile-friendly site starting with a classic hamburger + side menu, plus a quality gate so page modules wrap instead of overflowing on small viewports.

Mid-slice scope change during **build** — not post-test QA bugs.

---

## 1. Change summary

Narrow viewports use a hamburger control that opens a side drawer of the same data-driven nav. Desktop hover dropdowns remain. A project-wide mobile layout quality gate (CSS + unit test + DP checklist) covers wrapping, media max-width, and tables that would otherwise overflow.

## 2. Requirements delta

### Added / Modified / Removed

- **Added:** Mobile hamburger + side drawer (answers Q1).
- **Added:** Mobile layout quality gate for chrome and content modules (wrapping, overflow).
- **Unchanged:** Data-driven nav config, active state, desktop keyboard dropdowns.

## 3. Main doc callouts

| Main doc section | Callout text |
|------------------|--------------|
| UI and navigation | On small viewports, navbar collapses to a hamburger that opens a side menu. |
| Non-functional | Layout must wrap/scroll within the viewport; no horizontal overflow from modules. |
| Open questions | Q1 closed — hamburger drawer (not accordion-only). |

## 4. Project plan impact

| Impact | Detail |
|--------|--------|
| **New tasks** | Phase 2 — hamburger + drawer; mobile layout quality gate |
| **Modified tasks** | Phase 2 keyboard still applies to desktop dropdowns; drawer has Escape/focus |
| **Final phase** | SC-05 and SC-06 plus DP mobile-layout checklist |

## 5. Success criteria (delta)

| Id | Action | Detail |
|----|--------|--------|
| SC-05 | Add | Hamburger + side drawer on mobile viewport |
| SC-06 | Add | Mobile layout quality gate (wrap/overflow) for chrome + modules |

## 6. Regression intent (delta)

- Mobile matchMedia: hamburger visible; drawer lists top-level + subsections.
- Desktop: hamburger absent; inline navbar unchanged.
- CSS contract: wrapping-safe grids, images `max-width: 100%`, calendar table in a horizontal scroll wrapper.

## 7. Approval

| Role | Name | Date |
|------|------|------|
| Owner | sam.spencer (chat request) | 2026-08-21 |
