import { ModuleFrame } from './ModuleFrame.tsx'
import { readCopy, readString } from './copy.ts'
import { ModuleHeading } from './heading-level.tsx'
import type { ModuleComponentProps, ModuleInstance } from './types.ts'

export function TextBlockModule({ instance }: ModuleComponentProps) {
  const title = readCopy(instance.config.titleKey, instance.config.title)
  const blocks = readBlocks(instance)
  const headingId = title ? `${instance.id}-title` : undefined

  return (
    <ModuleFrame
      instance={instance}
      className="module-text"
      labelledBy={headingId}
      label={title ? undefined : 'Text'}
    >
      {title ? <ModuleHeading id={headingId}>{title}</ModuleHeading> : null}
      {blocks.map((block) => (
        <p key={block.id}>{block.text}</p>
      ))}
    </ModuleFrame>
  )
}

/**
 * A `blocks` array is one paragraph per source row, so a sheet with four rows
 * renders four blocks. Static config keeps using the single `body`/`bodyKey`.
 */
function readBlocks(
  instance: ModuleInstance,
): { id: string; text: string }[] {
  const raw = instance.config.blocks
  if (Array.isArray(raw)) {
    return raw.flatMap((entry, index) => {
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
        return []
      }
      const block = entry as Record<string, unknown>
      const text = readCopy(block.textKey, block.text)
      return text
        ? [{ id: readString(block.id) || `${instance.id}-block-${index}`, text }]
        : []
    })
  }

  const body = readCopy(instance.config.bodyKey, instance.config.body)
  return body ? [{ id: `${instance.id}-body`, text: body }] : []
}
