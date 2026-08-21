import { createElement } from 'react'
import { UpdatableModule } from '../../updatable-content/sheets-hydration/UpdatableModule.tsx'
import { FallbackModule } from './FallbackModule.tsx'
import { HeadingLevelProvider } from './heading-level.tsx'
import { getModuleComponent, getRegisteredTypes } from './registry.ts'
import { pageAppearanceClassNames, resolvePageAppearance } from './style.ts'
import type { ModuleInstance, PageDefinition } from './types.ts'
import { prepareModule } from './validate.ts'

/** Shared path: validate → fallback, updatable hydration boundary, or component. */
export function ModulePipeline({ instance }: { instance: unknown }) {
  const prepared = prepareModule(instance, getRegisteredTypes())

  if (prepared.renderMode === 'fallback') {
    return <FallbackModule prepared={prepared} />
  }

  if (prepared.instance.mode === 'updatable') {
    return <UpdatableModule prepared={prepared} />
  }

  const Component = getModuleComponent(prepared.instance.type)
  if (!Component) {
    return <FallbackModule prepared={{ ...prepared, renderMode: 'fallback' }} />
  }

  return createElement(Component, { instance: prepared.instance })
}

export function PageComposer({
  modules,
  appearance,
}: {
  modules: readonly ModuleInstance[]
  appearance?: PageDefinition['appearance']
}) {
  const resolved = resolvePageAppearance(appearance)
  const classes = ['page-composer', ...pageAppearanceClassNames(resolved)].join(
    ' ',
  )

  return (
    <HeadingLevelProvider level={2}>
      <div className={classes} data-page-width={resolved.width}>
        {modules.map((instance, index) => (
          <ModulePipeline
            key={instance.id || `module-${index}`}
            instance={instance}
          />
        ))}
      </div>
    </HeadingLevelProvider>
  )
}
