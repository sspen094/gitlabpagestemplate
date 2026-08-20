# Success criteria — Slice 00 app-scaffold-and-deploy

Evaluated at Final. Each SC maps to an acceptance criterion in the slice requirements.

## SC-01 Static build deployable to GitHub Pages
- [ ] `npm run build` emits static assets only that can be served on GitHub Pages
- verify: run `npm run build`; inspect `dist/` output and asset paths
- evidence: _(build log / dist listing at closeout)_

## SC-02 Configurable base path for forks
- [ ] Base path is set from a single config/env source and produces correct asset URLs for `/<repo>/`
- verify: build with a sample base path; confirm generated asset URLs
- evidence: _(build output at closeout)_

## SC-03 App shell renders without external data
- [ ] Placeholder landing view mounts and renders with no external data source configured
- verify: component/render smoke test; `npm run dev` manual load
- evidence: _(test result / screenshot at closeout)_

## SC-04 Dev/build/test scripts run green
- [ ] `npm run dev`, `npm run build`, and `npm test` succeed on a clean checkout
- verify: run each script; CI job green
- evidence: _(CI run / local logs at closeout)_
