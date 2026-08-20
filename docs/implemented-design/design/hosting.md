# Hosting

The site is a static Vite build (`npm run build` → `dist/`). There is no custom backend, SSR, or database.

GitHub Actions (`.github/workflows/pages.yml`) publishes `dist/` with the official Pages actions. Asset URLs use Vite `base` from `BASE_URL` so a project site at `https://<user>.github.io/<repo>/` loads JS/CSS correctly.
