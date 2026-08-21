import { ContactFormModule } from '../../submissions/external-forms/ContactFormModule.tsx'
import { CalendarModule } from './CalendarModule.tsx'
import { CardListModule } from './CardListModule.tsx'
import { ContactInfoModule } from './ContactInfoModule.tsx'
import { HeroModule } from './HeroModule.tsx'
import { ImageBlockModule } from './ImageBlockModule.tsx'
import { PlaceholderModule } from './PlaceholderModule.tsx'
import { SectionModule } from './SectionModule.tsx'
import { TextBlockModule } from './TextBlockModule.tsx'
import type { ModuleComponent } from './types.ts'

const registry = new Map<string, ModuleComponent>()

export function registerModule(type: string, component: ModuleComponent): void {
  registry.set(type, component)
}

export function getModuleComponent(type: string): ModuleComponent | undefined {
  return registry.get(type)
}

export function getRegisteredTypes(): ReadonlySet<string> {
  return new Set(registry.keys())
}

registerModule('placeholder', PlaceholderModule)
registerModule('hero', HeroModule)
registerModule('text', TextBlockModule)
registerModule('image', ImageBlockModule)
registerModule('card-list', CardListModule)
registerModule('section', SectionModule)
registerModule('calendar', CalendarModule)
registerModule('contact', ContactInfoModule)
registerModule('contact-form', ContactFormModule)
