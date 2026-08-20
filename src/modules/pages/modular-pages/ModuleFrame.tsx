import type { ReactNode } from 'react'
import type { ModuleInstance } from './types.ts'

export function ModuleFrame({
  instance,
  className,
  labelledBy,
  label,
  children,
}: {
  instance: ModuleInstance
  className: string
  labelledBy?: string
  label?: string
  children: ReactNode
}) {
  return (
    <section
      className={className}
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : label}
      data-module-id={instance.id}
      data-module-type={instance.type}
      data-module-mode={instance.mode}
      data-module-render="component"
    >
      {children}
    </section>
  )
}
