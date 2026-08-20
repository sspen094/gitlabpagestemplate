import { formatMissingKey, type TextFallbackConfig } from './fallback.ts'
import { isFullTextKey, normalizeTextKey, splitTextKey } from './keys.ts'
import type { TextTree } from './text-config.ts'

/** Look up a key on a given tree. Missing or malformed keys return a fallback string. */
export function resolveText(
  tree: TextTree,
  key: string,
  fallback: TextFallbackConfig,
): string {
  const normalized = normalizeTextKey(key)
  const fallbackKey = normalized || key

  if (!isFullTextKey(normalized)) {
    return formatMissingKey(fallbackKey, fallback)
  }

  let node: unknown = tree
  for (const segment of splitTextKey(normalized)) {
    if (node === null || typeof node !== 'object' || !(segment in node)) {
      return formatMissingKey(normalized, fallback)
    }
    node = (node as Record<string, unknown>)[segment]
  }

  return typeof node === 'string'
    ? node
    : formatMissingKey(normalized, fallback)
}
