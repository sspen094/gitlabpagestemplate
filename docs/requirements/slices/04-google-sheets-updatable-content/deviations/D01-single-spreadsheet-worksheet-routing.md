# Deviation D01 — single-spreadsheet worksheet routing

**Slice:** `04-google-sheets-updatable-content`  
**Deviation id:** `D01`  
**Date:** 2026-08-21  
**Status:** Approved  
**Discovered during:** Phase 2 human verification of `docs/project-files/project-plan/slices/04-google-sheets-updatable-content-tasks.md`  
**Trigger:** The owner requested a simpler editor intake: configure one Google Spreadsheet link for the site, then route each worksheet tab to one parent website element by name. All rows on that worksheet use the target element's data type.

---

## 1. Change summary

Replace one feed URL per mapping with one site-wide public Google Spreadsheet URL. Each updatable parent module is matched to a worksheet tab with the same configured name (for example, worksheet `demo-calendar` supplies event rows to the `demo-calendar` module).

## 2. Requirements delta

### Added

- Configure exactly one public, read-only Google Spreadsheet URL for Sheets hydration.
- Give each worksheet tab the name of its target updatable parent module.
- Interpret every data row on a worksheet according to that module's configured schema.
- Derive a stable CSV worksheet feed from the spreadsheet link and worksheet name.

### Modified

- The explicit mapping becomes page → parent module/worksheet name → data type and limit.
- Spreadsheet identity is configured once, not repeated for every mapping.

### Removed

- Per-mapping `VITE_SHEETS_URL_<ID>` environment variables.
- Requiring editors to publish and copy a separate feed URL for each worksheet.

## 3. Main doc callouts

| Main doc section | Callout text |
|------------------|--------------|
| Scope | One spreadsheet contains the approved updatable worksheets; worksheet names route rows to parent modules. |
| Functional requirements | Each worksheet name matches its target module mapping; all rows are parsed using that module's data type. |
| Data and integrations | One public Google Spreadsheet link is converted to stable per-worksheet CSV requests. |
| Open questions Q1 | Resolved: one spreadsheet for all sections. |

## 4. Project plan impact

| Impact | Detail |
|--------|--------|
| **New tasks** | Phase 2 rework — add spreadsheet URL normalization and worksheet routing tests. |
| **Modified tasks** | Replace per-mapping URL overrides with one `VITE_GOOGLE_SHEETS_URL`; align demo worksheet and module names. |
| **Final phase** | Re-confirm SC-01, SC-02, SC-03, and all regression tests against the unified intake contract. |

Cursor re-syncs `*-tasks.md` referencing this deviation id.

## 5. Success criteria (delta)

| Id | Action | Detail |
|----|--------|--------|
| SC-01 | Modify | Text, cards, and events hydrate from separate worksheets in one configured spreadsheet. |
| SC-02 | Modify | Explicit mappings pair each parent module with its same-named worksheet and schema. |
| SC-03 | Modify | Invalid spreadsheet links or missing worksheets preserve safe fallback behavior. |

## 6. Regression intent (delta)

- One spreadsheet URL is reused for all mapped modules.
- Each mapping requests its own encoded worksheet name.
- A normal Google Sheets share URL is converted to a stable CSV worksheet URL.
- Non-Google/public feed URLs remain safe and never throw.

## 7. Approval

| Role | Name | Date |
|------|------|------|
| Owner | sam.spencer | 2026-08-21 |

Approved by the owner's direct change request in chat.
