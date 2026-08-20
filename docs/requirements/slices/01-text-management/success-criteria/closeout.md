# Success criteria — Slice 01 text-management

Evaluated at Final. Each SC maps to an acceptance criterion in the slice requirements.

## SC-01 `t()` resolves `[page].[section].[item]` keys
- [x] `t('home.hero.title')` returns the configured string — **2026-08-20**
- verify: unit test on `t()` with known keys
- evidence: `tests/unit/t-lookup.test.tsx` (`t()` known keys); `npm test` 15 passed

## SC-02 Centralized, single-location text config
- [x] All developer-authored static copy resolves from one central text tree — **2026-08-20**
- verify: code review + grep for inline strings; unit test reads from central store
- evidence: `src/modules/text/t-lookup/text-config.ts` (`defaultText`); `src/App.tsx` uses `useText()` keys only; `app-shell.test.tsx` asserts `defaultText` leaves

## SC-03 Missing key falls back safely
- [x] Unknown key returns a fallback and does not throw — **2026-08-20**
- verify: unit test on `t()` with unknown key
- evidence: `tests/unit/t-lookup.test.tsx` (echo missing key; malformed key; placeholder mode)

## SC-04 Localization-ready structure
- [x] Text store supports swapping an alternate set/locale without changing call sites — **2026-08-20**
- verify: unit test swapping an alternate text set; structure review
- evidence: `createT` / `setActiveTextTree` / `TextProvider` tests in `t-lookup.test.tsx`; `src/main.tsx` wraps `TextProvider`
