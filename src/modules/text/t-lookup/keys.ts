const MIN_GROUPING_SEGMENTS = 2
const FULL_KEY_SEGMENTS = 3

/** True when `key` has at least `[page].[section]` (dot-separated). */
export function isGroupedTextKey(key: string): boolean {
  return splitTextKey(key).length >= MIN_GROUPING_SEGMENTS
}

/** True when `key` has `[page].[section].[item]` (or deeper). */
export function isFullTextKey(key: string): boolean {
  return splitTextKey(key).length >= FULL_KEY_SEGMENTS
}

export function splitTextKey(key: string): string[] {
  return key
    .trim()
    .split('.')
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0)
}

export function normalizeTextKey(key: string): string {
  return splitTextKey(key).join('.')
}
