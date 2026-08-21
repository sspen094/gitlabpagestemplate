import { describe, expect, it } from 'vitest'
import {
  fetchFeed,
  isGoogleSheetUrl,
  parseCsv,
  parseJsonRows,
  resolveFeedUrl,
  type FetchLike,
} from '../../src/modules/data-sources/feed-client/index.ts'

function stubFetch(response: {
  ok?: boolean
  status?: number
  body?: string
  throwOn?: 'fetch' | 'text'
}): FetchLike {
  return async () => {
    if (response.throwOn === 'fetch') {
      throw new Error('network down')
    }
    return {
      ok: response.ok ?? true,
      status: response.status ?? 200,
      text: async () => {
        if (response.throwOn === 'text') {
          throw new Error('body unreadable')
        }
        return response.body ?? ''
      },
    }
  }
}

describe('parseCsv', () => {
  it('maps a header row to keyed records', () => {
    const rows = parseCsv('title,body\nHello,World\nSecond,Row')
    expect(rows).toEqual([
      { title: 'Hello', body: 'World' },
      { title: 'Second', body: 'Row' },
    ])
  })

  it('handles quoted fields, embedded commas, escaped quotes, and CRLF', () => {
    const rows = parseCsv('title,body\r\n"A, B","She said ""hi"""')
    expect(rows).toEqual([{ title: 'A, B', body: 'She said "hi"' }])
  })

  it('skips blank lines and ignores unnamed columns', () => {
    const rows = parseCsv('title,\nOnly,extra\n\n')
    expect(rows).toEqual([{ title: 'Only' }])
  })

  it('returns an empty array for empty input', () => {
    expect(parseCsv('')).toEqual([])
  })
})

describe('parseJsonRows', () => {
  it('accepts a top-level array and coerces values to strings', () => {
    const rows = parseJsonRows('[{"title":"A","sortOrder":2,"live":true}]')
    expect(rows).toEqual([{ title: 'A', sortOrder: '2', live: 'true' }])
  })

  it('accepts a wrapper object with rows/values', () => {
    expect(parseJsonRows('{"rows":[{"a":"1"}]}')).toEqual([{ a: '1' }])
    expect(parseJsonRows('{"values":[{"b":"2"}]}')).toEqual([{ b: '2' }])
  })

  it('returns empty when shape is not row-like', () => {
    expect(parseJsonRows('{"nope":1}')).toEqual([])
  })
})

describe('resolveFeedUrl', () => {
  it('converts one Google Sheets share link to a worksheet CSV export', () => {
    const resolved = resolveFeedUrl({
      publishedUrl:
        'https://docs.google.com/spreadsheets/d/example-sheet-id/edit?usp=sharing',
      format: 'csv',
      tab: 'demo-calendar',
      gid: '1234567',
    })
    const url = new URL(resolved)

    expect(url.pathname).toBe('/spreadsheets/d/example-sheet-id/export')
    expect(url.searchParams.get('format')).toBe('csv')
    expect(url.searchParams.get('gid')).toBe('1234567')
  })

  it('does not use gviz, which drops cells that mismatch a column type', () => {
    const resolved = resolveFeedUrl({
      publishedUrl: 'https://docs.google.com/spreadsheets/d/example-sheet-id/edit',
      format: 'csv',
      gid: '0',
    })

    expect(resolved).not.toContain('gviz')
  })

  it('flags a Google share link so callers know a gid is required', () => {
    expect(
      isGoogleSheetUrl('https://docs.google.com/spreadsheets/d/abc/edit'),
    ).toBe(true)
    expect(isGoogleSheetUrl('https://feeds.example.test/events.csv')).toBe(false)
  })

  it('preserves an explicit non-Google feed URL', () => {
    expect(
      resolveFeedUrl({
        publishedUrl: 'https://feeds.example.test/events.csv',
        format: 'csv',
        tab: 'demo-calendar',
      }),
    ).toBe('https://feeds.example.test/events.csv')
  })
})

describe('fetchFeed', () => {
  it('returns rows for a healthy CSV feed', async () => {
    const result = await fetchFeed(
      { publishedUrl: 'https://sheet/csv', format: 'csv' },
      { fetchImpl: stubFetch({ body: 'title,body\nA,B' }) },
    )
    expect(result).toEqual({ ok: true, rows: [{ title: 'A', body: 'B' }] })
  })

  it('fails without a configured URL and never throws', async () => {
    const result = await fetchFeed({ publishedUrl: '', format: 'csv' })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.kind).toBe('network')
    }
  })

  it('reports http status errors', async () => {
    const result = await fetchFeed(
      { publishedUrl: 'https://sheet/csv', format: 'csv' },
      { fetchImpl: stubFetch({ ok: false, status: 404 }) },
    )
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.kind).toBe('http')
    }
  })

  it('reports network throws as a failure result', async () => {
    const result = await fetchFeed(
      { publishedUrl: 'https://sheet/csv', format: 'csv' },
      { fetchImpl: stubFetch({ throwOn: 'fetch' }) },
    )
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.kind).toBe('network')
    }
  })

  it('reports malformed JSON as a parse failure', async () => {
    const result = await fetchFeed(
      { publishedUrl: 'https://sheet/json', format: 'json' },
      { fetchImpl: stubFetch({ body: '{not json' }) },
    )
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.kind).toBe('parse')
    }
  })

  it('reports an empty feed', async () => {
    const result = await fetchFeed(
      { publishedUrl: 'https://sheet/csv', format: 'csv' },
      { fetchImpl: stubFetch({ body: 'title,body\n' }) },
    )
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.kind).toBe('empty')
    }
  })
})
