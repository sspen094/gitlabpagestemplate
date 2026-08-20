# MFGCIDashboard — UI spec for Cursor (React + Mantine)

**Status:** Draft  
**Stack:** React 19 + Mantine 9 + TypeScript + Vite — org standard full-stack

**No NiceGUI.** All user-facing UI is this SPA.

---

## Shell

- **Layout:** Mantine `AppShell` — navbar + main (`frontend/src/app/`)
- **Routing:** React Router v6+
- **Data fetching:** TanStack Query — shared client in `frontend/src/shared/api/`
- **Forms:** React Hook Form + Zod resolvers
- **Tables:** TanStack Table
- **Charts:** ECharts (`echarts-for-react`)
- **Theme:** Mantine theme tokens — light/dark per product decision

## Navigation

| Section | Route | API |
|---------|-------|-----|
| Foundations | `/` | `GET /api/foundations/home` or `/api/health` stub |

Align menu keys with `deployments/env/nav-visibility.txt`.

## API client

- Base path: `/api` (proxied in dev via Vite)
- No direct SQL, LDAP, or OpenAI calls from components

## Dev workflow

- `npm run dev` — Vite HMR; proxy `/api` → `api_main` port
- `npm run build` — output consumed by FastAPI static mount / IIS deploy
- `npm run test` — Vitest; `npm run lint` — ESLint

## Labels

- Page titles: Title Case
- See `docs/implemented-design/design/ui-controls.md` after implementation

## Verification

- Playwright smoke tests for shell + one feature route (`tests/end_to_end/smoke/`)
