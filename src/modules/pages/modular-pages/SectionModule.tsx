import { ModuleFrame } from './ModuleFrame.tsx'
import { readCopy } from './copy.ts'
import { ModuleHeading, NestedHeadingScope } from './heading-level.tsx'
import { ModulePipeline } from './pipeline.tsx'
import type { ModuleComponentProps, ModuleInstance } from './types.ts'

export function SectionModule({ instance }: ModuleComponentProps) {
  const title = readCopy(instance.config.titleKey, instance.config.title)
  const children = Array.isArray(instance.config.children)
    ? instance.config.children
    : []
  const headingId = title ? `${instance.id}-title` : undefined

  const nested = children.map((child, index) => (
    <ModulePipeline
      key={moduleChildKey(child, instance.id, index)}
      instance={child}
    />
  ))

  return (
    <ModuleFrame
      instance={instance}
      className="module-section"
      labelledBy={headingId}
      label={title ? undefined : 'Section'}
    >
      {title ? <ModuleHeading id={headingId}>{title}</ModuleHeading> : null}
      <div className="module-section__body">
        {title ? <NestedHeadingScope>{nested}</NestedHeadingScope> : nested}
      </div>
    </ModuleFrame>
  )
}

function moduleChildKey(
  child: unknown,
  parentId: string,
  index: number,
): string {
  if (child && typeof child === 'object' && !Array.isArray(child)) {
    const id = (child as ModuleInstance).id
    if (typeof id === 'string' && id.trim() !== '') {
      return id
    }
  }
  return `${parentId}-child-${index}`
}
