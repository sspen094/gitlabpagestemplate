# Design patterns (verification criteria)

Project-wide **checklist criteria**. These are **not** executable tests.

## Role

When a slice has no `success-criteria/` files, or as a **baseline merged with slice criteria**, load every `*.md` file here (except this README).

## Adding patterns

Add one markdown file per concern, for example:

| File | Topic |
|------|--------|
| `ui-controls.md` | Title Case, page layout, filter order |
| `layering.md` | UI → service → repository; no SQL in UI |
| `api.md` | HTTP API conventions (when applicable) |
| `mobile-layout.md` | Viewport wrap/overflow quality gate (DP-ML-xx) |

Use checklist items that can be marked PASS/FAIL:

```markdown
## DP-01 Page filters above content
- [ ] Filters and selectors appear above the table or content they affect
- verify: `docs/implemented-design/design/ui-controls.md`
```

## Related

- Slice criteria: `docs/requirements/slices/<slice-id>/success-criteria/`
- Reports: `docs/project-files/verification-reports/`
