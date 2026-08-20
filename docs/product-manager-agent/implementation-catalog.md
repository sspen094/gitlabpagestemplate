# Ex-React — implementation catalog

Living index of **what the product has built**. `agent-product-manager` reads this **first** every session to avoid re-specifying shipped behavior.

**Maintainers:** Cursor updates after implementation lands; humans review on slice closeout.

---

## Next slice id

| Field | Value |
|-------|-------|
| **Next slice id** | `02` |
| **Last updated** | 2026-08-20 (Slice 01 shipped) |

---

## Slice registry

| Slice | Status | Module(s) | Feature(s) | Summary |
|-------|--------|-----------|------------|---------|
| 00-app-scaffold-and-deploy | Shipped 2026-08-20 | platform | app-scaffold | Vite + React TS SPA, `BASE_URL` Pages base, GitHub Actions deploy, placeholder shell |
| 01-text-management | Shipped 2026-08-20 | text | t-lookup | Central `defaultText` + `t()` / `useText()`; missing-key fallback; `TextProvider` for alternate sets |
| 01-text-management | Shipped 2026-08-20 | text | t-lookup | Central `defaultText` tree, `t()` / `useText()`, missing-key fallback, `TextProvider` swap |

---

## Platform (cross-cutting)

| Area | Status | Notes |
|------|--------|-------|
| Hosting | Shipped | GitHub Pages via Actions; Vite `base` from `BASE_URL` |
| Navigation | Planned | Top navbar with sections and dropdowns |
| Page modules | Planned | Hero, text, image, cards, section wrapper |
| Text lookup | Shipped | `t()` with `[page].[section].[item]` keys; edit `text-config.ts` |
| Updatable content | Planned | Google Sheets published data; fail gracefully |
| HTTP API | N/A | No custom backend |
| App database | N/A | No owned database |

---

## Features by module

### platform

| Feature id | Routes / entry | Database | Status |
|------------|----------------|----------|--------|
| app-scaffold | `/` (`src/App.tsx`) | none | Shipped — [as-built](../modules/platform/features/app-scaffold/README.md) |

### text

| Feature id | Routes / entry | Database | Status |
|------------|----------------|----------|--------|
| t-lookup | Shell via `useText()` (`src/App.tsx`); config `text-config.ts` | none | Shipped — [as-built](../modules/text/features/t-lookup/README.md) |

### foundations

| Feature id | Routes / entry | Database | Status |
|------------|----------------|----------|--------|
| _reserved_ | — | none | Planned — later slices |

---

## Integrations

| System | Read / write | Status |
|--------|--------------|--------|
| Google Sheets (published) | read-only | Planned |

---

## Verification assets

| Path | Purpose |
|------|---------|
| `docs/project-files/regression/regression-plan.md` | Executable test inventory |
| `tests/SCAFFOLD.md` | Test layer status |
| `docs/project-files/verification/design-patterns/` | DP-xx patterns |

---

## How to update (Cursor, on slice closeout)

1. Add slice row with **Shipped** date when final phase completes.
2. Increment **Next slice id**.
3. Add feature rows with routes and links to `docs/modules/…` as-built.
4. Note new DP-xx or regression scripts in regression-plan.

`agent-product-manager`: **read only** unless human directs catalog edits.
