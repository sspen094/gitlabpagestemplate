import type { SubmitPayload } from './types.ts'

/** Keep only own string fields. Adapters never persist the result. */
export function normalizePayload(payload: SubmitPayload): Record<string, string> {
  const out: Record<string, string> = {}
  if (!payload || typeof payload !== 'object') {
    return out
  }
  for (const [key, value] of Object.entries(payload)) {
    if (typeof value === 'string') {
      out[key] = value
    }
  }
  return out
}
