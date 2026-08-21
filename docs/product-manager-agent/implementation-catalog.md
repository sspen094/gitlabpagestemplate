# Ex-React — implementation catalog

Living index of **what the product has built**. `agent-product-manager` reads this **first** every session to avoid re-specifying shipped behavior.

**Maintainers:** Cursor updates after implementation lands; humans review on slice closeout.

---

## Next slice id

| Field | Value |
|-------|-------|
| **Next slice id** | `06` |
| **Last updated** | 2026-08-21 (Slice 05 shipped) |

---

## Slice registry

| Slice | Status | Module(s) | Feature(s) | Summary |
|-------|--------|-----------|------------|---------|
| 00-app-scaffold-and-deploy | Shipped 2026-08-20 | platform | app-scaffold | Vite + React TS SPA, `BASE_URL` Pages base, GitHub Actions deploy, placeholder shell |
| 01-text-management | Shipped 2026-08-20 | text | t-lookup | Central `defaultText` + `t()` / `useText()`; missing-key fallback; `TextProvider` for alternate sets |
| 02-modular-page-system | Shipped 2026-08-20 | pages | modular-pages | Config-driven pages, baseline modules, calendar list + month grid (D01) |
| 03-navigation | Shipped 2026-08-21 | navigation | navbar | Config-driven navbar, keyboard dropdowns, mobile hamburger drawer, layout quality gate (D01) |
| 04-google-sheets-updatable-content | Shipped 2026-08-21 | updatable-content, data-sources | sheets-hydration | Published Sheets hydration (export+gid), text/cards/events/contact, shell-first fallback |
| 05-external-submissions | Shipped 2026-08-21 | submissions | external-forms | Contact form via HTTPS email service or `mailto:` fallback (D01); no site-side storage |

---

## Platform (cross-cutting)

| Area | Status | Notes |
|------|--------|-------|
| Hosting | Shipped | GitHub Pages via Actions; Vite `base` from `BASE_URL` |
| Navigation | Shipped | Data-driven navbar; desktop dropdowns; mobile hamburger drawer |
| Page modules | Shipped | Hero, text, image, cards, section, calendar (list/month/hybrid), contact, contact-form; composer + registry |
| Text lookup | Shipped | `t()` with `[page].[section].[item]` keys; edit `text-config.ts` |
| Updatable content | Shipped | Google Sheets published CSV by `gid`; shell-first hydrate; sanitized fallback |
| External submissions | Shipped | HTTPS email-service POST, redirect handoff, or `mailto:` fallback; no site-side storage |
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

### pages

| Feature id | Routes / entry | Database | Status |
|------------|----------------|----------|--------|
| modular-pages | `#/` and `#/demo` (`pages-config.ts`); `#/about/contact` contact + contact-form | none | Shipped — [as-built](../modules/pages/features/modular-pages/README.md) |

### navigation

| Feature id | Routes / entry | Database | Status |
|------------|----------------|----------|--------|
| navbar | Shell header (`Navbar` + `nav-config.ts`) | none | Shipped — [as-built](../modules/navigation/features/navbar/README.md) |

### updatable-content

| Feature id | Routes / entry | Database | Status |
|------------|----------------|----------|--------|
| sheets-hydration | `#/demo` (text/cards/calendar); `#/about/contact` | none (read-only published Sheets) | Shipped — [as-built](../modules/updatable-content/features/sheets-hydration/README.md) |

### submissions

| Feature id | Routes / entry | Database | Status |
|------------|----------------|----------|--------|
| external-forms | `#/about/contact` (`contact-form` module) | none | Shipped — [as-built](../modules/submissions/features/external-forms/README.md) |

### foundations

| Feature id | Routes / entry | Database | Status |
|------------|----------------|----------|--------|
| _reserved_ | — | none | Planned — later slices |

---

## Integrations

| System | Read / write | Status |
|--------|--------------|--------|
| Google Sheets (published) | read-only | Shipped |
| External form / email endpoint | write (browser POST or mailto) | Shipped — owner-configured public URL; no site storage |

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
