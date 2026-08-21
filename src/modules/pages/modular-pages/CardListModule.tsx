import { ModuleFrame } from './ModuleFrame.tsx'
import { readCopy, readString } from './copy.ts'
import { ModuleHeading, NestedHeadingScope } from './heading-level.tsx'
import type { ModuleComponentProps } from './types.ts'

export function CardListModule({ instance }: ModuleComponentProps) {
  const title = readCopy(instance.config.titleKey, instance.config.title)
  const layout = readString(instance.config.layout) === 'list' ? 'list' : 'grid'
  const entries = Array.isArray(instance.config.entries)
    ? instance.config.entries
    : []
  const headingId = title ? `${instance.id}-title` : undefined

  const cards = (
    <ul className={`module-cards__list module-cards__list--${layout}`}>
      {entries.map((entry, index) => {
        if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
          return null
        }
        const card = entry as Record<string, unknown>
        const cardTitle = readCopy(card.titleKey, card.title)
        const cardSubtitle = readCopy(card.subtitleKey, card.subtitle)
        const cardBody = readCopy(card.bodyKey, card.body)
        const link = readString(card.link)
        const imageUrl = readString(card.imageUrl)
        const key = readString(card.id) || `${instance.id}-card-${index}`

        return (
          <li key={key} className="module-card">
            {imageUrl ? (
              <img className="module-card__image" src={imageUrl} alt="" />
            ) : null}
            {cardTitle ? (
              <ModuleHeading>
                {link ? <a href={link}>{cardTitle}</a> : cardTitle}
              </ModuleHeading>
            ) : null}
            {cardSubtitle ? (
              <p className="module-card__subtitle">{cardSubtitle}</p>
            ) : null}
            {cardBody ? <p>{cardBody}</p> : null}
            {link && !cardTitle ? (
              <p>
                <a href={link}>{link}</a>
              </p>
            ) : null}
          </li>
        )
      })}
    </ul>
  )

  return (
    <ModuleFrame
      instance={instance}
      className="module-cards"
      labelledBy={headingId}
      label={title ? undefined : 'Cards'}
    >
      {title ? <ModuleHeading id={headingId}>{title}</ModuleHeading> : null}
      {title ? <NestedHeadingScope>{cards}</NestedHeadingScope> : cards}
    </ModuleFrame>
  )
}
