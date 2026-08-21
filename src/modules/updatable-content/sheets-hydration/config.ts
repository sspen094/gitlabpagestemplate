import { isGoogleSheetUrl } from '../../data-sources/feed-client/index.ts'
import type { SheetMapping } from './mapping.ts'
import { sheetMappings } from './sheet-mappings.ts'

/**
 * Apply one public spreadsheet URL plus its per-worksheet ids to every
 * committed mapping. Worksheet names identify the parent module in config and
 * docs; the `gid` addresses the tab in the request. Both come from Vite env so
 * the committed template stays spreadsheet-agnostic and carries no credentials.
 */

export type EnvRecord = Record<string, string | undefined>

export const GOOGLE_SHEETS_URL_ENV = 'VITE_GOOGLE_SHEETS_URL'
export const GOOGLE_SHEETS_GIDS_ENV = 'VITE_GOOGLE_SHEETS_GIDS'

/** Parse `demo-text:0,demo-cards:12345` into `{ 'demo-text': '0', ... }`. */
export function parseGidMap(raw: string | undefined): Record<string, string> {
  const map: Record<string, string> = {}
  if (typeof raw !== 'string') {
    return map
  }

  for (const pair of raw.split(',')) {
    const separator = pair.lastIndexOf(':')
    if (separator <= 0) {
      continue
    }
    const tab = pair.slice(0, separator).trim()
    const gid = pair.slice(separator + 1).trim()
    if (tab && /^\d+$/.test(gid)) {
      map[tab] = gid
    }
  }

  return map
}

export function resolveMappings(
  env: EnvRecord = readImportMetaEnv(),
  base: readonly SheetMapping[] = sheetMappings,
): SheetMapping[] {
  const configuredUrl = env[GOOGLE_SHEETS_URL_ENV]
  const spreadsheetUrl =
    typeof configuredUrl === 'string' ? configuredUrl.trim() : ''
  const gids = parseGidMap(env[GOOGLE_SHEETS_GIDS_ENV])

  return base.map((mapping) => {
    const publishedUrl = spreadsheetUrl || mapping.publishedUrl
    const gid = gids[mapping.tab ?? mapping.id] ?? mapping.gid

    // A Google worksheet can only be addressed by gid. Without one the request
    // would silently return the first tab, so keep the module on its shell.
    if (!gid && isGoogleSheetUrl(publishedUrl)) {
      return { ...mapping, publishedUrl: '' }
    }

    return { ...mapping, publishedUrl, gid }
  })
}

/**
 * Read the literal `import.meta.env`: Vite only injects the env object for that
 * exact expression, so destructuring `import.meta` first leaves it undefined.
 */
function readImportMetaEnv(): EnvRecord {
  try {
    return (import.meta.env ?? {}) as unknown as EnvRecord
  } catch {
    return {}
  }
}
