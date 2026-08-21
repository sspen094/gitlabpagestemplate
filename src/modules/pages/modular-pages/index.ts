export type {
  DataSourceRef,
  ModuleComponent,
  ModuleComponentProps,
  ModuleConfig,
  ModuleFallback,
  ModuleInstance,
  ModuleMode,
  PageDefinition,
  PreparedModule,
  ValidationIssue,
} from './types.ts'
export { validateModuleInstance, prepareModule } from './validate.ts'
export {
  registerModule,
  getModuleComponent,
  getRegisteredTypes,
} from './registry.ts'
export { PageComposer, ModulePipeline } from './pipeline.tsx'
export { defaultPages, getPageByPath, normalizePagePath } from './pages-config.ts'
export { PageRoutes } from './PageRoutes.tsx'
export { PlaceholderModule } from './PlaceholderModule.tsx'
export { HeroModule } from './HeroModule.tsx'
export { TextBlockModule } from './TextBlockModule.tsx'
export { ImageBlockModule } from './ImageBlockModule.tsx'
export { CardListModule } from './CardListModule.tsx'
export { SectionModule } from './SectionModule.tsx'
export { CalendarModule } from './CalendarModule.tsx'
export {
  canStepMonth,
  clampMonthToSteppingRange,
  selectUpcomingEvents,
  shiftMonth,
} from './calendar-events.ts'
export type { CalendarEvent, CalendarMonth } from './calendar-events.ts'
export { ContactInfoModule } from './ContactInfoModule.tsx'
export { ContactFormModule } from '../../submissions/external-forms/ContactFormModule.tsx'
export { FallbackModule } from './FallbackModule.tsx'
