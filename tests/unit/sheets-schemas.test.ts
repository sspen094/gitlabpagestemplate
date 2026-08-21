import { describe, expect, it } from 'vitest'
import {
  parseCard,
  parseContact,
  parseEvent,
  parseTextBlock,
  pickAllowedFields,
} from '../../src/modules/updatable-content/sheets-hydration/schemas.ts'
import {
  sanitizeInteger,
  sanitizeMultiline,
  sanitizeText,
  sanitizeUrl,
} from '../../src/modules/updatable-content/sheets-hydration/sanitize.ts'

describe('sanitize', () => {
  it('strips HTML and collapses whitespace in single-line text', () => {
    expect(sanitizeText('  <b>Hi</b>   there ')).toBe('Hi there')
  })

  it('caps single-line text length', () => {
    expect(sanitizeText('x'.repeat(20), 5)).toBe('xxxxx')
  })

  it('keeps paragraph breaks but strips tags in multiline text', () => {
    expect(sanitizeMultiline('a<script>bad</script>\n\n\n\nb')).toBe('abad\n\nb')
  })

  it('allows safe URL schemes and site-relative links', () => {
    expect(sanitizeUrl('https://example.com/x')).toBe('https://example.com/x')
    expect(sanitizeUrl('mailto:a@b.com')).toBe('mailto:a@b.com')
    expect(sanitizeUrl('/about/contact')).toBe('/about/contact')
    expect(sanitizeUrl('example.com/path')).toBe('https://example.com/path')
  })

  it('rejects dangerous URL schemes', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBeUndefined()
    expect(sanitizeUrl('  JavaScript:alert(1)')).toBeUndefined()
    expect(sanitizeUrl('data:text/html,<script>')).toBeUndefined()
    expect(sanitizeUrl('not a url')).toBeUndefined()
  })

  it('parses non-negative integers only', () => {
    expect(sanitizeInteger('3')).toBe(3)
    expect(sanitizeInteger('  10 ')).toBe(10)
    expect(sanitizeInteger('1.5')).toBeUndefined()
    expect(sanitizeInteger('abc')).toBeUndefined()
  })
})

describe('pickAllowedFields', () => {
  it('drops columns outside the schema allow-list', () => {
    const picked = pickAllowedFields(
      { text: 'Hello', onclick: 'evil', extra: 'x' },
      'text-block',
    )
    expect(picked).toEqual({ text: 'Hello' })
  })
})

describe('parseTextBlock', () => {
  it('parses a valid block from the text column and strips markup', () => {
    expect(
      parseTextBlock({ text: 'Hello <b>world</b>', extra: 'no' }),
    ).toEqual({ text: 'Hello world' })
  })

  it('drops rows missing the text column', () => {
    expect(parseTextBlock({ title: 'Only title' })).toBeNull()
  })
})

describe('parseCard', () => {
  it('sanitizes optional fields and parses sort order', () => {
    expect(
      parseCard({
        title: 'Card',
        subtitle: 'Sub',
        link: 'example.com',
        imageUrl: 'javascript:alert(1)',
        sortOrder: '2',
      }),
    ).toEqual({
      title: 'Card',
      subtitle: 'Sub',
      link: 'https://example.com',
      sortOrder: 2,
    })
  })

  it('keeps a described row that has no title', () => {
    expect(parseCard({ description: 'Body only' })).toEqual({
      title: '',
      description: 'Body only',
    })
  })

  it('drops a row with neither title nor description', () => {
    expect(parseCard({ subtitle: 'orphan' })).toBeNull()
  })
})

describe('parseEvent', () => {
  it('requires a title and a date', () => {
    expect(parseEvent({ title: 'Kickoff', date: '2026-09-01' })).toEqual({
      title: 'Kickoff',
      date: '2026-09-01',
    })
  })

  it('normalizes the formats a Google Sheets date column exports', () => {
    for (const date of ['9/1/2026', '09/01/2026', 'Sep 1, 2026', '1 September 2026']) {
      expect(parseEvent({ title: 'Kickoff', date })?.date).toBe('2026-09-01')
    }
  })

  it('reads a day above 12 as day/month', () => {
    expect(parseEvent({ title: 'Kickoff', date: '25/12/2026' })?.date).toBe(
      '2026-12-25',
    )
  })

  it('drops events with an unreadable date', () => {
    expect(parseEvent({ title: 'Bad', date: 'next Tuesday' })).toBeNull()
    expect(parseEvent({ title: 'Bad', date: '2026-02-30' })).toBeNull()
  })
})

describe('parseContact', () => {
  it('infers the contact type from the value when unset', () => {
    expect(parseContact({ label: 'Email', value: 'a@b.com' })).toEqual({
      label: 'Email',
      value: 'a@b.com',
      type: 'email',
    })
  })

  it('honors an explicit allowed type', () => {
    expect(parseContact({ label: 'Line', value: '555-1234', type: 'phone' })).toEqual(
      { label: 'Line', value: '555-1234', type: 'phone' },
    )
  })

  it('drops rows missing label or value', () => {
    expect(parseContact({ label: 'Only label' })).toBeNull()
  })
})
