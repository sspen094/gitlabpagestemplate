import { ModuleCta } from './ModuleCta.tsx'
import { ModuleFrame } from './ModuleFrame.tsx'
import { readCopy, readString } from './copy.ts'
import { ModuleHeading } from './heading-level.tsx'
import type { ModuleComponentProps } from './types.ts'

export function HeroModule({ instance }: ModuleComponentProps) {
  const title = readCopy(instance.config.titleKey, instance.config.title)
  const subtitle = readCopy(
    instance.config.subtitleKey,
    instance.config.subtitle,
  )
  const body = readCopy(instance.config.bodyKey, instance.config.body)
  const mediaSrc = readString(instance.config.mediaSrc)
  const mediaAlt = readString(instance.config.mediaAlt)
  const ctaLabel = readCopy(instance.config.ctaLabelKey, instance.config.ctaLabel)
  const ctaHref = readString(instance.config.ctaHref)
  const headingId = `${instance.id}-title`

  return (
    <ModuleFrame
      instance={instance}
      className="module-hero"
      labelledBy={headingId}
    >
      <ModuleHeading id={headingId} level={1}>
        {title}
      </ModuleHeading>
      {subtitle ? <p className="module-hero__subtitle">{subtitle}</p> : null}
      {body ? <p>{body}</p> : null}
      {mediaSrc ? (
        <img className="module-hero__media" src={mediaSrc} alt={mediaAlt} />
      ) : null}
      {ctaLabel && ctaHref ? <ModuleCta href={ctaHref} label={ctaLabel} /> : null}
    </ModuleFrame>
  )
}
