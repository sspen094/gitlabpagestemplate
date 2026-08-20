# Success criteria — Slice 01 text-management

## SC-01 `t()` resolves `[page].[section].[item]` keys
- [ ] `t('home.hero.title')` returns the configured string
- verify: unit test on `t()` with known keys
- evidence: _(test result at closeout)_

## SC-02 Centralized, single-location text config
- [ ] All developer-authored static copy resolves from one central text tree
- verify: code review + grep for inline strings; unit test reads from central store
- evidence: _(review note at closeout)_

## SC-03 Missing key falls back safely
- [ ] Unknown key returns a fallback and does not throw
- verify: unit test on `t()` with unknown key
- evidence: _(test result at closeout)_

## SC-04 Localization-ready structure
- [ ] Text store supports swapping an alternate set/locale without changing call sites
- verify: unit test swapping an alternate text set; structure review
- evidence: _(test result at closeout)_
