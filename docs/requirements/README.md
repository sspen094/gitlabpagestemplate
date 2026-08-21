# Requirements

Requirements layer hub for Ex-React. Product requirements and per-slice delivery requirements live here.

## Product requirements

- [`requirements.md`](requirements.md) — full product requirements for the semi-static React website template (authority until `docs/requirements/vision/` is seeded).

## Slices

Each slice is one vertical delivery increment. Slice requirements live under [`slices/`](slices/); the matching executable task lists live under [`docs/project-files/project-plan/slices/`](../project-files/project-plan/slices/).

| Slice | Name | Requirements | Tasks | Covers (requirements.md) |
|-------|------|--------------|-------|--------------------------|
| 00 | App scaffold & GitHub Pages deploy | [00](slices/00-app-scaffold-and-deploy/00-app-scaffold-and-deploy-requirements.md) | [tasks](../project-files/project-plan/slices/00-app-scaffold-and-deploy-tasks.md) | §3, §6.1, §14, §16 |
| 01 | Text management (`t()`) | [01](slices/01-text-management/01-text-management-requirements.md) | [tasks](../project-files/project-plan/slices/01-text-management-tasks.md) | §7.4, §12 |
| 02 | Modular page system & baseline modules | [02](slices/02-modular-page-system/02-modular-page-system-requirements.md) | [tasks](../project-files/project-plan/slices/02-modular-page-system-tasks.md) | §7.1, §8.1, §13, §15 |
| 03 | Navigation | [03](slices/03-navigation/03-navigation-requirements.md) | [tasks](../project-files/project-plan/slices/03-navigation-tasks.md) | §7.3, §13 |
| 04 | Google Sheets updatable content | [04](slices/04-google-sheets-updatable-content/04-google-sheets-updatable-content-requirements.md) | [tasks](../project-files/project-plan/slices/04-google-sheets-updatable-content-tasks.md) | §6.2, §6.3, §7.2, §7.5, §8, §10, §11 |
| 05 | External submission flows | [05](slices/05-external-submissions/05-external-submissions-requirements.md) | [tasks](../project-files/project-plan/slices/05-external-submissions-tasks.md) | §7.6 |
| 06 | Demo site, theming & styling, fork/editor documentation | [06](slices/06-demo-site-and-docs/06-demo-site-and-docs-requirements.md) | [tasks](../project-files/project-plan/slices/06-demo-site-and-docs-tasks.md) | §2, §5.2, §9, §12, §13, §14, §15, §16 |

## Delivery order

Slices are sequenced by dependency: 00 (scaffold) → 01 (text) → 02 (modules) → 03 (navigation) → 04 (updatable content) → 05 (submissions) → 06 (demo + docs). Later slices assume the earlier ones have shipped.

## Authoring conventions

- Slice folders contain only the main requirements `.md`, plus optional `deviations/`, `input-files/`, and `success-criteria/`.
- Never nest `src/` or `tests/` under a slice folder.
- Keep `docs/project-files/project-plan/slices/*-tasks.md` and `success-criteria/traceability.md` in sync with these requirements.
