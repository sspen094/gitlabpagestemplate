export type EnvRecord = Record<string, string | undefined>

export const SUBMIT_EMAIL_ENDPOINT_ENV = 'VITE_SUBMIT_EMAIL_ENDPOINT'
export const SUBMIT_EMAIL_RECIPIENT_ENV = 'VITE_SUBMIT_EMAIL_RECIPIENT'
export const SUBMIT_EMAIL_SUBJECT_ENV = 'VITE_SUBMIT_EMAIL_SUBJECT'
export const SUBMIT_EMAIL_BODY_TEMPLATE_ENV =
  'VITE_SUBMIT_EMAIL_BODY_TEMPLATE'
export const SUBMIT_REDIRECT_URL_ENV = 'VITE_SUBMIT_REDIRECT_URL'

export type SubmitEnvConfig = {
  emailEndpoint: string
  emailRecipient: string
  emailSubject: string
  emailBodyTemplate: string
  redirectUrl: string
}

/**
 * Public endpoint URLs only. Provider API keys are never read here — the
 * email-service adapter posts to a published form endpoint, and the redirect
 * adapter hands off to a hosted workflow URL.
 */
export function resolveSubmitConfig(
  env: EnvRecord = readImportMetaEnv(),
): SubmitEnvConfig {
  return {
    emailEndpoint: trimEnv(env[SUBMIT_EMAIL_ENDPOINT_ENV]),
    emailRecipient: trimEnv(env[SUBMIT_EMAIL_RECIPIENT_ENV]),
    emailSubject: trimEnv(env[SUBMIT_EMAIL_SUBJECT_ENV]),
    emailBodyTemplate: trimEnv(env[SUBMIT_EMAIL_BODY_TEMPLATE_ENV]),
    redirectUrl: trimEnv(env[SUBMIT_REDIRECT_URL_ENV]),
  }
}

function trimEnv(value: string | undefined): string {
  return typeof value === 'string' ? value.trim() : ''
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
