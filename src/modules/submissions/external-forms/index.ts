export type {
  SubmitAdapter,
  SubmitAdapterKind,
  SubmitError,
  SubmitErrorKind,
  SubmitPayload,
  SubmitResult,
} from './types.ts'
export {
  SUBMIT_EMAIL_ENDPOINT_ENV,
  SUBMIT_EMAIL_BODY_TEMPLATE_ENV,
  SUBMIT_EMAIL_RECIPIENT_ENV,
  SUBMIT_EMAIL_SUBJECT_ENV,
  SUBMIT_REDIRECT_URL_ENV,
  resolveSubmitConfig,
  type EnvRecord,
  type SubmitEnvConfig,
} from './config.ts'
export {
  createEmailServiceAdapter,
  type EmailServiceAdapterOptions,
  type FetchLike,
} from './email-adapter.ts'
export {
  createRedirectAdapter,
  type NavigateLike,
  type RedirectAdapterOptions,
} from './redirect-adapter.ts'
export {
  createMailAppAdapter,
  DEFAULT_MAIL_BODY_TEMPLATE,
  DEFAULT_MAIL_SUBJECT,
  renderMailTemplate,
  type MailAppAdapterOptions,
  type MailAppNavigate,
} from './mail-app-adapter.ts'
export { isHttpsUrl } from './https.ts'
export { normalizePayload } from './payload.ts'
export {
  defaultContactFields,
  type FormFieldKind,
  type FormFieldSpec,
} from './fields.ts'
export {
  emptyValues,
  validateFormFields,
  valuesToPayload,
  type FieldErrors,
  type FormValues,
} from './validate-form.ts'
export {
  createConfiguredSubmitAdapter,
  readAdapterKind,
} from './resolve-adapter.ts'
export { ExternalForm, type ExternalFormProps } from './ExternalForm.tsx'
export { ContactFormModule } from './ContactFormModule.tsx'
