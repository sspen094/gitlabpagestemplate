# Testing

| Doc | Purpose |
|-----|---------|
| [`tests/SCAFFOLD.md`](../../tests/SCAFFOLD.md) | Layer status (Planned vs Populated) |
| [`tests/README.md`](../../tests/README.md) | How to run tests |
| [`docs/project-files/regression/regression-plan.md`](../project-files/regression/regression-plan.md) | Inventory + slice mapping |
| Slice SC-xx | `docs/requirements/slices/<id>/success-criteria/` |

**Layer 1 (Slice 02):** `tests/unit/page-composer.test.tsx`, `module-definition.test.ts`, `baseline-modules.test.tsx` (composer, definition model, baseline modules + calendar a11y). `tests/end_to_end/smoke/` stays Planned (no Playwright package).

```powershell
npm test
npm run build
```
