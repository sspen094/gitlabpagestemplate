# Testing

| Doc | Purpose |
|-----|---------|
| [`tests/SCAFFOLD.md`](../../tests/SCAFFOLD.md) | Layer status (Planned vs Populated) |
| [`tests/README.md`](../../tests/README.md) | How to run tests |
| [`docs/project-files/regression/regression-plan.md`](../project-files/regression/regression-plan.md) | Inventory + slice mapping |
| Slice SC-xx | `docs/requirements/slices/<id>/success-criteria/` |

**Layer 1 (Slice 03):** `tests/unit/navbar.test.tsx`, `mobile-quality-gate.test.tsx` (plus prior composer/modules/`t()` tests). `tests/end_to_end/smoke/` stays Planned (no Playwright package).

```powershell
npm test
npm run build
```
