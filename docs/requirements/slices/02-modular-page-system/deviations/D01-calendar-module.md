# Deviation D01 — calendar-module

**Slice:** `02-modular-page-system`  
**Deviation id:** `D01`  
**Date:** 2026-08-20  
**Status:** Approved  
**Discovered during:** Phase 1 close of `docs/project-files/project-plan/slices/02-modular-page-system-tasks.md`  
**Trigger:** Human approved Phase 1 and asked to add a calendar component to Phase 2 in the same slice.

Mid-slice scope change during **build** — not post-test QA bugs (those use defects workflow).

---

## 1. Change summary

Slice 02 originally treated calendar/events as an optional future module (out of scope, with FAQ, CTA, timeline, gallery, and embed). A **calendar module** is now in-scope for Phase 2 alongside the baseline set. It must register like other module types, render from config through the shared pipeline, and ship with example content. Google Sheets hydration of calendar events remains Slice 04.

## 2. Requirements delta

### Added / Modified / Removed

- **Added:** Calendar / events module as a Phase 2 deliverable (config-driven instance, example events, accessible structure).
- **Modified:** Slice 02 “out of scope” optional-future list no longer includes calendar for this slice; other optional types stay out.
- **Removed:** None.

## 3. Main doc callouts

| Main doc section | Callout text |
|------------------|--------------|
| Scope / In scope | Add calendar/events to the Phase 2 module list. |
| Scope / Out of scope | Calendar is no longer deferred with FAQ/CTA/timeline/gallery/embed. |
| Acceptance criteria | New AC: calendar module renders from configuration with example content. |
| Product §7.1 | Calendar/events block promoted from optional-future into this slice. |

## 4. Project plan impact

| Impact | Detail |
|--------|--------|
| **New tasks** | Phase 2 — Calendar / events module (config-driven entries, example content) |
| **Modified tasks** | Final Create tests — include calendar component test |
| **Final phase** | Re-confirm tests + SC-01..SC-05 |

Cursor re-syncs `*-tasks.md` referencing this deviation id.

## 5. Success criteria (delta)

| Id | Action | Detail |
|----|--------|--------|
| SC-05 | Add | Calendar module renders from config with example events |

## 6. Regression intent (delta)

- Calendar module instance in page config renders expected headings/events (component test).
- Unknown or incomplete calendar config uses the shared fallback path (covered by definition-model tests + module-specific required fields).

## 7. Approval

| Role | Name | Date |
|------|------|------|
| Owner | sam.spencer (chat) | 2026-08-20 |

**Status:** Approved — human directed Phase 1 close and the Phase 2 calendar checkbox in chat.
