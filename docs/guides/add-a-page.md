# Add a page

A page is **configuration, not a component**. You add an entry to one array; the router, layout, heading levels, and validation come for free. There is no new `.tsx` file and nothing to import.

Three files, in this order:

| Step | File |
|------|------|
| 1. Declare the page | `src/modules/pages/modular-pages/pages-config.ts` |
| 2. Write the copy | `src/modules/text/t-lookup/text-config.ts` |
| 3. Put it in the navbar | `src/modules/navigation/navbar/nav-config.ts` |

## 1. Declare the page

Append a `PageDefinition` to `defaultPages`:

```ts
{
  id: 'programs',
  path: '/programs',
  appearance: { width: 'shell' },
  modules: [
    {
      id: 'programs-hero',
      type: 'hero',
      mode: 'static',
      config: {
        titleKey: 'programs.hero.title',
        bodyKey: 'programs.hero.body',
      },
    },
  ],
}
```

| Field | Required | Notes |
|-------|----------|-------|
| `id` | yes | Unique; used as the React route key |
| `path` | yes | Leading slash. Nesting is just a longer path (`/about/members`) — no parent route needed. |
| `modules` | yes | Rendered top to bottom |
| `appearance` | | Page-level style options — see [Rebrand and style](rebrand-and-style.md#page-level-appearance) |

Routing is hash-based (`HashRouter`), so `/programs` is served at `#/programs`. That is what makes the site work on GitHub Pages without server rewrites. An unmatched path renders the `app.notFound.body` message rather than a blank screen.

## 2. Write the copy

Modules take `t()` keys, not literal strings. Add a `[page][section][item]` branch to `defaultText`:

```ts
programs: {
  hero: {
    title: 'Programs',
    body: 'What we run through the year.',
  },
},
```

Every `titleKey`, `bodyKey`, `captionKey`, or `ctaLabelKey` refers into this tree. A missing key renders the key itself instead of throwing, which makes typos visible in the browser rather than fatal.

Literal alternatives exist for prototyping — `title` instead of `titleKey`, `body` instead of `bodyKey` — but shipped pages should use keys so all copy stays in one file.

## 3. Put it in the navbar

Append to `defaultNav`:

```ts
{
  id: 'programs',
  kind: 'link',
  labelKey: 'nav.items.programs',
  href: '/programs',
}
```

Then add `programs` under `nav.items` in `text-config.ts`. Use `kind: 'section'` with a `children` array for a dropdown — `about` is the shipped example. The navbar marks the active route and collapses into a hamburger drawer on narrow screens; both behaviors are automatic.

A page does not have to be in the navbar. Leave it out and the route still works if you link to it directly.

## Compose the page body

Pick module types from the [module catalog](add-a-module.md#module-catalog). Two patterns are worth knowing:

**Group modules together** with `section`, whose `children` are full module instances. Nested modules get their heading level shifted down automatically, so the document outline stays valid:

```ts
{
  id: 'programs-detail',
  type: 'section',
  mode: 'static',
  config: {
    titleKey: 'programs.detail.title',
    children: [
      { id: 'programs-detail-copy', type: 'text', mode: 'static',
        config: { bodyKey: 'programs.detail.body' } },
      { id: 'programs-detail-image', type: 'image', mode: 'static',
        config: { src: '/favicon.svg', alt: 'Placeholder mark' } },
    ],
  },
}
```

**Pull content from a spreadsheet** by setting `mode: 'updatable'` — see [Configure an updatable section](updatable-section.md).

## Check your work

```powershell
npm run dev
```

Open `#/programs`. If a module renders as a grey fallback block instead of content, its config failed validation — the required fields per type are listed in the [module catalog](add-a-module.md#module-catalog), and the reason is on the rendered fallback. A page never dies because one module is misconfigured; only that module degrades.

Then add a case to `tests/unit/page-composer.test.tsx` (or `demo-site.test.ts` for route-level assertions) and run:

```powershell
npm test
```

Note that `tests/unit/demo-site.test.ts` asserts the exact route list of the sample site, so it will fail until you update it — expected when you are building a real site on top of the template.

## Related

- [Add a module](add-a-module.md) — the catalog, plus how to build a new type
- [Rebrand and style](rebrand-and-style.md) — `appearance` and `style` vocabulary
- [`modules/pages/features/modular-pages`](../modules/pages/features/modular-pages/README.md) — as-built detail
