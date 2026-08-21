# Architecture

| Doc | Purpose |
|-----|---------|
| Product requirements | [`docs/requirements/requirements.md`](../requirements/requirements.md) (authority until `vision/`) |
| As-built | [`docs/implemented-design/`](../implemented-design/) |
| Modules | [`docs/implemented-design/design/modules.md`](../implemented-design/design/modules.md) |
| Hosting | [`docs/implemented-design/design/hosting.md`](../implemented-design/design/hosting.md) |
| Text | [`docs/implemented-design/design/text.md`](../implemented-design/design/text.md) |
| Pages | [`docs/implemented-design/design/pages.md`](../implemented-design/design/pages.md) |
| Navigation | [`docs/implemented-design/design/navigation.md`](../implemented-design/design/navigation.md) |
| Updatable content | [`docs/implemented-design/design/updatable-content.md`](../implemented-design/design/updatable-content.md) |
| Submissions | [`docs/implemented-design/design/submissions.md`](../implemented-design/design/submissions.md) |
| UI controls | [`docs/implemented-design/design/ui-controls.md`](../implemented-design/design/ui-controls.md) |

**Shipped:** Slice 00 — static React SPA on GitHub Pages. Slice 01 — central `t()`. Slice 02 — config-driven pages, baseline modules, calendar (list + month grid). Slice 03 — data-driven navbar, keyboard dropdowns, mobile hamburger drawer (D01). Slice 04 — Google Sheets hydration for text, cards, events, and contact. Slice 05 — Contact form with HTTPS email service or `mailto:` fallback (D01). Slice 06 — realistic demo site, theme tokens, page/module style options, editor and developer guides. Template delivery is complete.
