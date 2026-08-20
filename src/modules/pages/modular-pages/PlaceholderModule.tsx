import { ModuleFrame } from './ModuleFrame.tsx'
import { readCopy } from './copy.ts'
import { ModuleHeading } from './heading-level.tsx'
import type { ModuleComponentProps } from './types.ts'

/** Kept for tests and any leftover config; prefer typed baseline modules. */
export function PlaceholderModule({ instance }: ModuleComponentProps) {
  const title = readCopy(instance.config.titleKey, instance.config.title)
  const body = readCopy(instance.config.bodyKey, instance.config.body)
  const headingId = `${instance.id}-title`

  return (
    <ModuleFrame
      instance={instance}
      className="module-placeholder"
      labelledBy={headingId}
    >
      <ModuleHeading id={headingId} level={1}>
        {title}
      </ModuleHeading>
      {body ? <p>{body}</p> : null}
    </ModuleFrame>
  )
}
