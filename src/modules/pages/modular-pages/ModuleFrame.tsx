import type { ReactNode } from 'react'
import { moduleStyleClassNames, resolveModuleStyle } from './style.ts'
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
  const { style } = resolveModuleStyle(instance.style, instance.type)
  const classes = [className, ...moduleStyleClassNames(style)].join(' ')

  return (
    <section
      className={classes}
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : label}
      data-module-id={instance.id}
      data-module-type={instance.type}
      data-module-mode={instance.mode}
      data-module-render="component"
      data-module-variant={style.variant}
    >
      {children}
    </section>
  )
}
