import { ModuleFrame } from './ModuleFrame.tsx'
import { readCopy, readString } from './copy.ts'
import { ModuleHeading } from './heading-level.tsx'
import type { ModuleComponentProps } from './types.ts'

/**
 * Label/value list for the Contact/Info schema. `type` decides whether the
 * value becomes a `mailto:`, `tel:`, or web link; anything else stays plain
 * text, so a sheet cell can never turn into an arbitrary link target.
 */
export function ContactInfoModule({ instance }: ModuleComponentProps) {
  const title = readCopy(instance.config.titleKey, instance.config.title)
  const entries = Array.isArray(instance.config.entries)
    ? instance.config.entries
    : []
  const headingId = title ? `${instance.id}-title` : `${instance.id}-contact`

  return (
    <ModuleFrame
      instance={instance}
      className="module-contact"
      labelledBy={headingId}
    >
      <ModuleHeading id={headingId}>{title || 'Contact'}</ModuleHeading>
      <dl className="module-contact__list">
        {entries.map((entry, index) => {
          if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
            return null
          }
          const item = entry as Record<string, unknown>
          const label = readCopy(item.labelKey, item.label)
          const value = readCopy(item.valueKey, item.value)
          if (!label || !value) {
            return null
          }
          const key = readString(item.id) || `${instance.id}-contact-${index}`

          return (
            <div key={key} className="module-contact__entry">
              <dt>{label}</dt>
              <dd>{renderValue(readString(item.type), value)}</dd>
            </div>
          )
        })}
      </dl>
    </ModuleFrame>
  )
}

function renderValue(type: string, value: string) {
  const href = hrefFor(type, value)
  return href ? <a href={href}>{value}</a> : value
}

function hrefFor(type: string, value: string): string | undefined {
  if (type === 'email') {
    return `mailto:${value}`
  }
  if (type === 'phone') {
    return `tel:${value.replace(/[^\d+]/g, '')}`
  }
  if (type === 'url') {
    return /^https?:\/\//i.test(value) ? value : `https://${value}`
  }
  return undefined
}
