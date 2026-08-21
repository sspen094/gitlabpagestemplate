import { normalizePayload } from './payload.ts'
import type { SubmitAdapter, SubmitPayload, SubmitResult } from './types.ts'

export type MailAppNavigate = (url: string) => void

export type MailAppAdapterOptions = {
  recipient?: string
  subject?: string
  bodyTemplate?: string
  navigate?: MailAppNavigate
}

export const DEFAULT_MAIL_SUBJECT = 'Website contact'
export const DEFAULT_MAIL_BODY_TEMPLATE =
  'Dear Website Owner:\n{message}\nFrom {name} ({email})'

/**
 * Opens the platform's registered email application through `mailto:`.
 * The browser hands off the payload; this site never stores or sends it.
 */
export function createMailAppAdapter(
  options: MailAppAdapterOptions = {},
): SubmitAdapter {
  const recipient = normalizeRecipient(options.recipient)
  const subjectTemplate = normalizeTemplate(
    options.subject,
    DEFAULT_MAIL_SUBJECT,
  )
  const bodyTemplate = normalizeTemplate(
    options.bodyTemplate,
    DEFAULT_MAIL_BODY_TEMPLATE,
  )

  return {
    kind: 'mail-app',
    async submit(payload: SubmitPayload): Promise<SubmitResult> {
      const navigate = options.navigate ?? defaultNavigate()
      if (!navigate) {
        return fail('network', 'No local app handoff is available')
      }

      const fields = normalizePayload(payload)
      const subject = renderMailTemplate(subjectTemplate, fields)
      const body = renderMailTemplate(bodyTemplate, fields)
      const target = `mailto:${recipient}?${buildMailQuery({ subject, body })}`

      try {
        navigate(target)
      } catch (error) {
        return fail(
          'network',
          error instanceof Error && error.message
            ? error.message
            : 'Could not open the local mail application',
        )
      }

      return { ok: true, kind: 'mail-app' }
    },
  }
}

/**
 * Percent-encode `mailto:` parameters. Form encoding would turn spaces into
 * `+`, which mail clients show literally in the subject and body.
 */
function buildMailQuery(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')
}

function normalizeRecipient(value: string | undefined): string {
  const recipient = value?.trim() ?? ''
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient) ? recipient : ''
}

export function renderMailTemplate(
  template: string,
  fields: Record<string, string>,
): string {
  return template.replace(/\{([a-zA-Z0-9_-]+)\}/g, (_, key: string) =>
    (fields[key] ?? '').trim(),
  )
}

function normalizeTemplate(
  value: string | undefined,
  fallback: string,
): string {
  const template = value?.trim() || fallback
  return template.replace(/\\n/g, '\n')
}

function defaultNavigate(): MailAppNavigate | undefined {
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
  return { ok: false, kind: 'mail-app', error: { kind, message } }
}
