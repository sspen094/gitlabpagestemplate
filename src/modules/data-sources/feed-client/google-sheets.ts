import type { FeedSource } from './types.ts'

const GOOGLE_SHEETS_PATH = /^\/spreadsheets\/d\/([^/]+)/

/** True when a URL is a Google Spreadsheet link, which needs a `gid` per tab. */
export function isGoogleSheetUrl(publishedUrl: string): boolean {
  try {
    const url = new URL(publishedUrl.trim())
    return (
      url.hostname === 'docs.google.com' &&
      GOOGLE_SHEETS_PATH.test(url.pathname)
    )
  } catch {
    return false
  }
}

/**
 * Convert one public Google Spreadsheet share link into the worksheet CSV
 * export endpoint. Non-Google URLs are returned unchanged so fixtures and
 * explicitly published feeds continue to work.
 *
 * `export` is used rather than `gviz/tq` because `gviz` infers a single type per
 * column and returns an empty cell for every value that disagrees with it — a
 * text title in a mostly numeric column, or a header above numeric data, is
 * silently destroyed. `export` returns the displayed cell text verbatim and
 * answers 400 for an unknown worksheet instead of quietly serving the first one.
 */
export function resolveFeedUrl(source: FeedSource): string {
  const configuredUrl = source.publishedUrl.trim()
  if (!configuredUrl || source.format !== 'csv') {
    return configuredUrl
  }

  let url: URL
  try {
    url = new URL(configuredUrl)
  } catch {
    return configuredUrl
  }

  if (url.hostname !== 'docs.google.com') {
    return configuredUrl
  }

  const match = GOOGLE_SHEETS_PATH.exec(url.pathname)
  const spreadsheetId = match?.[1]
  if (!spreadsheetId || spreadsheetId === 'e') {
    return configuredUrl
  }

  const feedUrl = new URL(
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export`,
  )
  feedUrl.searchParams.set('format', 'csv')
  if (source.gid) {
    feedUrl.searchParams.set('gid', source.gid)
  }
  if (source.range) {
    feedUrl.searchParams.set('range', source.range)
  }
  return feedUrl.toString()
}
