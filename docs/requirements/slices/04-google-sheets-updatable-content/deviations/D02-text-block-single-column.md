# Deviation D02 — text-block single column

**Slice:** `04-google-sheets-updatable-content`  
**Deviation id:** `D02`  
**Date:** 2026-08-21  
**Status:** Approved  
**Discovered during:** Manual confirmation of `docs/project-files/project-plan/slices/04-google-sheets-updatable-content-tasks.md`  
**Trigger:** The owner asked to simplify text-block intake to one column named `text`. Card, event, and contact formats stay unchanged.

---

## 1. Change summary

A Text Block worksheet has a header `text` and one used data row. That cell is the module body. Title stays on the page from static config. Card List, Event/Calendar, and Contact/Info columns are unchanged.

## 2. Requirements delta

### Modified

- **Text Block:** required column `text` only (multiline). Drop `title`, `body`, and `lastUpdated` from the sheet schema.

## 3. Main doc callouts

| Main doc section | Callout text |
|------------------|--------------|
| Functional requirements §4 | Text Block is a single `text` column. |

## 4. Project plan impact

| Impact | Detail |
|--------|--------|
| **Modified tasks** | Schema, parser, README intake table, and text hydration tests. |
| **Final phase** | Re-confirm SC-02 against the one-column text schema. |

## 5. Success criteria (delta)

| Id | Action | Detail |
|----|--------|--------|
| SC-02 | Modify | Text Block schema is the `text` column. |

## 6. Regression intent (delta)

- Rows missing `text` are dropped.
- First valid `text` row hydrates the text module body.

## 7. Approval

| Role | Name | Date |
|------|------|------|
| Owner | sam.spencer | 2026-08-21 |

Approved by the owner's direct change request in chat.
