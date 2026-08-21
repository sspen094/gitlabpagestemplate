# Mobile layout quality gate (DP)

Project-wide pattern: UI must remain usable at a phone-width viewport. Agents merge this at `/v` or `/v+codex` with slice SC-xx.

Applies to chrome (navbar, header) and content modules (hero, text, image, cards, section, calendar).

---

## Checklist

## DP-ML-01 Viewport meta and fluid root
- [ ] `index.html` has `width=device-width`; `#root` is `max-width: 100%`
- verify: `index.html`, `src/index.css`

## DP-ML-02 Text and media wrap
- [ ] Main content uses `overflow-wrap`; images/svg/video `max-width: 100%`
- verify: `src/index.css`, `src/App.css`

## DP-ML-03 Grids do not force overflow
- [ ] Auto-fit grids use `minmax(min(<track>, 100%), 1fr)` (not a raw `minmax(14rem, 1fr)`)
- verify: `src/App.css`, `tests/unit/mobile-quality-gate.test.ts`

## DP-ML-04 Wide tables scroll inside the module
- [ ] Month calendar (and similar tables) sit in a horizontal scroll wrapper
- verify: `CalendarModule`, `tests/unit/mobile-quality-gate.test.ts`

## DP-ML-05 Mobile navigation
- [ ] Narrow viewports use hamburger + side drawer; desktop keeps the inline navbar
- verify: navbar component tests with `matchMedia`
