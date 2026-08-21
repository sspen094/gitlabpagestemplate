import {
  fetchFeed,
  type FeedRow,
  type FetchFeedOptions,
} from '../../data-sources/feed-client/index.ts'
import { toFallback, type FallbackState } from './fallback.ts'
import type { SheetMapping } from './mapping.ts'
import {
  parseCard,
  parseContact,
  parseEvent,
  parseTextBlock,
  type Card,
  type ContactEntry,
  type EventItem,
  type TextBlock,
  type UpdatableType,
} from './schemas.ts'

/**
 * Turn raw feed rows into render-ready, sanitized data — or a safe fallback.
 * `hydrateRows` is the pure core (no network); `hydrateMapping` adds the fetch.
 * Neither throws: failure and malformed input always resolve to a fallback.
 */

export type UpdatableData =
  | { type: 'text-block'; blocks: TextBlock[] }
  | { type: 'card-list'; cards: Card[] }
  | { type: 'event-list'; events: EventItem[] }
  | { type: 'contact-info'; contacts: ContactEntry[] }

export type HydrationResult =
  | {
      ok: true
      type: UpdatableType
      data: UpdatableData
      total: number
      dropped: number
    }
  | { ok: false; type: UpdatableType; fallback: FallbackState }

export function hydrateRows(
  type: UpdatableType,
  rows: readonly FeedRow[],
  limit?: number,
): HydrationResult {
  const total = rows.length
  if (total === 0) {
    return { ok: false, type, fallback: toFallback('empty') }
  }

  const { data, kept, dropped } = parseByType(type, rows, limit)
  if (kept === 0) {
    return { ok: false, type, fallback: toFallback('malformed') }
  }

  return { ok: true, type, data, total, dropped }
}

export async function hydrateMapping(
  mapping: SheetMapping,
  options: FetchFeedOptions = {},
): Promise<HydrationResult> {
  const result = await fetchFeed(
    {
      publishedUrl: mapping.publishedUrl,
      format: mapping.format,
      tab: mapping.tab,
      gid: mapping.gid,
      range: mapping.range,
    },
    options,
  )

  if (!result.ok) {
    const reason = result.error.kind === 'empty' ? 'empty' : 'fetch-failed'
    return { ok: false, type: mapping.type, fallback: toFallback(reason) }
  }

  return hydrateRows(mapping.type, result.rows, mapping.limit)
}

function parseByType(
  type: UpdatableType,
  rows: readonly FeedRow[],
  limit?: number,
): { data: UpdatableData; kept: number; dropped: number } {
  switch (type) {
    case 'text-block': {
      const blocks = applyLimit(collect(rows, parseTextBlock), limit)
      return {
        data: { type, blocks },
        kept: blocks.length,
        dropped: rows.length - blocks.length,
      }
    }
    case 'card-list': {
      const cards = applyLimit(bySortOrder(collect(rows, parseCard)), limit)
      return {
        data: { type, cards },
        kept: cards.length,
        dropped: rows.length - cards.length,
      }
    }
    case 'event-list': {
      const events = applyLimit(collect(rows, parseEvent), limit)
      return {
        data: { type, events },
        kept: events.length,
        dropped: rows.length - events.length,
      }
    }
    case 'contact-info': {
      const contacts = applyLimit(collect(rows, parseContact), limit)
      return {
        data: { type, contacts },
        kept: contacts.length,
        dropped: rows.length - contacts.length,
      }
    }
  }
}

function collect<T>(
  rows: readonly FeedRow[],
  parse: (row: FeedRow) => T | null,
): T[] {
  const out: T[] = []
  for (const row of rows) {
    const parsed = parse(row)
    if (parsed) {
      out.push(parsed)
    }
  }
  return out
}

/** Honour the optional `sortOrder` column; unordered rows keep sheet order last. */
function bySortOrder(cards: Card[]): Card[] {
  return cards
    .map((card, index) => ({ card, index }))
    .sort((left, right) => {
      const leftOrder = left.card.sortOrder ?? Number.MAX_SAFE_INTEGER
      const rightOrder = right.card.sortOrder ?? Number.MAX_SAFE_INTEGER
      return leftOrder - rightOrder || left.index - right.index
    })
    .map((entry) => entry.card)
}

function applyLimit<T>(items: T[], limit?: number): T[] {
  return typeof limit === 'number' && limit >= 0 ? items.slice(0, limit) : items
}
