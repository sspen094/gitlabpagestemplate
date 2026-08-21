import { createElement } from 'react'
import { FallbackModule } from '../../pages/modular-pages/FallbackModule.tsx'
import { getModuleComponent } from '../../pages/modular-pages/registry.ts'
import type { PreparedModule } from '../../pages/modular-pages/index.ts'
import { useUpdatableModule } from './useUpdatableModule.ts'

/**
 * Hydration boundary for `mode: 'updatable'` instances. Renders the existing
 * presentational component with the static shell first, then re-renders with
 * sanitized sheet data (or a safe fallback) once the feed resolves. The page
 * never blocks on the network and never crashes on bad data.
 */
export function UpdatableModule({ prepared }: { prepared: PreparedModule }) {
  const state = useUpdatableModule(prepared.instance)

  if (state.status === 'fallback') {
    return (
      <FallbackModule
        prepared={{
          ...prepared,
          instance: state.instance,
          renderMode: 'fallback',
        }}
      />
    )
  }

  const Component = getModuleComponent(state.instance.type)
  if (!Component) {
    return <FallbackModule prepared={{ ...prepared, renderMode: 'fallback' }} />
  }

  return createElement(Component, { instance: state.instance })
}
