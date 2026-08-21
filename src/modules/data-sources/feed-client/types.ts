/**
 * Published-feed client contracts (Slice 04). The client reads a stable
 * published representation (CSV or JSON) of a Google Sheet — never the
 * spreadsheet UI. Callers receive a typed result and never see a thrown error.
 */

export type FeedFormat = 'csv' | 'json'

/** One parsed record: header/key → raw string cell value. */
export type FeedRow = Record<string, string>

/**
 * Where to read a feed. For a Google share link the worksheet is addressed by
 * `gid` (the `#gid=` value in the spreadsheet URL); `tab` stays as the human
 * name used in config, docs, and error messages.
 */
export type FeedSource = {
  publishedUrl: string
  format: FeedFormat
  tab?: string
  gid?: string
  range?: string
}

export type FeedErrorKind = 'network' | 'http' | 'parse' | 'empty'

export type FeedError = {
  kind: FeedErrorKind
  message: string
}

export type FeedResult =
  | { ok: true; rows: FeedRow[] }
  | { ok: false; error: FeedError }
