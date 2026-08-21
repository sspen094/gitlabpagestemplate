# Configuration

| File | Who | Purpose |
|------|-----|---------|
| `.env.example` | committed | Documents `BASE_URL`, Sheets keys, submit service, local mail recipient/template, and redirect settings. No secrets. |
| `.env.local` | local, gitignored | Copy of the example; set the Pages path, public spreadsheet link, worksheet gids, and public submit URLs. |
| Actions variable `BASE_URL` | optional | Overrides the workflow’s derived `/<repo>/` (or `/` for a user site). |
| Actions variable `VITE_GOOGLE_SHEETS_URL` | optional | Supplies the public spreadsheet link to the production build. |
| Actions variable `VITE_GOOGLE_SHEETS_GIDS` | optional | Supplies `<tab>:<gid>` pairs to the production build. |
| Actions variable `VITE_SUBMIT_EMAIL_ENDPOINT` | optional | Public https form/email endpoint for the email-service adapter. |
| Actions variable `VITE_SUBMIT_EMAIL_RECIPIENT` | optional | Public destination for the local `mailto:` fallback; the visitor chooses a recipient when empty. |
| Actions variable `VITE_SUBMIT_EMAIL_SUBJECT` | optional | Local mail-app subject template; supports `{name}`, `{email}`, and `{message}`. |
| Actions variable `VITE_SUBMIT_EMAIL_BODY_TEMPLATE` | optional | Local mail-app body template; supports the same placeholders and `\n` line breaks. |
| Actions variable `VITE_SUBMIT_REDIRECT_URL` | optional | Public https hosted-form URL for the redirect adapter. |

Vite inlines `VITE_*` during `npm run build`, so these values must reach the workflow's **build** job. Either scope works: a repository variable (Settings → Secrets and variables → Actions → Variables) or a `github-pages` environment variable, since the build job joins that environment. A missing value is not an error — the build succeeds and every updatable module renders its static shell, so the run logs the character count of each and warns when either is empty.

Local run: `Copy-Item .env.example .env.local` then `npm run dev`. See the root [`README.md`](../../README.md).

**Slice 02:** page composition is code config (`pages-config.ts`), not env.

**Slice 03:** nav is code config (`nav-config.ts`) plus `t()` labels. No new env keys.

**Slice 04:** published Sheets intake — see [google-sheets.md](google-sheets.md).

**Slice 05:** public submit endpoints (`VITE_SUBMIT_EMAIL_ENDPOINT`, `VITE_SUBMIT_REDIRECT_URL`) and local mail-app settings (`VITE_SUBMIT_EMAIL_RECIPIENT`, `VITE_SUBMIT_EMAIL_SUBJECT`, `VITE_SUBMIT_EMAIL_BODY_TEMPLATE`). The Contact form prefers the configured HTTPS email endpoint; when it is empty, the browser opens the visitor's default mail app through `mailto:`. Subject and body templates replace `{name}`, `{email}`, and `{message}` with form values; use `\n` for line breaks. These adapters never store submissions on the site.
