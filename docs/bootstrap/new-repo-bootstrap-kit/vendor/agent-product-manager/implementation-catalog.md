# MFGCIDashboard — implementation catalog

Living index of **what the product has built**. `agent-product-manager` reads this **first** every session to avoid re-specifying shipped behavior.

**Maintainers:** Cursor updates after implementation lands; humans review on slice closeout.

---

## Next slice id

| Field | Value |
|-------|-------|
| **Next slice id** | `01` _(after `00-foundations`)_ |
| **Last updated** | YYYY-MM-DD |

---

## Slice registry

| Slice | Status | Module(s) | Feature(s) | Summary |
|-------|--------|-----------|------------|---------|
| `00-foundations` | _Draft / In progress / Shipped_ | foundations | home, … | Bootstrap platform |

---

## Platform (cross-cutting)

| Area | Status | Notes |
|------|--------|-------|
| Auth | _TBD_ | |
| Navigation | _TBD_ | |
| App database `CIDashboard` | _TBD_ | |
| HTTP API | _TBD_ | Omit row if API-only N/A |
| Client UI (`frontend/`) | _TBD_ | Omit row if no frontend |

---

## Features by module

### foundations

| Feature id | Routes / entry | Database | Status |
|------------|----------------|----------|--------|
| _example_ | _/api/… or UI path_ | _`CIDashboard` / none_ | _Planned_ |

---

## Integrations

| System | Read / write | Status |
|--------|--------------|--------|
| _e.g. warehouse_ | read-only | _TBD_ |

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
3. Add feature rows with routes, DB intent, and links to `docs/modules/…` as-built.
4. Note new DP-xx or regression scripts in regression-plan.

`agent-product-manager`: **read only** unless human directs catalog edits.
