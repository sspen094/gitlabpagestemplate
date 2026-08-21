/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PageComposer } from '../../src/modules/pages/modular-pages/pipeline.tsx'
import {
  ExternalForm,
  createConfiguredSubmitAdapter,
  defaultContactFields,
  readAdapterKind,
  validateFormFields,
  type SubmitAdapter,
} from '../../src/modules/submissions/external-forms/index.ts'
import { defaultText } from '../../src/modules/text/t-lookup/text-config.ts'

afterEach(() => {
  cleanup()
})

function stubAdapter(
  result: Awaited<ReturnType<SubmitAdapter['submit']>> | 'throw',
): SubmitAdapter & { submit: ReturnType<typeof vi.fn> } {
  const submit = vi.fn(async () => {
    if (result === 'throw') {
      throw new Error('adapter must not throw')
    }
    return result
  })
  return { kind: 'email-service', submit }
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

function renderForm(adapter: SubmitAdapter) {
  return render(
    <ExternalForm
      id="contact-form"
      title={defaultText.contact.form.title}
      fields={defaultContactFields}
      adapter={adapter}
      submitLabel={defaultText.contact.form.submit}
      sendingLabel={defaultText.contact.form.sending}
      successMessage={defaultText.contact.form.success}
      handoffMessage={defaultText.contact.form.handoff}
      errorMessage={defaultText.contact.form.error}
      configErrorMessage={defaultText.contact.form.configError}
    />,
  )
}

function fillValid() {
  fireEvent.change(screen.getByLabelText('Name'), {
    target: { value: 'Ada' },
  })
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'ada@example.test' },
  })
  fireEvent.change(screen.getByLabelText('Message'), {
    target: { value: 'Hello' },
  })
}

describe('contact form validation', () => {
  it('maps required and invalid-email cases to t() keys', () => {
    expect(
      validateFormFields(defaultContactFields, {
        name: '',
        email: 'not-an-email',
        message: '  ',
      }),
    ).toEqual({
      name: 'contact.form.required',
      email: 'contact.form.invalidEmail',
      message: 'contact.form.required',
    })
  })

  it('does not call the adapter when fields are empty', () => {
    const adapter = stubAdapter({ ok: true, kind: 'email-service' })
    renderForm(adapter)
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))

    expect(adapter.submit).not.toHaveBeenCalled()
    expect(screen.getAllByText('This field is required.')).toHaveLength(3)
    expect(screen.getByLabelText('Name').getAttribute('aria-invalid')).toBe(
      'true',
    )
  })

  it('rejects an invalid email without submitting', () => {
    const adapter = stubAdapter({ ok: true, kind: 'email-service' })
    renderForm(adapter)
    fillValid()
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'ada-at-example' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))

    expect(adapter.submit).not.toHaveBeenCalled()
    expect(screen.getByText('Enter a valid email address.')).toBeTruthy()
  })
})

describe('contact form submit states', () => {
  it('posts trimmed fields to the adapter and shows success without storing them', async () => {
    const storage = spyBrowserStorage()
    const adapter = stubAdapter({ ok: true, kind: 'email-service' })
    renderForm(adapter)
    fillValid()
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))

    await waitFor(() => {
      expect(screen.getByText(defaultText.contact.form.success)).toBeTruthy()
    })
    expect(adapter.submit).toHaveBeenCalledTimes(1)
    expect(adapter.submit).toHaveBeenCalledWith({
      name: 'Ada',
      email: 'ada@example.test',
      message: 'Hello',
    })
    expect(storage.setItem).not.toHaveBeenCalled()
    expect((screen.getByLabelText('Name') as HTMLInputElement).value).toBe('')
    storage.restore()
  })

  it('shows a failure message when the adapter returns an error', async () => {
    const adapter = stubAdapter({
      ok: false,
      kind: 'email-service',
      error: { kind: 'http', message: '500' },
    })
    renderForm(adapter)
    fillValid()
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toBe(
        defaultText.contact.form.error,
      )
    })
  })

  it('shows handoff guidance when the local mail app opens', async () => {
    const adapter = stubAdapter({ ok: true, kind: 'mail-app' })
    renderForm(adapter)
    fillValid()
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))

    await waitFor(() => {
      expect(screen.getByText(defaultText.contact.form.handoff)).toBeTruthy()
    })
  })

  it('renders the configured Contact page module', () => {
    render(
      <PageComposer
        modules={[
          {
            id: 'contact-form',
            type: 'contact-form',
            mode: 'static',
            config: { titleKey: 'contact.form.title' },
          },
        ]}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Send a message' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Send' })).toBeTruthy()
  })
})

describe('contact form accessibility', () => {
  it('associates labels with controls and marks required fields', () => {
    renderForm(stubAdapter({ ok: true, kind: 'email-service' }))

    expect(screen.getByLabelText('Name').getAttribute('aria-required')).toBe(
      'true',
    )
    expect(screen.getByLabelText('Email').getAttribute('type')).toBe('email')
    expect(screen.getByLabelText('Message').tagName).toBe('TEXTAREA')
  })
})

describe('readAdapterKind', () => {
  it('defaults to email-service', () => {
    expect(readAdapterKind(undefined)).toBe('email-service')
    expect(readAdapterKind('redirect')).toBe('redirect')
    expect(readAdapterKind('mail-app')).toBe('mail-app')
  })

  it('uses the configured service and otherwise falls back to the mail app', () => {
    expect(
      createConfiguredSubmitAdapter('email-service', {
        emailEndpoint: 'https://form.example.test/submit',
        emailRecipient: 'hello@example.test',
        emailSubject: '',
        emailBodyTemplate: '',
        redirectUrl: '',
      }).kind,
    ).toBe('email-service')
    expect(
      createConfiguredSubmitAdapter('email-service', {
        emailEndpoint: '',
        emailRecipient: 'hello@example.test',
        emailSubject: '',
        emailBodyTemplate: '',
        redirectUrl: '',
      }).kind,
    ).toBe('mail-app')
  })
})
