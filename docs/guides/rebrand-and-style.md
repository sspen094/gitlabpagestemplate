# Rebrand and style

Appearance is configuration in two layers:

| Layer | What it controls | Where |
|-------|------------------|-------|
| **Theme** | The whole site's colors, type, spacing, radii, shadows, widths, breakpoints, z-index | `src/modules/theme/site-theme/config.ts` |
| **Style options** | Per-page and per-module layout and emphasis, from a closed set of named values | `pages-config.ts` |

Neither layer involves editing component CSS, and there is no freeform-CSS path by design — pages cannot inject arbitrary styles. Theme values are developer configuration and are never sourced from Google Sheets.

## Rebrand: change the whole site

Edit `defaultTheme` in `src/modules/theme/site-theme/config.ts`. For a first pass, five values carry most of the identity:

```ts
palettes: {
  light: {
    accent: '#0f766e',
    accentStrong: '#115e59',
    heading: '#0f172a',
    // …
  },
  // …
},
typography: {
  sans: "'Inter', system-ui, sans-serif",
  heading: "'Fraunces', Georgia, serif",
  // …
},
```

Run `npm run dev` and the entire site follows — chrome, navbar, every module, form controls, focus rings. Nothing else needs editing, and if a component does not respond, that component is reading a literal instead of a token, which is a bug.

Set `mode` in the same file to pin a palette: `'system'` (default) follows the visitor's OS preference, `'light'` and `'dark'` force one. There is no visitor-facing toggle by design.

Alternatively, pass overrides at the mount point in `src/main.tsx` and leave `config.ts` as shipped defaults:

```tsx
<ThemeProvider theme={{ palettes: { light: { accent: '#0f766e' } } }}>
```

Overrides are deep-merged per field, so a partial object is fine. Editing `config.ts` is better for a permanent rebrand — one file, one source of truth. The prop is for injecting an alternate theme in tests or per-deployment variation.

### Fonts

No webfont CDN may be required for the site to render. Ship font files in `public/` with a local `@font-face`, or keep a system-font stack, and always keep a real fallback family in the token value.

### Bad values cannot break the site

`resolveTheme` never throws. Every field is validated independently and reverts to its default when it fails, so a typo costs you one token, not the page:

| Field type | Accepted |
|------------|----------|
| Colors | `#rgb`…`#rrggbbaa`, `rgb()`, `rgba()`, `hsl()`, `hsla()`, `oklch()`, `oklab()`, `lab()`, `lch()`, `color()`, `transparent`, `currentColor` |
| Lengths | A number with `px`, `rem`, `em`, `%`, `vw`, `vh`, `svw`, `svh`, `ch`, or `ex` |
| Font sizes and line height | A length, or a bare number |
| Font families, shadows | Any string without `;`, `{`, `}`, `<`, `>`, or `url(` |
| Breakpoints | Number ≥ 320 |
| z-index | Number ≥ 0 |

`url(` and CSS-terminating characters are rejected outright, because token values are emitted into a `<style>` element.

## Token reference

The provider emits these custom properties at `:root`. Use them in any CSS you add.

| Group | Custom properties |
|-------|-------------------|
| Palette | `--color-text`, `--color-heading`, `--color-background`, `--color-surface`, `--color-surface-raised`, `--color-border`, `--color-code-background`, `--color-accent`, `--color-accent-strong`, `--color-accent-soft`, `--color-accent-border`, `--color-backdrop`, `--color-danger` |
| Type | `--font-sans`, `--font-heading`, `--font-mono`, `--font-root-size`, `--font-compact-root-size`, `--font-line-height`, `--font-letter-spacing` |
| Type scale | `--font-size-small`, `--font-size-body`, `--font-size-lead`, `--font-size-control`, `--font-size-display`, `--font-size-display-compact`, `--font-size-title`, `--font-size-title-compact`, `--font-size-heading` |
| Spacing | `--space-xxs` `2px` → `--space-5xl` `48px` (`xxs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`) |
| Radius | `--radius-small`, `--radius-medium`, `--radius-large`, `--radius-pill` |
| Shadow | `--shadow-soft`, `--shadow-raised`, `--shadow-focus` |
| Layout | `--layout-shell`, `--layout-reading`, `--layout-form`, `--layout-card-track` |
| Breakpoints | `--breakpoint-compact`, `--breakpoint-mobile` |
| Depth | `--z-dropdown`, `--z-backdrop`, `--z-drawer` |

In `mode: 'system'`, shared tokens and the light palette are emitted at `:root` and the dark palette overrides them inside a `prefers-color-scheme: dark` block. Explicit modes emit one palette and pin `color-scheme`.

Two rules apply when you write CSS in `src/App.css` or `src/index.css`:

- **Use tokens instead of literal values** for color, spacing, radius, shadow, and depth. `tests/unit/mobile-quality-gate.test.tsx` enforces the mechanical part of this — no `px` or `rgba()` literals in `gap`, `padding`, `margin`, `border-radius`, or `z-index` — and resets such as `padding: 0`, `border: 0`, and `max-width: 100%` are the deliberate exceptions. Literal colors are not caught by a test, so they are the easy way to break a rebrand; keep them out.
- **Breakpoint literals in `@media` conditions must match the tokens.** Media queries cannot read custom properties, so `1024px` and `767px` appear literally and a test asserts they equal `defaultTheme.breakpoints`. Change a breakpoint in the theme and you must change the media queries too — `MOBILE_MEDIA_QUERY` in `navigation/navbar/mobile-query.ts` derives from the token automatically.

