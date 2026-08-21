import { useMemo } from 'react'
import { ModuleFrame } from '../../pages/modular-pages/ModuleFrame.tsx'
import { readCopy, readString } from '../../pages/modular-pages/copy.ts'
import type { ModuleComponentProps } from '../../pages/modular-pages/types.ts'
import { t } from '../../text/t-lookup/index.ts'
import { ExternalForm } from './ExternalForm.tsx'
import { defaultContactFields } from './fields.ts'
import {
  createConfiguredSubmitAdapter,
  readAdapterKind,
} from './resolve-adapter.ts'

/**
 * Example public form. Submits through an external adapter only — never
 * stores the payload on this origin.
 */
export function ContactFormModule({ instance }: ModuleComponentProps) {
  const title = readCopy(instance.config.titleKey, instance.config.title)
  const headingId = `${instance.id}-title`
  const adapterKind = readAdapterKind(instance.config.adapter)
  const adapter = useMemo(
    () => createConfiguredSubmitAdapter(adapterKind),
    [adapterKind],
  )
  const label =
    readString(instance.config.submitLabel) || t('contact.form.submit')

  return (
    <ModuleFrame
      instance={instance}
      className="module-form"
      labelledBy={title ? headingId : undefined}
      label={title ? undefined : t('contact.form.title')}
    >
      <ExternalForm
        id={instance.id}
        title={title}
        fields={defaultContactFields}
        adapter={adapter}
        submitLabel={label}
        sendingLabel={t('contact.form.sending')}
        successMessage={t('contact.form.success')}
        handoffMessage={t('contact.form.handoff')}
        errorMessage={t('contact.form.error')}
        configErrorMessage={t('contact.form.configError')}
      />
    </ModuleFrame>
  )
}
