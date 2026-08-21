import { resolveSubmitConfig, type SubmitEnvConfig } from './config.ts'
import { createEmailServiceAdapter } from './email-adapter.ts'
import { createMailAppAdapter } from './mail-app-adapter.ts'
import { createRedirectAdapter } from './redirect-adapter.ts'
import type { SubmitAdapter, SubmitAdapterKind } from './types.ts'

export function readAdapterKind(value: unknown): SubmitAdapterKind {
  if (value === 'redirect' || value === 'mail-app') {
    return value
  }
  return 'email-service'
}

/**
 * Build the adapter selected by page config. Email-service mode prefers an
 * admin-configured endpoint and otherwise uses the platform mail application.
 */
export function createConfiguredSubmitAdapter(
  kind: SubmitAdapterKind,
  config: SubmitEnvConfig = resolveSubmitConfig(),
): SubmitAdapter {
  if (kind === 'redirect') {
    return createRedirectAdapter({ url: config.redirectUrl })
  }
  if (kind === 'mail-app' || !config.emailEndpoint) {
    return createMailAppAdapter({
      recipient: config.emailRecipient,
      subject: config.emailSubject,
      bodyTemplate: config.emailBodyTemplate,
    })
  }
  return createEmailServiceAdapter({ endpoint: config.emailEndpoint })
}
