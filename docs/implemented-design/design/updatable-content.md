# Implemented design — updatable content

Cross-cutting notes for Google Sheets hydration. Feature as-built: [`docs/modules/updatable-content/features/sheets-hydration/README.md`](../../modules/updatable-content/features/sheets-hydration/README.md).

## Rules

- `mode: 'updatable'` instances go through `UpdatableModule` after validation. First paint is always the static shell.
- One public spreadsheet URL plus per-tab `gid` values live in env. Committed mappings name the parent module / worksheet and type; they do not embed a spreadsheet id.
- Worksheets are requested via the CSV **export** endpoint. `gviz` is not used.
- External values are constrained to per-type allow-lists and sanitized (no raw HTML; unsafe URL schemes dropped).
- Fetch or parse failure never throws into the page; `FallbackModule` shows `t()` copy.

## Not this slice

- Site-side storage of form submissions (Slice 05).
- Sheets-backed navigation.
