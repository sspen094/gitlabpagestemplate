import type { FeedRow } from './types.ts'

/**
 * Parse published JSON into flat string rows. Accepts a top-level array, or an
 * object exposing `rows`/`values`. Cell values are coerced to strings so the
 * schema layer sees the same shape it gets from CSV. May throw on invalid JSON
 * — the feed client wraps this and reports a `parse` error.
 */
export function parseJsonRows(text: string): FeedRow[] {
  const data: unknown = JSON.parse(text)
  const list = toRecordArray(data)
  if (!list) {
    return []
  }

  const rows: FeedRow[] = []
  for (const item of list) {
    if (!isRecord(item)) {
      continue
    }
    const row: FeedRow = {}
    for (const [key, value] of Object.entries(item)) {
      const trimmedKey = key.trim()
      if (trimmedKey) {
        row[trimmedKey] = coerceString(value)
      }
    }
    rows.push(row)
  }

  return rows
}

function toRecordArray(data: unknown): unknown[] | null {
  if (Array.isArray(data)) {
    return data
  }
  if (isRecord(data)) {
    if (Array.isArray(data.rows)) {
      return data.rows
    }
    if (Array.isArray(data.values)) {
      return data.values
    }
  }
  return null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function coerceString(value: unknown): string {
  if (typeof value === 'string') {
    return value.trim()
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  return ''
}
