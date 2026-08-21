/**
 * Safe fallback states for updatable content. Every non-render outcome maps to
 * a `t()` key so the existing module fallback path (Slice 02) can show
 * developer-authored copy instead of ever crashing the page.
 */

export type FallbackReason = 'fetch-failed' | 'empty' | 'malformed' | 'unmapped'

export type FallbackState = {
  kind: 'fallback'
  reason: FallbackReason
  messageKey: string
}

const REASON_KEYS: Record<FallbackReason, string> = {
  'fetch-failed': 'updatable.fallback.unavailable',
  empty: 'updatable.fallback.empty',
  malformed: 'updatable.fallback.malformed',
  unmapped: 'updatable.fallback.unavailable',
}

export function toFallback(reason: FallbackReason): FallbackState {
  return { kind: 'fallback', reason, messageKey: REASON_KEYS[reason] }
}
