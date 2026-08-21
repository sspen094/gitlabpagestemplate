# Deviation D03 — all page modules sheet-driven, rows render dynamically

**Slice:** `04-google-sheets-updatable-content`  
**Deviation id:** `D03`  
**Date:** 2026-08-21  
**Status:** Approved  
**Discovered during:** Manual confirmation of `docs/project-files/project-plan/slices/04-google-sheets-updatable-content-tasks.md`  
**Trigger:** Reviewing `#/demo` against a live spreadsheet, the owner found that only one section read the sheet, that four text rows and two card rows rendered as one item each, and that the calendar never updated.

---

## 1. Change summary

Every content element on a demo/contact page is a worksheet-backed module, and every valid worksheet row renders. Four root causes were confirmed against the owner's spreadsheet:

| Symptom | Cause |
|---------|-------|
| Card row missing its title | The `gviz` CSV endpoint infers one type per column and returns an empty cell for values of another type. `title` held `Custom` and `2`, so the column was typed numeric and `Custom` was destroyed in transit. |
| Calendar never updated | No `demo-calendar` worksheet existed, and `gviz` answers an unknown tab name with the **first** worksheet instead of an error, so event parsing received text-block rows and dropped them all. |
| Only one text block | D02 defined Text Block as the first valid row. |
| Contacts never updated | `contact-info` had a schema and parser but no renderer, page instance, or mapping. |

## 2. Requirements delta

### Modified

- **Text Block:** every valid `text` row renders as its own paragraph (supersedes D02's "first valid row"). Subject to the mapping `limit`.
- **Card List:** `title` is required **only when** `description` is empty, so a described row still renders. `subtitle`, `link`, `imageUrl`, and `sortOrder` are rendered/applied rather than parsed and discarded.
- **Event/Calendar:** `date` accepts the formats a Google Sheets date column exports (`YYYY-MM-DD`, `M/D/YYYY`, `Sep 1, 2026`) and normalizes to ISO. `time`, `location`, and `link` are rendered.
- **Worksheet addressing:** worksheets are read from the spreadsheet CSV **export** endpoint by `gid` instead of `gviz` by tab name. Tab names remain the mapping/module identity; gids are supplied per site through `VITE_GOOGLE_SHEETS_GIDS`. A mapping without a gid keeps its static shell.

### Added

- **Contact/Info rendering:** a `contact` module type renders label/value pairs, linking `email`, `phone`, and `url` types. Instance lives on `/about/contact`, bound to the `contact-info` worksheet.

### Removed

- Demo page duplicate/static content: the static intro text, image block, grouped card list, and the two static calendars. The page now carries one sheet-backed example per updatable type, which also removes the duplicate `demo-cards` / `demo-calendar` module ids that existed in both sections.

## 3. Main doc callouts

| Main doc section | Callout text |
|------------------|--------------|
| Functional requirements §4 | Text Block renders one paragraph per row; Card List needs a title **or** a description. |
| Functional requirements §2 | The mapping addresses a worksheet by `gid`; the tab name stays the module identity. |
| UI and navigation | Demo page shows one sheet-backed example per updatable type; Contact/Info renders on `/about/contact`. |

## 4. Project plan impact

| Impact | Detail |
|--------|--------|
| **Modified tasks** | Feed URL resolution, mapping model + env config, text/card/event schemas, `to-config` bridge, Text/Card/Calendar components, page config, README intake docs, `.env.example`. |
| **New tasks** | Contact/Info renderer (was the optional Phase 2 item) and its page wiring. |
| **Cross-slice** | Slice 02/03 tests that asserted against static demo-page content now build their own fixture pages (`baseline-modules`, `page-composer`, `mobile-quality-gate`). Behavior under test is unchanged. |
| **Final phase** | Re-confirm SC-01 (all four types), SC-02 (gid mapping), SC-05 (limits across the larger row counts). |

## 5. Success criteria (delta)

| Id | Action | Detail |
|----|--------|--------|
| SC-01 | Modify | Text, card, event **and** contact sections are sheet-driven, with row counts following the worksheet. |
| SC-02 | Modify | Mapping is page → module/worksheet name + `gid` → data type. |

## 6. Regression intent (delta)

- One paragraph per text row; blank rows dropped.
- A card row with only a description renders; a row with neither title nor description is dropped.
- Cards honour `sortOrder` before the limit is applied.
- Sheet-exported date formats normalize to ISO; unreadable dates drop the row.
- Contact rows render as linked `mailto:` / `tel:` / web values.
- A Google worksheet without a configured gid keeps its static shell.

## 7. Approval

| Role | Name | Date |
|------|------|------|
| Owner | sam.spencer | 2026-08-21 |

Approved by the owner's direct answers in chat: every row added dynamically, cards valid without a title, one example element per data type, contacts on the Contact page, gid-addressed export endpoint, flexible date parsing.
