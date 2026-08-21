# Tests

```powershell
npm test
npm run build
```

| Path | Contents |
|------|----------|
| `tests/unit/` | Vitest — base path, static build smoke, app-shell, `t()` lookup, page composer, baseline modules, navbar, mobile quality gate, Sheets hydration, submit adapters, Contact form |
| `tests/end_to_end/` | Playwright (not populated; no `@playwright/test` dependency) |

See [`SCAFFOLD.md`](SCAFFOLD.md) and [`docs/testing/README.md`](../docs/testing/README.md).
