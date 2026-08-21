import { describe, expect, it } from 'vitest'
import type { FetchLike } from '../../src/modules/data-sources/feed-client/index.ts'
import {
  hydrateMapping,
  hydrateRows,
} from '../../src/modules/updatable-content/sheets-hydration/hydrate.ts'
import {
  GOOGLE_SHEETS_GIDS_ENV,
  GOOGLE_SHEETS_URL_ENV,
  parseGidMap,
  resolveMappings,
} from '../../src/modules/updatable-content/sheets-hydration/config.ts'
import { findMapping } from '../../src/modules/updatable-content/sheets-hydration/mapping.ts'
import { sheetMappings } from '../../src/modules/updatable-content/sheets-hydration/sheet-mappings.ts'

function okFetch(body: string): FetchLike {
  return async () => ({ ok: true, status: 200, text: async () => body })
}

describe('hydrateRows', () => {
  it('hydrates one text block per sheet row', () => {
    const result = hydrateRows('text-block', [
      { text: 'First' },
      { text: 'Second' },
      { text: '' },
    ])
    expect(result.ok).toBe(true)
    if (result.ok && result.data.type === 'text-block') {
      expect(result.data.blocks.map((block) => block.text)).toEqual([
        'First',
        'Second',
      ])
      expect(result.dropped).toBe(1)
    }
  })

  it('drops malformed rows and reports the dropped count', () => {
    const result = hydrateRows('card-list', [
      { title: 'Keep' },
      { subtitle: 'no title or description' },
    ])
    expect(result.ok).toBe(true)
    if (result.ok && result.data.type === 'card-list') {
      expect(result.data.cards).toHaveLength(1)
      expect(result.dropped).toBe(1)
    }
  })

  it('orders cards by the sortOrder column before limiting', () => {
    const result = hydrateRows('card-list', [
      { title: 'Second', sortOrder: '2' },
      { title: 'First', sortOrder: '1' },
      { title: 'Unordered' },
    ])
    expect(result.ok).toBe(true)
    if (result.ok && result.data.type === 'card-list') {
      expect(result.data.cards.map((card) => card.title)).toEqual([
        'First',
        'Second',
        'Unordered',
      ])
    }
  })

  it('enforces the collection limit', () => {
    const rows = Array.from({ length: 5 }, (_, i) => ({ title: `Card ${i}` }))
    const result = hydrateRows('card-list', rows, 2)
    expect(result.ok).toBe(true)
    if (result.ok && result.data.type === 'card-list') {
      expect(result.data.cards).toHaveLength(2)
    }
  })

  it('falls back to empty when there are no rows', () => {
    const result = hydrateRows('event-list', [])
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.fallback.reason).toBe('empty')
      expect(result.fallback.messageKey).toBe('updatable.fallback.empty')
    }
  })

  it('falls back to malformed when every row is invalid', () => {
    const result = hydrateRows('event-list', [{ title: 'No date' }])
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.fallback.reason).toBe('malformed')
    }
  })
})

describe('hydrateMapping', () => {
  const mapping = {
    id: 'demo-cards',
    page: 'demo',
    moduleId: 'demo-card-list',
    type: 'card-list' as const,
    publishedUrl: 'https://sheet/cards',
    format: 'csv' as const,
    limit: 12,
  }

  it('hydrates from a healthy feed', async () => {
    const result = await hydrateMapping(mapping, {
      fetchImpl: okFetch('title,subtitle\nAlpha,One\nBeta,Two'),
    })
    expect(result.ok).toBe(true)
    if (result.ok && result.data.type === 'card-list') {
      expect(result.data.cards).toHaveLength(2)
    }
  })

  it('falls back when the feed fails to load', async () => {
    const result = await hydrateMapping(
      { ...mapping, publishedUrl: '' },
      {},
    )
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.fallback.reason).toBe('fetch-failed')
    }
  })
})

describe('config + mapping', () => {
  const spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/sheet-id/edit'

  it('uses one environment key for the spreadsheet', () => {
    expect(GOOGLE_SHEETS_URL_ENV).toBe('VITE_GOOGLE_SHEETS_URL')
    expect(GOOGLE_SHEETS_GIDS_ENV).toBe('VITE_GOOGLE_SHEETS_GIDS')
  })

  it('reads the worksheet gid map from one environment value', () => {
    expect(parseGidMap('demo-text:0, demo-cards:12345')).toEqual({
      'demo-text': '0',
      'demo-cards': '12345',
    })
    expect(parseGidMap('broken, demo-text:abc, :7')).toEqual({})
    expect(parseGidMap(undefined)).toEqual({})
  })

  it('applies the spreadsheet URL and gid to every mapped worksheet', () => {
    const resolved = resolveMappings({
      VITE_GOOGLE_SHEETS_URL: spreadsheetUrl,
      VITE_GOOGLE_SHEETS_GIDS: sheetMappings
        .map((mapping, index) => `${mapping.tab}:${index}`)
        .join(','),
    })

    expect(new Set(resolved.map((mapping) => mapping.publishedUrl))).toEqual(
      new Set([spreadsheetUrl]),
    )
    expect(resolved.map((mapping) => mapping.gid)).toEqual(
      sheetMappings.map((_mapping, index) => String(index)),
    )
  })

  it('keeps a worksheet on its shell when no gid is configured', () => {
    const resolved = resolveMappings({
      VITE_GOOGLE_SHEETS_URL: spreadsheetUrl,
      VITE_GOOGLE_SHEETS_GIDS: 'demo-text:0',
    })

    expect(
      resolved.find((mapping) => mapping.id === 'demo-text')?.publishedUrl,
    ).toBe(spreadsheetUrl)
    expect(
      resolved.find((mapping) => mapping.id === 'demo-cards')?.publishedUrl,
    ).toBe('')
  })

  it('keeps published URLs empty and non-secret by default', () => {
    for (const mapping of sheetMappings) {
      expect(mapping.publishedUrl).toBe('')
    }
  })

  it('finds a mapping by page and module id', () => {
    const found = findMapping(sheetMappings, 'demo', 'demo-calendar')
    expect(found?.type).toBe('event-list')
    expect(found?.tab).toBe('demo-calendar')
  })
})