## Style options

Both layers below take a closed set of named values. **An unrecognized value falls back to that axis's default and the page still renders** — the instance records a non-blocking `style-degraded` issue rather than dying. Only structural problems (missing `id`, `type`, `config`, unknown type) degrade a module to the fallback block.

### Page-level appearance

On a `PageDefinition` in `pages-config.ts`:

```ts
{
  id: 'members',
  path: '/about/members',
  appearance: { width: 'shell', rhythm: 'compact' },
  modules: [ /* … */ ],
}
```

| Axis | Values | Effect |
|------|--------|--------|
| `width` | `reading` (default), `narrow`, `shell` | Content measure: capped reading width, form width, or the full shell |
| `tone` | `default`, `accent`, `muted` | Sets the surface and border tokens inherited by every module on the page |
| `rhythm` | `default`, `compact`, `roomy` | Vertical gap between modules |

`width` is how a page opts out of the default capped reading measure — use `shell` for grids, wide calendars, and directories, `reading` for prose.

### Module-level style

On a `ModuleInstance`:

```ts
{
  id: 'contact-form',
  type: 'contact-form',
  mode: 'static',
  style: { surface: 'raised', width: 'narrow' },
  config: { /* … */ },
}
```

| Axis | Values | Effect |
|------|--------|--------|
| `variant` | `default`, `quiet`, `feature` | `quiet` reduces the type size; `feature` adds padding, border, radius, accent surface, and a soft shadow |
| `align` | `start` (default), `center` | Centers content and text |
| `width` | `default`, `narrow`, `full` | `narrow` caps at the form width; `full` releases the caps, including inner ones |
| `tone` | `default`, `accent`, `muted` | Overrides the inherited surface and border tokens |
| `surface` | `default`, `plain`, `card`, `raised` | `plain` strips the container; `card` adds a soft shadow; `raised` a stronger one |
| `spacing` | `default`, `compact`, `roomy` | Inner gap and padding |
| `layout` | Per module type — see below | Layout choice for types that have one |

`layout` is validated against the module's own set, so an unknown value degrades while the module still renders:

| Type | Values | Default |
|------|--------|---------|
| `card-list` | `grid`, `list` | `grid` |
| `calendar` | `month` (or `grid`), `list` (or `agenda`), `hybrid` | `list` |

`layout` used to live loosely in `config.layout`. Both spellings still resolve — typed `style.layout` wins, then `config.layout`, then the default — but new pages should use `style.layout` so every appearance choice sits in one object.

Style classes carry scoped custom-property overrides rather than hardcoded values, which is why `page-composer--tone-accent` recolors the modules inside it and a module's own `tone` can still override that.

### Where the sample site uses them

Worth reading in `pages-config.ts` before choosing your own combinations:

| Page | Options |
|------|---------|
| Home | `rhythm: 'roomy'`; hero `variant: 'feature'` + `align: 'center'`; updates `surface: 'card'` |
| Events | `width: 'shell'`; calendar `layout: 'hybrid'` + `width: 'full'` |
| About > Contact | `tone: 'muted'`; hero `variant: 'quiet'`; form `surface: 'raised'` + `width: 'narrow'` |
| About > Members | `width: 'shell'` + `rhythm: 'compact'`; cards `layout: 'grid'` + `tone: 'accent'` + `spacing: 'compact'` |

## Recipes

**A page needs the full width.** Set `appearance: { width: 'shell' }`. If one module inside it should still break out of its inner caps, add `style: { width: 'full' }` to that module.

**One module needs emphasis.** `style: { variant: 'feature' }`. For a quieter container instead, `style: { surface: 'card' }`.

**A module should look like plain page content.** `style: { surface: 'plain' }` removes the container without touching its markup.

**Denser or airier page.** `appearance: { rhythm: 'compact' | 'roomy' }` for the gaps between modules; `style: { spacing: … }` for inside one module.

**A new axis is genuinely needed.** Add the value to the appropriate list in `src/modules/pages/modular-pages/style.ts`, add the matching `.module--*` or `.page-composer--*` rule in `App.css` using tokens, and cover it in `tests/unit/module-style.test.tsx`. Widening the closed set is the supported path; freeform CSS in page config is not.

## Verify

```powershell
npm test
npm run lint
npm run build
```

Then check the site in a browser at desktop and phone widths, in both palettes — switch your OS between light and dark, or set `mode` temporarily. Confirm focus rings are visible when tabbing and that text contrast holds in both palettes.

## Related

- [Add a page](add-a-page.md) — where `appearance` goes
- [Add a module](add-a-module.md) — where `style` goes, and writing token-based CSS
- [`project-files/verification/design-patterns/mobile-layout.md`](../project-files/verification/design-patterns/mobile-layout.md) — mobile invariants DP-ML-01..05
