# Fork, rename, and adapt

Turning this template into a real site. Every piece of shipped content is placeholder and fictional, so the work is renaming the project, pointing it at your own hosting, and replacing content — not untangling someone else's site.

Budget an hour for steps 1–4 to get a correctly-named site live with your own branding, then replace content page by page.

## 1. Create your repository

Fork or clone, then rename. `ex-react` and `Ex-React` appear in three places:

| File | Change |
|------|--------|
| `package.json` | `"name": "your-site"` |
| `index.html` | `<title>` — this is the browser tab title |
| `README.md` | Heading and description |

Then set the site's own name in `src/modules/text/t-lookup/text-config.ts`: `home.header.brand` is the navbar wordmark.

## 2. Set the base path

Vite's `base` comes from one value, `BASE_URL`, and getting it wrong is the classic cause of a blank deployed page.

| Hosting | URL | `BASE_URL` |
|---------|-----|------------|
| Local dev, or a user site | `https://<user>.github.io/` | `/` |
| Project site | `https://<user>.github.io/<repo>/` | `/<repo>/` |

Locally, copy `.env.example` to `.env.local` (gitignored) and set it. In GitHub Actions there is nothing to set — the workflow derives the base from the repository name. Override it with an Actions variable named `BASE_URL` if you need to.

If the deployed page is blank, open devtools and look for 404s on `/assets/…`; the workflow's **Resolve base path** step prints the base it used.

## 3. Replace the placeholder content

Work through these four files. Nothing else holds site content.

| File | Holds |
|------|-------|
| `src/modules/text/t-lookup/text-config.ts` | **All** visitor-facing copy, keyed `[page][section][item]` |
| `src/modules/pages/modular-pages/pages-config.ts` | Which pages exist and which modules they contain |
| `src/modules/navigation/navbar/nav-config.ts` | Navbar links and dropdowns |
| `src/modules/updatable-content/sheets-hydration/sheet-mappings.ts` | Which worksheet feeds which module |

The sample content to remove:

| Item | Where |
|------|-------|
| "SAMPLE COMMUNITY" wordmark | `home.header.brand` |
| Home, About, Contact, Members, Events sample copy | `text-config.ts` |
| Routes `/`, `/events`, `/about`, `/about/contact`, `/about/members` | `pages-config.ts` |
| `demo-text`, `demo-cards`, `demo-calendar`, `contact-info` mappings and ids | `sheet-mappings.ts` + `pages-config.ts` |
| `hello@example.test` contact line | `contact.info.valueOne` |
| Placeholder favicon used as sample imagery | `public/favicon.svg`, referenced by `image` modules |
| Sample sheet URL and gids | `.env.example`, `.env.local` |
| Sample CSV fixtures | `tests/fixtures/google-sheets/` |

Renaming an updatable module means changing its id in all three places — page config, mapping, and the `<tab>:<gid>` pair — plus the worksheet tab name itself. Keeping the ids and just repointing the spreadsheet is the lower-effort path.

Also rewrite the visitor-facing fallback strings under `updatable.fallback.*`, `modules.fallback.*`, and `app.notFound.body`. They are easy to forget because they only appear when something goes wrong.

The [add a page](add-a-page.md) and [add a module](add-a-module.md) guides cover building out your own structure.

## 4. Rebrand

Edit `src/modules/theme/site-theme/config.ts` — colors, fonts, spacing, widths. See [Rebrand and style](rebrand-and-style.md). Replace `public/favicon.svg` with your own icon while you are there.

## 5. Wire up integrations

Both are optional; the site works without them.

**Editable content.** Create your own spreadsheet and set `VITE_GOOGLE_SHEETS_URL` and `VITE_GOOGLE_SHEETS_GIDS` — see [Map a Google Sheets data source](google-sheets-source.md). Leave them empty and every updatable section renders its static shell, which is a legitimate way to ship.

**Contact form.** Set `VITE_SUBMIT_EMAIL_ENDPOINT` to a public HTTPS form service, or leave it empty to fall back to the visitor's mail app via `mailto:`. Recipient and message templates are in `.env.example`. The site never stores submissions.

Set both for production as repository Actions variables or `github-pages` environment variables — Vite inlines `VITE_*` at build time, so `.env.local` alone gives you a working local site and an unconfigured deployed one.

## 6. Fix the tests that assert the sample site

`tests/unit/demo-site.test.ts` intentionally pins the shipped demo — the exact route list, the set of module types placed, the updatable module ids, and a committed fixture per mapping whose text reads as placeholder data. It will fail once you replace the content, which is the point: it exists so nobody ships a real site with template leftovers.

Update it to describe *your* site rather than deleting it. Keep the fixture rule: tests read committed CSV files under `tests/fixtures/google-sheets/`, never the live spreadsheet, so the suite cannot break when someone edits content.

The rest of the suite reads copy through `defaultText` rather than hardcoding strings, so renaming and rewriting copy does not break it.

```powershell
npm install
npm test
npm run lint
npm run build
```

## 7. Deploy

1. Repo Settings → Pages → Source: **GitHub Actions**.
2. Push to `main`, or run the **Deploy GitHub Pages** workflow from the Actions tab.
3. The workflow runs `npm ci`, `npm test`, and `npm run build`, then publishes `dist/`.

The workflow file is `.github/workflows/pages.yml`. A failing test blocks the deploy by design.

## What you can leave behind

Delivery history is optional for a live site. Removing it does not affect the build.

| Path | Keep it if |
|------|-----------|
| `docs/requirements/` | You want the original product spec and slice requirements |
| `docs/project-files/` | You want task lists, regression inventory, and verification reports |
| `docs/guides/`, `docs/configuration/`, `docs/modules/` | Worth keeping — this is how your site works |

## Constraints to respect

These are architectural, not stylistic. Breaking them means you are no longer running this template.

- **No backend, database, or server-side rendering.** Static build only. Integrations are public read-only feeds and public submit endpoints.
- **No secrets in the repo or in `VITE_*` values.** Anything Vite inlines ships to every visitor. The Sheets link is public and read-only; form endpoints are public POST targets.
- **Plain CSS with custom properties.** No framework, preprocessor, or CSS-in-JS.
- **Copy goes through `t()` keys**, not literals in components.
- **Appearance goes through the theme and the closed style vocabulary**, not per-component CSS edits.

## Related

- [Rebrand and style](rebrand-and-style.md) · [Add a page](add-a-page.md) · [Add a module](add-a-module.md)
- [`configuration/README.md`](../configuration/README.md) — every env key
- [`developer.md`](../developer.md) — repo layout and local setup
