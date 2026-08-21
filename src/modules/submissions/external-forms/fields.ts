export type FormFieldKind = 'text' | 'email' | 'textarea'

export type FormFieldSpec = {
  id: string
  kind: FormFieldKind
  labelKey: string
  required?: boolean
}

/** Default Contact example fields. Labels resolve through `t()`. */
export const defaultContactFields: readonly FormFieldSpec[] = [
  { id: 'name', kind: 'text', required: true, labelKey: 'contact.form.name' },
  { id: 'email', kind: 'email', required: true, labelKey: 'contact.form.email' },
  {
    id: 'message',
    kind: 'textarea',
    required: true,
    labelKey: 'contact.form.message',
  },
]
