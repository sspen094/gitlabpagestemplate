# Testing

| Doc | Purpose |
|-----|---------|
| [`tests/SCAFFOLD.md`](../../tests/SCAFFOLD.md) | Layer status (Planned vs Populated) |
| [`tests/README.md`](../../tests/README.md) | How to run tests |
| [`docs/project-files/regression/regression-plan.md`](../project-files/regression/regression-plan.md) | Inventory + slice mapping |
| Slice SC-xx | `docs/requirements/slices/<id>/success-criteria/` |

**Layer 1 (Slice 01):** `tests/unit/t-lookup.test.tsx` covers known keys, missing-key fallback, and alternate text sets.

```powershell
npm test
npm run build
```
