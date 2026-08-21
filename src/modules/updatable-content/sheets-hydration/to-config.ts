import type {
  ModuleConfig,
  ModuleInstance,
} from '../../pages/modular-pages/index.ts'
import type { UpdatableData } from './hydrate.ts'
import type { UpdatableType } from './schemas.ts'

/**
 * Bridge the hydrated, sanitized data onto the existing presentational module
 * config so `TextBlockModule` / `CardListModule` / `CalendarModule` render sheet
 * content unchanged. Literal fields are set and `*Key` copy lookups cleared so
 * the component shows sheet values instead of `t()` shell copy.
 */

const MODULE_TYPE_TO_UPDATABLE: Record<string, UpdatableType> = {
  text: 'text-block',
  'card-list': 'card-list',
  calendar: 'event-list',
  contact: 'contact-info',
}

export function updatableTypeForModule(
  moduleType: string,
): UpdatableType | undefined {
  return MODULE_TYPE_TO_UPDATABLE[moduleType]
}

export function applyUpdatableData(
  instance: ModuleInstance,
  data: UpdatableData,
): ModuleInstance {
  return { ...instance, config: dataToConfig(instance.config, data) }
}

function dataToConfig(config: ModuleConfig, data: UpdatableData): ModuleConfig {
  switch (data.type) {
    case 'text-block':
      return {
        ...config,
        bodyKey: undefined,
        body: undefined,
        blocks: data.blocks.map((block, index) => ({
          id: `block-${index}`,
          text: block.text,
        })),
      }
    case 'card-list':
      return {
        ...config,
        entries: data.cards.map((card, index) => ({
          id: `card-${index}`,
          title: card.title,
          subtitle: card.subtitle ?? '',
          body: card.description ?? '',
          link: card.link ?? '',
          imageUrl: card.imageUrl ?? '',
        })),
      }
    case 'event-list':
      return {
        ...config,
        events: data.events.map((event, index) => ({
          id: `event-${index}`,
          date: event.date,
          title: event.title,
          time: event.time ?? '',
          location: event.location ?? '',
          detail: event.description ?? '',
          link: event.link ?? '',
        })),
      }
    case 'contact-info':
      return {
        ...config,
        entries: data.contacts.map((contact, index) => ({
          id: `contact-${index}`,
          label: contact.label,
          value: contact.value,
          type: contact.type,
        })),
      }
  }
}
