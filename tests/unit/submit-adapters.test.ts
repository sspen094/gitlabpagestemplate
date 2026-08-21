import { describe, expect, it, vi } from 'vitest'
import {
  SUBMIT_EMAIL_ENDPOINT_ENV,
  SUBMIT_EMAIL_BODY_TEMPLATE_ENV,
  SUBMIT_EMAIL_RECIPIENT_ENV,
  SUBMIT_EMAIL_SUBJECT_ENV,
  SUBMIT_REDIRECT_URL_ENV,
  createEmailServiceAdapter,
  createMailAppAdapter,
  createRedirectAdapter,
  isHttpsUrl,
  resolveSubmitConfig,
  renderMailTemplate,
  type FetchLike,
  type SubmitAdapter,
} from '../../src/modules/submissions/external-forms/index.ts'

const EMAIL_ENDPOINT = 'https://form.example.test/submit'
const EMAIL_RECIPIENT = 'hello@example.test'
const REDIRECT_URL = 'https://forms.example.test/contact'

function stubFetch(response: {
  ok?: boolean
  status?: number
  throwOnFetch?: boolean
}): FetchLike {
  return async () => {
    if (response.throwOnFetch) {
      throw new Error('network down')
    }
    return {
      ok: response.ok ?? true,
      status: response.status ?? 200,
    }
  }
}

function adapterKeys(adapter: SubmitAdapter): string[] {
  return Object.keys(adapter).sort()
}

/** Decode `mailto:` params the way a mail client does — `+` stays literal. */
function readMailParams(target: string): Record<string, string> {
  const query = target.slice(target.indexOf('?') + 1)
  const params: Record<string, string> = {}
  for (const pair of query.split('&')) {
    const [key, value = ''] = pair.split('=')
    params[key] = decodeURIComponent(value)
  }
  return params
}

function spyBrowserStorage(): { setItem: ReturnType<typeof vi.fn>; restore: () => void } {
  const setItem = vi.fn()
  const storage = {
    setItem,
    getItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  }
  vi.stubGlobal('localStorage', storage)
  vi.stubGlobal('sessionStorage', storage)
  return {
    setItem,
    restore: () => {
      vi.unstubAllGlobals()
    },
  }
}

describe('submit adapter contract', () => {
  it('exposes only kind + submit — no persist/save path', () => {
    const email = createEmailServiceAdapter({
      endpoint: EMAIL_ENDPOINT,
      fetchImpl: stubFetch({}),
    })
    const redirect = createRedirectAdapter({
      url: REDIRECT_URL,
      navigate: () => undefined,
    })
    const mailApp = createMailAppAdapter({
      recipient: EMAIL_RECIPIENT,
      navigate: () => undefined,
    })

    expect(adapterKeys(email)).toEqual(['kind', 'submit'])
    expect(adapterKeys(redirect)).toEqual(['kind', 'submit'])
    expect(adapterKeys(mailApp)).toEqual(['kind', 'submit'])
    expect(email.kind).toBe('email-service')
    expect(redirect.kind).toBe('redirect')
    expect(mailApp.kind).toBe('mail-app')
    expect('persist' in email).toBe(false)
    expect('save' in email).toBe(false)
    expect('persist' in redirect).toBe(false)
    expect('save' in redirect).toBe(false)
    expect('persist' in mailApp).toBe(false)
    expect('save' in mailApp).toBe(false)
  })
})

