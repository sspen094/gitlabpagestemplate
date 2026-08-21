# Testing

| Doc | Purpose |
|-----|---------|
| [`tests/SCAFFOLD.md`](../../tests/SCAFFOLD.md) | Layer status (Planned vs Populated) |
| [`tests/README.md`](../../tests/README.md) | How to run tests |
| [`docs/project-files/regression/regression-plan.md`](../project-files/regression/regression-plan.md) | Inventory + slice mapping |
| Slice SC-xx | `docs/requirements/slices/<id>/success-criteria/` |

**Layer 1 (Slice 06):** `tests/unit/demo-site.test.ts`, `site-theme.test.tsx`, `module-style.test.tsx` (plus prior form, Sheets, navbar, composer, `t()` tests). `tests/end_to_end/smoke/` stays Planned (no Playwright package).

```powershell
npm test
npm run build
```
