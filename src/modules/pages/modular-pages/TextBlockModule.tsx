import { ModuleFrame } from './ModuleFrame.tsx'
import { readCopy } from './copy.ts'
import { ModuleHeading } from './heading-level.tsx'
import type { ModuleComponentProps } from './types.ts'

export function TextBlockModule({ instance }: ModuleComponentProps) {
  const title = readCopy(instance.config.titleKey, instance.config.title)
  const body = readCopy(instance.config.bodyKey, instance.config.body)
  const headingId = title ? `${instance.id}-title` : undefined

  return (
    <ModuleFrame
      instance={instance}
      className="module-text"
      labelledBy={headingId}
      label={title ? undefined : 'Text'}
    >
      {title ? <ModuleHeading id={headingId}>{title}</ModuleHeading> : null}
      {body ? <p>{body}</p> : null}
    </ModuleFrame>
  )
}
