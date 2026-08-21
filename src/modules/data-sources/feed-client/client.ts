import { parseCsv } from './csv.ts'
import { resolveFeedUrl } from './google-sheets.ts'
import { parseJsonRows } from './json.ts'
import type { FeedError, FeedErrorKind, FeedResult, FeedSource } from './types.ts'

export type FetchLike = (input: string) => Promise<{
  ok: boolean
  status: number
  text: () => Promise<string>
}>

export type FetchFeedOptions = {
  fetchImpl?: FetchLike
}

/**
 * Fetch and parse a published feed. Every failure path — no URL, network throw,
 * non-2xx, unreadable body, parse error, or zero rows — resolves to
 * `{ ok: false, error }`. This function does not throw.
 */
export async function fetchFeed(
  source: FeedSource,
  options: FetchFeedOptions = {},
): Promise<FeedResult> {
  const fetchImpl = options.fetchImpl ?? resolveGlobalFetch()

  if (!source.publishedUrl) {
    return fail('network', 'No published feed URL configured')
  }
  if (!fetchImpl) {
    return fail('network', 'No fetch implementation available')
  }

  let response: Awaited<ReturnType<FetchLike>>
  try {
    response = await fetchImpl(resolveFeedUrl(source))
  } catch (error) {
    return fail('network', messageOf(error, 'Feed request failed'))
  }

  if (!response.ok) {
    return fail('http', `Feed responded with status ${response.status}`)
  }

  let body: string
  try {
    body = await response.text()
  } catch (error) {
    return fail('network', messageOf(error, 'Feed body could not be read'))
  }

  let rows
  try {
    rows = source.format === 'json' ? parseJsonRows(body) : parseCsv(body)
  } catch (error) {
    return fail('parse', messageOf(error, 'Feed could not be parsed'))
  }

  if (rows.length === 0) {
    return fail('empty', 'Feed contained no rows')
  }

  return { ok: true, rows }
}

function resolveGlobalFetch(): FetchLike | undefined {
  const candidate = (globalThis as { fetch?: unknown }).fetch
  return typeof candidate === 'function'
    ? (candidate as unknown as FetchLike)
    : undefined
}

function messageOf(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback
}

function fail(kind: FeedErrorKind, message: string): FeedResult {
  const error: FeedError = { kind, message }
  return { ok: false, error }
}
