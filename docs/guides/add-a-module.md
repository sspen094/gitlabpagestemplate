# Add a module

A **module** is one reusable block on a page. Nine types ship with the template, so start by checking whether one of them already does the job with different config — that needs no code at all, only a new entry in `pages-config.ts`.

If you do need a new type, it is four files: the component, the registry, the validator, and a test.

## Module catalog

Place any of these in a page's `modules` array. `mode` is `'static'` or `'updatable'`; `id` must be unique on the page. Copy fields come in pairs — `titleKey` resolves through `t()`, `title` is a literal.

| Type | Renders | Required config | Optional config |
|------|---------|-----------------|-----------------|
| `hero` | Page-opening banner with `h1` | `titleKey` / `title` | `subtitleKey`, `bodyKey`, `mediaSrc` + `mediaAlt`, `ctaLabelKey` + `ctaHref` |
| `text` | One or more paragraphs | `titleKey` **or** `bodyKey` | `blocks: [{ id, textKey \| text }]` for multi-paragraph |
| `image` | Figure with caption | `src`, `alt` | `captionKey` |
| `card-list` | Grid or list of cards | `entries: [{ titleKey \| title }]` | per entry: `subtitleKey`, `bodyKey`, `link`, `imageUrl`; `titleKey` |
| `section` | Group wrapper for nested modules | `children: ModuleInstance[]` | `titleKey` |
| `calendar` | Month grid, agenda list, or both | `events: [{ date, titleKey \| title }]` | `month` (`YYYY-MM`), `upcomingCount`, `upcomingTitleKey`, per event `time`, `location`, `detailKey`, `link` |
| `contact` | Label/value contact lines | `entries: [{ labelKey, valueKey }]` | per entry `type`: `email`, `phone`, `url`, `plain`; `titleKey` |
| `contact-form` | Name/email/message form | `titleKey` / `title` | `adapter` (`email-service` default, `redirect`, `mail-app`), `submitLabel` |
| `placeholder` | Titled stub for scaffolding | `titleKey` / `title` | `bodyKey` |

Four of them can read from a spreadsheet: `text`, `card-list`, `calendar`, and `contact`. See [Configure an updatable section](updatable-section.md).

Every type also accepts a `style` object — see [Rebrand and style](rebrand-and-style.md#module-level-style).

`mediaAlt` is mandatory whenever `hero` sets `mediaSrc`, and `image` always requires `alt`. Decorative card images are given an empty `alt` for you.

## Build a new type

The worked example below is a `quote` module. Files live in `src/modules/pages/modular-pages/`; a module that belongs to another product area can live in its own module folder instead — `contact-form` ships from `src/modules/submissions/external-forms/`.

### 1. The component

```tsx
import { ModuleFrame } from './ModuleFrame.tsx'
import { readCopy } from './copy.ts'
import { ModuleHeading } from './heading-level.tsx'
import type { ModuleComponentProps } from './types.ts'

export function QuoteModule({ instance }: ModuleComponentProps) {
  const quote = readCopy(instance.config.quoteKey, instance.config.quote)
  const attribution = readCopy(
    instance.config.attributionKey,
    instance.config.attribution,
  )
  const title = readCopy(instance.config.titleKey, instance.config.title)
  const headingId = title ? `${instance.id}-title` : undefined

  return (
    <ModuleFrame
      instance={instance}
      className="module-quote"
      labelledBy={headingId}
      label={title ? undefined : 'Quote'}
    >
      {title ? <ModuleHeading id={headingId}>{title}</ModuleHeading> : null}
      <blockquote>{quote}</blockquote>
      {attribution ? <p>{attribution}</p> : null}
    </ModuleFrame>
  )
}
```

Four conventions matter here, and skipping any of them is how a module ends up subtly broken:

- **Wrap in `ModuleFrame`.** It emits the `<section>`, the `data-module-*` attributes that tests and styling hooks rely on, and the resolved style classes. A module that renders its own wrapper silently opts out of every style option.
- **Read copy with `readCopy(key, literal)`,** which prefers the `t()` key and falls back to the literal. `readString` is for non-copy values like URLs.
- **Emit headings with `ModuleHeading`,** never a hardcoded `<h2>`. It reads the current level from context so the same module keeps a valid outline whether it sits at page level or nested in a `section`.
- **Pass `labelledBy` when there is a heading, `label` when there is not,** so the landmark is always named.

### 2. Register the type

In `registry.ts`, import the component and add a line beside the others:

```ts
registerModule('quote', QuoteModule)
```

The registry is the single source of truth for which types exist. A page referencing an unregistered type renders the fallback block with `unknown-type`.

### 3. Validate the config

In `validate.ts`, add a case to `validateTypeConfig`:

```ts
case 'quote':
  if (!hasCopy(instance.config.quoteKey, instance.config.quote)) {
    return [missingConfig('quote modules require quoteKey or quote')]
  }
  return []
```

This is where required fields belong — not in the component. The composer never special-cases a module implementation, and returning a `missing-config` issue is what makes the instance degrade to the fallback block instead of rendering half-empty.

If your type has named layout choices, add them to `MODULE_LAYOUTS` in `style.ts` and read them with `readLayoutOption` rather than reaching into `config.layout` yourself. That keeps the value inside the validated closed set.

### 4. Style it

Add `.module-quote` rules to `src/App.css` using theme tokens — `var(--space-lg)`, `var(--color-border)`, and so on. Literal colors, spacing, radii, and z-index values are rejected by `tests/unit/mobile-quality-gate.test.tsx`, which asserts against the stylesheet text. Read [Rebrand and style](rebrand-and-style.md) before writing CSS here; the token names are listed there.

### 5. Test it

Add a case to `tests/unit/baseline-modules.test.tsx` covering a valid instance and a missing-required-field instance. Assert on `data-module-type` and the fallback path — that pair is what proves the module is wired through validation rather than rendering by accident.

```powershell
npm test
npm run lint
```

## Related

- [Add a page](add-a-page.md) — where module instances are placed
- [Configure an updatable section](updatable-section.md) — making a module read from a sheet
- [`modules/pages/features/modular-pages`](../modules/pages/features/modular-pages/README.md) — as-built detail
