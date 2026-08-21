import type { FormFieldSpec } from './fields.ts'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type FormValues = Record<string, string>
/** Map of field id → `t()` key for the error. */
export type FieldErrors = Record<string, string>

export function emptyValues(fields: readonly FormFieldSpec[]): FormValues {
  const values: FormValues = {}
  for (const field of fields) {
    values[field.id] = ''
  }
  return values
}

export function validateFormFields(
  fields: readonly FormFieldSpec[],
  values: FormValues,
): FieldErrors {
  const errors: FieldErrors = {}
  for (const field of fields) {
    const value = (values[field.id] ?? '').trim()
    if (field.required && !value) {
      errors[field.id] = 'contact.form.required'
      continue
    }
    if (field.kind === 'email' && value && !EMAIL_PATTERN.test(value)) {
      errors[field.id] = 'contact.form.invalidEmail'
    }
  }
  return errors
}

export function valuesToPayload(values: FormValues): Record<string, string> {
  const payload: Record<string, string> = {}
  for (const [key, value] of Object.entries(values)) {
    payload[key] = value.trim()
  }
  return payload
}
