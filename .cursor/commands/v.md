# Verification mode (`/v`)

Implement the requested change, then **prove** it before marking work complete.

## Steps

1. **Scope** — read `.cursor/active-slice` for `SLICE_ID`; load matching `*-tasks.md` and requirements.
2. **Implement** — minimal diff; match existing module patterns under `src/`.
3. **Criteria** — evaluate applicable files:
   - `docs/requirements/slices/<SLICE_ID>/success-criteria/*.md` (**SC-xx**)
   - `docs/project-files/verification/design-patterns/*.md` (**DP-xx**, exclude README)
4. **Tests** — run scoped unit/component tests; add or update tests when criteria require them.
5. **Runtime** — start or refresh Vite when behavior changed; smoke the affected page.
6. **Traceability** — update `success-criteria/traceability.md` **Result** + **Evidence** for each row.
7. **Report** — for milestones, write `docs/project-files/verification-reports/YYYYMMDD-HHMMSS-<slice-id>/` with `cursor-criteria.md` and `cursor-evidence.md`.

## Default commands

```powershell
npm test
npm run build
```

When navigation, layout, or page modules changed, also run Playwright (dev server must be up):

```powershell
npx playwright test
```

Soft-skip Playwright when the stack is down. **Not** a required CI gate until the project adds one.

## Fail gate

If any applicable SC-xx or DP-xx is **FAIL**, stop and fix — do not skip to "done".
