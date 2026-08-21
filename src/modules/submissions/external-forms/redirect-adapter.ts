import { isHttpsUrl } from './https.ts'
import { normalizePayload } from './payload.ts'
import type { SubmitAdapter, SubmitPayload, SubmitResult } from './types.ts'

export type NavigateLike = (url: string) => void

export type RedirectAdapterOptions = {
  url: string
  navigate?: NavigateLike
}

/**
 * Hand the visitor off to an external hosted form or workflow. Optional
 * payload fields are appended as query parameters for prefill. Never writes
 * the submission on this origin.
 */
export function createRedirectAdapter(
  options: RedirectAdapterOptions,
): SubmitAdapter {
  const configured = options.url.trim()

  return {
    kind: 'redirect',
    async submit(payload: SubmitPayload): Promise<SubmitResult> {
      if (!configured) {
        return fail('config', 'No redirect URL configured')
      }
      if (!isHttpsUrl(configured)) {
        return fail('config', 'Redirect URL must be an https URL')
      }

      let target: URL
      try {
        target = new URL(configured)
      } catch {
        return fail('config', 'Redirect URL is not a valid address')
      }

      const fields = normalizePayload(payload)
      for (const [key, value] of Object.entries(fields)) {
        if (value) {
          target.searchParams.set(key, value)
        }
      }

      const navigate = options.navigate ?? defaultNavigate()
      if (!navigate) {
        return fail('network', 'No navigation implementation available')
      }

      try {
        navigate(target.toString())
      } catch (error) {
        return fail(
          'network',
          error instanceof Error && error.message
            ? error.message
            : 'Redirect navigation failed',
        )
      }

      return { ok: true, kind: 'redirect' }
    },
  }
}

function defaultNavigate(): NavigateLike | undefined {
  const location = (
    globalThis as { location?: { assign?: (url: string) => void } }
  ).location
  const assign = location?.assign
  if (typeof assign !== 'function') {
    return undefined
  }
  return (url: string) => {
    assign.call(location, url)
  }
}

function fail(
  kind: 'config' | 'network' | 'http',
  message: string,
): SubmitResult {
  return { ok: false, kind: 'redirect', error: { kind, message } }
}
