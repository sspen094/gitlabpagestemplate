# Ex-React

Static React website template for GitHub Pages. Selected page content can later be updated from published Google Sheets. There is no custom backend or database.

## Local development

```powershell
Copy-Item .env.example .env.local
npm install
npm run dev
```

`npm run build` writes static files to `dist/`. `npm test` runs the unit suite.

## Base path (forks)

Vite `base` comes from a single value: **`BASE_URL`**.

| Hosting | Example URL | `BASE_URL` |
|---------|-------------|------------|
| Local or user site | `https://<user>.github.io/` | `/` |
| Project site | `https://<user>.github.io/<repo>/` | `/<repo>/` |

**Local:** copy `.env.example` to `.env.local` (gitignored) and set `BASE_URL`.

**GitHub Actions:** Settings → Secrets and variables → Actions → Variables → `BASE_URL` (same value as above). If the variable is unset, the build uses `/`.

## Deploy to GitHub Pages

1. Merge to `main` (or run the **Deploy GitHub Pages** workflow from the Actions tab).
2. Repo Settings → Pages → Source: **GitHub Actions**.
3. Set the `BASE_URL` Actions variable to match the Pages URL (usually `/<repo>/` for a fork).
4. The workflow runs `npm ci`, `npm test`, and `npm run build`, then publishes `dist/`.

The workflow file is `.github/workflows/pages.yml`.
