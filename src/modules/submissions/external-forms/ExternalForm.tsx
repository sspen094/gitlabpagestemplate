import { useId, useState, type FormEvent } from 'react'
import { ModuleHeading } from '../../pages/modular-pages/heading-level.tsx'
import { t } from '../../text/t-lookup/index.ts'
import type { FormFieldSpec } from './fields.ts'
import type { SubmitAdapter } from './types.ts'
import {
  emptyValues,
  validateFormFields,
  valuesToPayload,
  type FieldErrors,
  type FormValues,
} from './validate-form.ts'

export type ExternalFormProps = {
  id: string
  title: string
  fields: readonly FormFieldSpec[]
  adapter: SubmitAdapter
  submitLabel: string
  sendingLabel: string
  successMessage: string
  handoffMessage: string
  errorMessage: string
  configErrorMessage: string
}

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'success'; handoff: boolean }
  | { kind: 'error'; config: boolean }

export function ExternalForm({
  id,
  title,
  fields,
  adapter,
  submitLabel,
  sendingLabel,
  successMessage,
  handoffMessage,
  errorMessage,
  configErrorMessage,
}: ExternalFormProps) {
  const reactId = useId()
  const headingId = `${id}-title`
  const statusId = `${id}-status`
  const [values, setValues] = useState<FormValues>(() => emptyValues(fields))
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status.kind === 'sending') {
      return
    }

    const nextErrors = validateFormFields(fields, values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setStatus({ kind: 'idle' })
      return
    }

    setStatus({ kind: 'sending' })
    const result = await adapter.submit(valuesToPayload(values))
    if (result.ok) {
      setValues(emptyValues(fields))
      setStatus({
        kind: 'success',
        handoff: result.kind === 'mail-app' || result.kind === 'redirect',
      })
      return
    }
    setStatus({ kind: 'error', config: result.error.kind === 'config' })
  }

  const sending = status.kind === 'sending'

  return (
    <form
      className="module-form__form"
      noValidate
      onSubmit={onSubmit}
      aria-describedby={
        status.kind === 'success' || status.kind === 'error' ? statusId : undefined
      }
    >
      {title ? <ModuleHeading id={headingId}>{title}</ModuleHeading> : null}
      {fields.map((field) => {
        const fieldId = `${id}-${field.id}-${reactId}`
        const errorId = `${fieldId}-error`
        const errorKey = errors[field.id]
        const invalid = Boolean(errorKey)
        const label = t(field.labelKey)
        const describedBy = invalid ? errorId : undefined

        return (
          <div key={field.id} className="module-form__field">
            <label htmlFor={fieldId}>{label}</label>
            {field.kind === 'textarea' ? (
              <textarea
                id={fieldId}
                name={field.id}
                value={values[field.id] ?? ''}
                required={field.required}
                aria-required={field.required || undefined}
                aria-invalid={invalid || undefined}
                aria-describedby={describedBy}
                disabled={sending}
                rows={5}
                onChange={(event) => {
                  setValues((current) => ({
                    ...current,
                    [field.id]: event.target.value,
                  }))
                }}
              />
            ) : (
              <input
                id={fieldId}
                name={field.id}
                type={field.kind === 'email' ? 'email' : 'text'}
                value={values[field.id] ?? ''}
                required={field.required}
                autoComplete={field.id === 'name' ? 'name' : field.id}
                aria-required={field.required || undefined}
                aria-invalid={invalid || undefined}
                aria-describedby={describedBy}
                disabled={sending}
                onChange={(event) => {
                  setValues((current) => ({
                    ...current,
                    [field.id]: event.target.value,
                  }))
                }}
              />
            )}
            {invalid ? (
              <p id={errorId} className="module-form__field-error">
                {t(errorKey)}
              </p>
            ) : null}
          </div>
        )
      })}
      <div
        id={statusId}
        className="module-form__status"
        role={status.kind === 'error' ? 'alert' : 'status'}
        aria-live={status.kind === 'error' ? 'assertive' : 'polite'}
      >
        {status.kind === 'success'
          ? status.handoff
            ? handoffMessage
            : successMessage
          : null}
        {status.kind === 'error'
          ? status.config
            ? configErrorMessage
            : errorMessage
          : null}
      </div>
      <button type="submit" className="module-form__submit" disabled={sending}>
        {sending ? sendingLabel : submitLabel}
      </button>
    </form>
  )
}
