# Ex-React — implementation catalog

Living index of **what the product has built**. `agent-product-manager` reads this **first** every session to avoid re-specifying shipped behavior.

**Maintainers:** Cursor updates after implementation lands; humans review on slice closeout.

---

## Next slice id

| Field | Value |
|-------|-------|
| **Next slice id** | `01` |
| **Last updated** | 2026-08-20 |

---

## Slice registry

| Slice | Status | Module(s) | Feature(s) | Summary |
|-------|--------|-----------|------------|---------|
| _(none yet)_ | — | — | — | Agent/Cursor workflow seeded; app not scaffolded |

---

## Platform (cross-cutting)

| Area | Status | Notes |
|------|--------|-------|
| Hosting | Planned | GitHub Pages static build |
| Navigation | Planned | Top navbar with sections and dropdowns |
| Page modules | Planned | Hero, text, image, cards, section wrapper |
| Text lookup | Planned | `t()` with `[page].[section].[item]` keys |
| Updatable content | Planned | Google Sheets published data; fail gracefully |
| HTTP API | N/A | No custom backend |
| App database | N/A | No owned database |

---

## Features by module

### foundations

| Feature id | Routes / entry | Database | Status |
|------------|----------------|----------|--------|
| _example_ | `/` | none | Planned |

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
