# Developer guide — Ex-React

How this repo is laid out and how to run it locally. Task walkthroughs (add a page, rebrand, fork) live in [`guides/README.md`](guides/README.md).

**Product requirements:** [`requirements/requirements.md`](requirements/requirements.md). Delivery slices: [`requirements/README.md`](requirements/README.md).

---

## 1. Before you start

| Step | You provide |
|------|-------------|
| **Project profile** | Static React site on GitHub Pages; Google Sheets for selected updatable content; no custom backend. |
| **Vision** | [`requirements/requirements.md`](requirements/requirements.md) is the product spec until `docs/requirements/vision/` exists. |
| **Env** | Optional `.env.example` → `.env.local` for Vite base path, the public Google Spreadsheet URL, and worksheet gids. See §5. |

---

## 2. Modules vs slices

| Concept | What it is | Where it lives |
|---------|------------|----------------|
| **Slice** | A **delivery unit** — one increment (requirements → tasks → code → tests). Numbered `00-…` through `06-…`. | `docs/requirements/slices/NN-name/` |
| **Module** | A **product / ownership area** (pages, sheets mapping, navigation, theme). | `src/` and as-built under `docs/modules/<module_id>/` |
| **Feature** | One capability inside a module (kebab-case id). | Colocated under `src/` for that area |

Register modules in `docs/implemented-design/design/modules.md` when you add a new ownership area.

---

## 3. Where requirements go

Slice folders live under `docs/requirements/slices/`. **Allowed in that folder only:**

```text
NN-name-requirements.md            ← product requirements for the increment
deviations/                        ← mid-slice pivots (optional)
input-files/                       ← approved mockups (optional)
success-criteria/                  ← SC-xx checklists
```

**Never** put `src/` or `tests/` inside the slice folder.

Header of the requirements doc should include: **Module(s):**, **Feature id(s):**, acceptance criteria, out of scope.

Executable task lists live under `docs/project-files/project-plan/slices/`. Keep them in sync with the matching requirements file.

---

## 4. Delivery loop

1. Write or update requirements under `docs/requirements/slices/<id>/`.
2. Sync `docs/project-files/project-plan/slices/<id>-tasks.md` (phased tasks, including tests, success criteria, as-built, and a project-wide docs update).
3. Implement on a named branch; mark tasks complete as they land.
4. Before merge: run `npm test`, `npm run lint`, and `npm run build`; evaluate SC-xx; refresh as-built docs.

---

## 5. Environment — what you fill in

| File | Who edits | What to fill |
|------|-----------|--------------|
| **`.env.local`** | You (gitignored) | Non-secret local config: Vite base path, `VITE_GOOGLE_SHEETS_URL`, and `VITE_GOOGLE_SHEETS_GIDS`. Start from `.env.example`. |
| **GitHub Pages** | You | Repo Pages settings; optional `BASE_URL`, `VITE_GOOGLE_SHEETS_URL`, and `VITE_GOOGLE_SHEETS_GIDS` as repository Actions variables or `github-pages` environment variables. |

**Load locally:**

```powershell
npm install
npm run dev
```

Production is a static `npm run build` deployed to GitHub Pages. There is no SQL, IIS, or FastAPI layer.

**Static copy:** edit strings in `src/modules/text/t-lookup/text-config.ts`. Components use `t('page.section.item')`. Local `npm run dev` hot-reloads those edits; GitHub Pages updates only after a deploy.

**Pages:** edit `src/modules/pages/modular-pages/pages-config.ts` to add pages or module instances. Preview `#/`, `#/events`, `#/about`, `#/about/contact`, and `#/about/members`. Step-by-step: [`guides/add-a-page.md`](guides/add-a-page.md).

**Appearance:** site-wide tokens in `src/modules/theme/site-theme/config.ts`; per-page `appearance` and per-module `style` options in `pages-config.ts`. See [`guides/rebrand-and-style.md`](guides/rebrand-and-style.md).

**Nav:** edit `src/modules/navigation/navbar/nav-config.ts` for top-level links and dropdowns. Labels are `nav.items.*` / `nav.chrome.*` in `text-config.ts`. Narrow viewports use a hamburger drawer.

**Google Sheets:** use one public, read-only spreadsheet. Name each worksheet tab for its target updatable module (`demo-text`, `demo-cards`, `demo-calendar`, `contact-info` in the demo). All rows on that tab use the module's schema. Set `VITE_GOOGLE_SHEETS_URL` and `VITE_GOOGLE_SHEETS_GIDS` locally, and for production as repository Actions variables or `github-pages` environment variables; see [`guides/google-sheets-source.md`](guides/google-sheets-source.md) for the walkthrough and [`configuration/google-sheets.md`](configuration/google-sheets.md) for the reference. Hand [`guides/editor-google-sheets.md`](guides/editor-google-sheets.md) to whoever maintains the content.

**Contact form:** the example on `#/about/contact` submits through an external adapter only. Set `VITE_SUBMIT_EMAIL_ENDPOINT` for an HTTPS form service, or leave it empty to open the local mail app. Recipient and message templates are documented in [`configuration/README.md`](configuration/README.md).

---

## 6. Defects

Track issues in GitHub (or chat).

---

## 7. What to do next (checklist)

- [ ] Placeholders replaced (`Ex-React`, `ex-react`)
- [ ] `requirements.md` reviewed
- [ ] `npm run dev` works
- [ ] Content replaced via [`guides/fork-and-rename.md`](guides/fork-and-rename.md)
- [ ] Theme and style options set via [`guides/rebrand-and-style.md`](guides/rebrand-and-style.md)
