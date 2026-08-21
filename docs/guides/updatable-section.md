# Configure an updatable section

An **updatable** module renders its static config first, then swaps in rows from a published worksheet once they arrive. That ordering is the whole design: the page paints immediately, never waits on Google, and never goes blank if the fetch fails.

This guide covers the module side. The spreadsheet and env side is [Map a Google Sheets data source](google-sheets-source.md); do that first if the sheet does not exist yet.

## What can be updatable

Four module types have a matching data schema. Anything else stays static.

| Module type | Data type | One sheet row becomes |
|-------------|-----------|-----------------------|
| `text` | `text-block` | One paragraph |
| `card-list` | `card-list` | One card |
| `calendar` | `event-list` | One event |
| `contact` | `contact-info` | One label/value line |

## 1. Name the module after its worksheet

The module `id`, the mapping `id`, and the worksheet tab name are all the same string. That is how a module finds its data without repeating the source in page config, so pick the name once and use it in all three places.

## 2. Mark the instance updatable

In `pages-config.ts`, set `mode: 'updatable'`, keep a small static config as the shell, and give it a fallback message:

```ts
{
  id: 'demo-cards',
  type: 'card-list',
  mode: 'updatable',
  style: { layout: 'grid' },
  config: {
    titleKey: 'members.directory.title',
    entries: [
      {
        id: 'demo-cards-shell',
        titleKey: 'members.directory.cardOneTitle',
        bodyKey: 'members.directory.cardOneBody',
      },
    ],
  },
  fallback: { messageKey: 'updatable.fallback.unavailable' },
}
```

`pages-config.ts` has an `updatable()` helper that builds exactly this shape — use it for new instances rather than repeating the boilerplate.

Two parts of that config are easy to get wrong:

- **The shell config is not optional.** It still has to satisfy the type's validation rules, because it is what renders on first paint and whenever the sheet is unreachable. An `entries: []` shell fails validation and degrades to the fallback block permanently.
- **The shell copy should read as placeholder text,** since visitors see it for a moment on every load and indefinitely if the sheet is not configured.

## 3. Add the mapping

In `src/modules/updatable-content/sheets-hydration/sheet-mappings.ts`:

```ts
{
  id: 'demo-cards',
  page: 'members',
  moduleId: 'demo-cards',
  type: 'card-list',
  publishedUrl: '',
  format: 'csv',
  tab: 'demo-cards',
  limit: 12,
}
```

| Field | Notes |
|-------|-------|
| `id`, `moduleId`, `tab` | The shared name from step 1 |
| `page` | The owning page id — documentation for humans; lookup is by `id` |
| `type` | Must match the module type per the table above, or the mapping is ignored |
| `publishedUrl` | Left **empty** on purpose; env supplies the real URL at runtime so the committed template stays site-agnostic |
| `format` | `csv` for Google Sheets; `json` is available for other feeds |
| `limit` | Maximum rows rendered — the guard against a runaway spreadsheet |

## 4. Supply the worksheet id

Add the tab's gid to `VITE_GOOGLE_SHEETS_GIDS` in `.env.local` and restart `npm run dev`:

```dotenv
VITE_GOOGLE_SHEETS_GIDS=demo-text:0,demo-cards:567206608
```

A mapping with no gid deliberately keeps its shell rather than requesting the spreadsheet, because a Google worksheet can only be addressed by gid — a name-based request would silently return the first tab instead of erroring.

## The three states

Each updatable module is always in exactly one of these:

| State | When | Visitor sees |
|-------|------|--------------|
| `shell` | First render, and whenever there is no usable source | Static config from `pages-config.ts` |
| `ready` | Rows parsed successfully | Sheet content |
| `fallback` | Fetch failed, feed empty, or every row malformed | The `t()` message for that reason |

Fallback copy lives under `updatable.fallback.*` in `text-config.ts` — `unavailable`, `empty`, and `malformed`. Rewrite those strings for your site; they are visitor-facing.

Sheet values replace the shell's `*Key` copy lookups with literal text, so a hydrated module shows spreadsheet content rather than `t()` placeholders. Rows missing a required field are dropped individually; unknown columns are ignored; markup is stripped and unsafe links rejected before anything reaches render.

## Verify it

```powershell
npm run dev
```

Open the page and watch the section: shell copy first, then sheet rows. If it stays on shell copy, work through these in order — the cause is almost always one of them.

| Symptom | Cause |
|---------|-------|
| Shell copy never changes | No `VITE_GOOGLE_SHEETS_URL`, or no gid for that tab |
| Shell copy never changes, gid is set | Mapping `type` does not match the module type |
| Fallback message appears | Sheet reachable but empty, or every row missing a required field |
| Grey fallback block instead of the module | Shell config fails validation — fix `pages-config.ts`, not the sheet |

Then add coverage to `tests/unit/updatable-modules.test.tsx` with a committed CSV fixture under `tests/fixtures/google-sheets/<tab>.csv`. Tests inject a fake fetch and read fixtures — **no test may request the live sheet**, or the suite starts failing whenever someone edits a spreadsheet.

## Related

- [Map a Google Sheets data source](google-sheets-source.md) — sheet setup, URLs, gids, column formats
- [Update content with Google Sheets](editor-google-sheets.md) — hand this to whoever edits the sheet
- [`modules/updatable-content/features/sheets-hydration`](../modules/updatable-content/features/sheets-hydration/README.md) — as-built detail