describe('resolveSubmitConfig', () => {
  it('reads public endpoint URLs from env and ignores secrets', () => {
    expect(SUBMIT_EMAIL_ENDPOINT_ENV).toBe('VITE_SUBMIT_EMAIL_ENDPOINT')
    expect(SUBMIT_EMAIL_RECIPIENT_ENV).toBe('VITE_SUBMIT_EMAIL_RECIPIENT')
    expect(SUBMIT_EMAIL_SUBJECT_ENV).toBe('VITE_SUBMIT_EMAIL_SUBJECT')
    expect(SUBMIT_EMAIL_BODY_TEMPLATE_ENV).toBe(
      'VITE_SUBMIT_EMAIL_BODY_TEMPLATE',
    )
    expect(SUBMIT_REDIRECT_URL_ENV).toBe('VITE_SUBMIT_REDIRECT_URL')

    const config = resolveSubmitConfig({
      VITE_SUBMIT_EMAIL_ENDPOINT: ` ${EMAIL_ENDPOINT} `,
      VITE_SUBMIT_EMAIL_RECIPIENT: ` ${EMAIL_RECIPIENT} `,
      VITE_SUBMIT_EMAIL_SUBJECT: ' Contact from {name} ',
      VITE_SUBMIT_EMAIL_BODY_TEMPLATE:
        ' Dear Website Owner:\\n{message}\\nFrom {name} ({email}) ',
      VITE_SUBMIT_REDIRECT_URL: `${REDIRECT_URL}`,
      FORMSPREE_SECRET: 'must-not-be-read',
      VITE_SUBMIT_API_KEY: 'must-not-be-read',
    })

    expect(config).toEqual({
      emailEndpoint: EMAIL_ENDPOINT,
      emailRecipient: EMAIL_RECIPIENT,
      emailSubject: 'Contact from {name}',
      emailBodyTemplate:
        'Dear Website Owner:\\n{message}\\nFrom {name} ({email})',
      redirectUrl: REDIRECT_URL,
    })
  })

  it('treats missing values as empty strings', () => {
    expect(resolveSubmitConfig({})).toEqual({
      emailEndpoint: '',
      emailRecipient: '',
      emailSubject: '',
      emailBodyTemplate: '',
      redirectUrl: '',
    })
  })
})

describe('isHttpsUrl', () => {
  it('accepts https and rejects everything else', () => {
    expect(isHttpsUrl(EMAIL_ENDPOINT)).toBe(true)
    expect(isHttpsUrl('http://form.example.test/submit')).toBe(false)
    expect(isHttpsUrl('javascript:alert(1)')).toBe(false)
    expect(isHttpsUrl('not-a-url')).toBe(false)
  })
})

describe('email-service adapter', () => {
  it('POSTs form fields to the configured https endpoint and does not store them', async () => {
    const storage = spyBrowserStorage()
    const calls: Array<{ url: string; init?: Parameters<FetchLike>[1] }> = []
    const fetchImpl: FetchLike = async (url, init) => {
      calls.push({ url, init })
      return { ok: true, status: 200 }
    }

    const adapter = createEmailServiceAdapter({
      endpoint: EMAIL_ENDPOINT,
      fetchImpl,
    })
    const result = await adapter.submit({
      name: 'Ada',
      email: 'ada@example.test',
      message: 'Hello',
    })

    expect(result).toEqual({ ok: true, kind: 'email-service' })
    expect(calls).toHaveLength(1)
    expect(calls[0]?.url).toBe(EMAIL_ENDPOINT)
    expect(calls[0]?.init?.method).toBe('POST')
    expect(calls[0]?.init?.headers?.['Content-Type']).toContain(
      'application/x-www-form-urlencoded',
    )
    const body = new URLSearchParams(calls[0]?.init?.body ?? '')
    expect(body.get('name')).toBe('Ada')
    expect(body.get('email')).toBe('ada@example.test')
    expect(body.get('message')).toBe('Hello')
    expect(storage.setItem).not.toHaveBeenCalled()
    storage.restore()
  })

  it('fails gracefully when the endpoint is missing or not https', async () => {
    const missing = await createEmailServiceAdapter({
      endpoint: '',
      fetchImpl: stubFetch({}),
    }).submit({ email: 'a@b.c' })
    expect(missing.ok).toBe(false)
    if (!missing.ok) {
      expect(missing.error.kind).toBe('config')
    }

    const insecure = await createEmailServiceAdapter({
      endpoint: 'http://form.example.test/submit',
      fetchImpl: stubFetch({}),
    }).submit({ email: 'a@b.c' })
    expect(insecure.ok).toBe(false)
    if (!insecure.ok) {
      expect(insecure.error.kind).toBe('config')
    }
  })

  it('maps network throws and non-2xx responses to failure without throwing', async () => {
    const down = await createEmailServiceAdapter({
      endpoint: EMAIL_ENDPOINT,
      fetchImpl: stubFetch({ throwOnFetch: true }),
    }).submit({ email: 'a@b.c' })
    expect(down.ok).toBe(false)
    if (!down.ok) {
      expect(down.error.kind).toBe('network')
    }

    const http = await createEmailServiceAdapter({
      endpoint: EMAIL_ENDPOINT,
      fetchImpl: stubFetch({ ok: false, status: 500 }),
    }).submit({ email: 'a@b.c' })
    expect(http.ok).toBe(false)
    if (!http.ok) {
      expect(http.error.kind).toBe('http')
      expect(http.error.message).toContain('500')
    }
  })
})

