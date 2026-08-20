# Ex-React

Static React website template for GitHub Pages. Selected page content can later be updated from published Google Sheets. There is no custom backend or database.

## Local development

```powershell
Copy-Item .env.example .env.local
npm install
npm run dev
```

`npm run build` writes static files to `dist/`. `npm test` runs the unit suite.

**Site copy:** edit strings in `src/modules/text/t-lookup/text-config.ts`. The landing page looks them up with `t('page.section.item')`.

## Base path (forks)

Vite `base` comes from a single value: **`BASE_URL`**.

| Hosting | Example URL | `BASE_URL` |
|---------|-------------|------------|
| Local or user site | `https://<user>.github.io/` | `/` |
| Project site | `https://<user>.github.io/<repo>/` | `/<repo>/` |

**Local:** copy `.env.example` to `.env.local` (gitignored) and set `BASE_URL`.

**GitHub Actions:** nothing to set. The workflow derives the base from the repository name (`/<repo>/`, or `/` for a `<user>.github.io` repo). To override it, add an Actions variable `BASE_URL` under Settings → Secrets and variables → Actions → Variables.

## Deploy to GitHub Pages

1. Merge to `main` (or run the **Deploy GitHub Pages** workflow from the Actions tab).
2. Repo Settings → Pages → Source: **GitHub Actions**.
3. The workflow runs `npm ci`, `npm test`, and `npm run build`, then publishes `dist/`.

If the deployed page is blank, check the browser console for 404s on `/assets/...`: that means the build base path does not match the Pages URL. The **Resolve base path** step in the workflow log prints the base it used.

The workflow file is `.github/workflows/pages.yml`.
