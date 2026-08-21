import { isHttpsUrl } from './https.ts'
import { normalizePayload } from './payload.ts'
import type { SubmitAdapter, SubmitPayload, SubmitResult } from './types.ts'

export type FetchLike = (
  input: string,
  init?: {
    method?: string
    headers?: Record<string, string>
    body?: string
  },
) => Promise<{ ok: boolean; status: number }>

export type EmailServiceAdapterOptions = {
  endpoint: string
  fetchImpl?: FetchLike
}

/**
 * POST the payload to an external form/email endpoint (Formspree, Getform,
 * Web3Forms, and similar). Never throws. Does not write local storage.
 */
export function createEmailServiceAdapter(
  options: EmailServiceAdapterOptions,
): SubmitAdapter {
  const endpoint = options.endpoint.trim()

  return {
    kind: 'email-service',
    async submit(payload: SubmitPayload): Promise<SubmitResult> {
      if (!endpoint) {
        return fail('config', 'No email-service endpoint configured')
      }
      if (!isHttpsUrl(endpoint)) {
        return fail('config', 'Email-service endpoint must be an https URL')
      }

      const fetchImpl = options.fetchImpl ?? resolveGlobalFetch()
      if (!fetchImpl) {
        return fail('network', 'No fetch implementation available')
      }

      const body = new URLSearchParams(normalizePayload(payload)).toString()

      let response: Awaited<ReturnType<FetchLike>>
      try {
        response = await fetchImpl(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            Accept: 'application/json',
          },
          body,
        })
      } catch (error) {
        return fail('network', messageOf(error, 'Email-service request failed'))
      }

      if (!response.ok) {
        return fail('http', `Email service responded with status ${response.status}`)
      }

      return { ok: true, kind: 'email-service' }
    },
  }
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

function fail(
  kind: 'config' | 'network' | 'http',
  message: string,
): SubmitResult {
  return { ok: false, kind: 'email-service', error: { kind, message } }
}