describe('local mail-app adapter', () => {
  it('opens a mailto handoff with encoded form fields and no storage', async () => {
    const storage = spyBrowserStorage()
    const destinations: string[] = []
    const adapter = createMailAppAdapter({
      recipient: EMAIL_RECIPIENT,
      subject: 'Contact request from {name}',
      bodyTemplate:
        'Dear Website Owner:\\n{message}\\nFrom {name} ({email})',
      navigate: (url) => destinations.push(url),
    })

    const result = await adapter.submit({
      name: 'Ada Lovelace',
      email: 'ada@example.test',
      message: 'Hello & goodbye',
    })

    expect(result).toEqual({ ok: true, kind: 'mail-app' })
    expect(destinations).toHaveLength(1)
    const target = destinations[0] ?? ''
    expect(target.startsWith(`mailto:${EMAIL_RECIPIENT}?`)).toBe(true)

    const params = readMailParams(target)
    expect(params.subject).toBe('Contact request from Ada Lovelace')
    expect(params.body).toBe(
      'Dear Website Owner:\nHello & goodbye\nFrom Ada Lovelace (ada@example.test)',
    )
    expect(storage.setItem).not.toHaveBeenCalled()
    storage.restore()
  })

  it('percent-encodes spaces so mail clients do not show a plus sign', async () => {
    const destinations: string[] = []
    await createMailAppAdapter({
      recipient: EMAIL_RECIPIENT,
      subject: 'Website contact',
      bodyTemplate: '{message}',
      navigate: (url) => destinations.push(url),
    }).submit({ message: 'Two words' })

    const target = destinations[0] ?? ''
    expect(target).toContain('subject=Website%20contact')
    expect(target).toContain('body=Two%20words')
    expect(target).not.toContain('+')
  })

  it('replaces configured placeholders and removes unknown values', () => {
    expect(
      renderMailTemplate('From {name}: {message} {unknown}', {
        name: ' Ada ',
        message: 'Hello',
      }),
    ).toBe('From Ada: Hello ')
  })

  it('opens a composer without a recipient when none is configured', async () => {
    const destinations: string[] = []
    const result = await createMailAppAdapter({
      recipient: '',
      navigate: (url) => destinations.push(url),
    }).submit({ message: 'Hello' })

    expect(result).toEqual({ ok: true, kind: 'mail-app' })
    expect(destinations[0]?.startsWith('mailto:?')).toBe(true)
  })

  it('fails gracefully when the platform handoff throws', async () => {
    const result = await createMailAppAdapter({
      navigate: () => {
        throw new Error('blocked')
      },
    }).submit({ message: 'Hello' })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.kind).toBe('network')
    }
  })
})

describe('redirect adapter', () => {
  it('navigates to the external https URL with payload as query params', async () => {
    const storage = spyBrowserStorage()
    const destinations: string[] = []
    const adapter = createRedirectAdapter({
      url: `${REDIRECT_URL}?ref=site`,
      navigate: (url) => {
        destinations.push(url)
      },
    })

    const result = await adapter.submit({
      email: 'ada@example.test',
      name: 'Ada',
    })

    expect(result).toEqual({ ok: true, kind: 'redirect' })
    expect(destinations).toHaveLength(1)
    const handedOff = new URL(destinations[0] ?? '')
    expect(handedOff.origin + handedOff.pathname).toBe(REDIRECT_URL)
    expect(handedOff.searchParams.get('ref')).toBe('site')
    expect(handedOff.searchParams.get('email')).toBe('ada@example.test')
    expect(handedOff.searchParams.get('name')).toBe('Ada')
    expect(storage.setItem).not.toHaveBeenCalled()
    storage.restore()
  })

  it('fails gracefully when the redirect URL is missing or not https', async () => {
    const missing = await createRedirectAdapter({
      url: '',
      navigate: () => undefined,
    }).submit({ email: 'a@b.c' })
    expect(missing.ok).toBe(false)
    if (!missing.ok) {
      expect(missing.error.kind).toBe('config')
    }

    const insecure = await createRedirectAdapter({
      url: 'http://forms.example.test/contact',
      navigate: () => undefined,
    }).submit({ email: 'a@b.c' })
    expect(insecure.ok).toBe(false)
    if (!insecure.ok) {
      expect(insecure.error.kind).toBe('config')
    }
  })
})
