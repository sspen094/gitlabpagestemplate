/**
 * External submit adapters (Slice 05). Forms post to an email service or
 * hand the visitor off to an external URL. There is no persist/save path.
 */

export type SubmitAdapterKind = 'email-service' | 'redirect' | 'mail-app'

/** String fields only — the site never stores this payload. */
export type SubmitPayload = Record<string, string>

export type SubmitErrorKind = 'config' | 'network' | 'http'

export type SubmitError = {
  kind: SubmitErrorKind
  message: string
}

export type SubmitResult =
  | { ok: true; kind: SubmitAdapterKind }
  | { ok: false; kind: SubmitAdapterKind; error: SubmitError }

export type SubmitAdapter = {
  readonly kind: SubmitAdapterKind
  submit(payload: SubmitPayload): Promise<SubmitResult>
}
