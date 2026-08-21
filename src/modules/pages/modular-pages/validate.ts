import { hasCopy, readString } from './copy.ts'
import type {
  DataSourceRef,
  ModuleFallback,
  ModuleInstance,
  ModuleMode,
  PreparedModule,
  ValidationIssue,
} from './types.ts'

const MODES: ReadonlySet<ModuleMode> = new Set(['static', 'updatable'])

const SYNTHETIC_FALLBACK: ModuleInstance = {
  id: 'invalid',
  type: 'fallback',
  mode: 'static',
  config: {},
}

const BLOCKING: ReadonlySet<ValidationIssue['code']> = new Set([
  'missing-id',
  'missing-type',
  'invalid-mode',
  'unknown-type',
  'missing-config',
])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readMode(value: unknown): ModuleMode | undefined {
  return typeof value === 'string' && MODES.has(value as ModuleMode)
    ? (value as ModuleMode)
    : undefined
}

function readDataSource(value: unknown): DataSourceRef | undefined {
  if (!isRecord(value)) {
    return undefined
  }
  return {
    kind: 'sheets',
    publishedUrl:
      typeof value.publishedUrl === 'string' ? value.publishedUrl : undefined,
    tab: typeof value.tab === 'string' ? value.tab : undefined,
  }
}

function readFallback(value: unknown): ModuleFallback | undefined {
  if (!isRecord(value)) {
    return undefined
  }
  const fallback: ModuleFallback = {
    messageKey:
      typeof value.messageKey === 'string' ? value.messageKey : undefined,
    message: typeof value.message === 'string' ? value.message : undefined,
  }
  if (!fallback.messageKey && !fallback.message) {
    return undefined
  }
  return fallback
}

/**
 * Structural checks plus type-registry lookup. Type-specific config rules
 * live here so the composer never special-cases a module implementation.
 */
export function validateModuleInstance(
  raw: unknown,
  registeredTypes: ReadonlySet<string>,
): { instance: ModuleInstance | undefined; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = []

  if (!isRecord(raw)) {
    issues.push({
      code: 'missing-config',
      message: 'Module instance must be an object',
    })
    return { instance: undefined, issues }
  }

  const id = typeof raw.id === 'string' ? raw.id.trim() : ''
  if (!id) {
    issues.push({ code: 'missing-id', message: 'Module instance requires id' })
  }

  const type = typeof raw.type === 'string' ? raw.type.trim() : ''
  if (!type) {
    issues.push({
      code: 'missing-type',
      message: 'Module instance requires type',
    })
  } else if (!registeredTypes.has(type)) {
    issues.push({
      code: 'unknown-type',
      message: `Unknown module type: ${type}`,
    })
  }

  const mode = readMode(raw.mode)
  if (!mode) {
    issues.push({
      code: 'invalid-mode',
      message: 'Module mode must be static or updatable',
    })
  }

  const config = isRecord(raw.config) ? raw.config : undefined
  if (!config) {
    issues.push({
      code: 'missing-config',
      message: 'Module instance requires a config object',
    })
  }

  if (mode === 'updatable') {
    issues.push({
      code: 'updatable-unhydrated',
      message:
        'Updatable modules are not hydrated in this slice; using config or fallback',
    })
  }

  const instance: ModuleInstance = {
    id: id || 'invalid',
    type: type || 'fallback',
    mode: mode ?? 'static',
    config: config ?? {},
    dataSource: readDataSource(raw.dataSource),
    fallback: readFallback(raw.fallback),
  }

  if (type && registeredTypes.has(type) && config) {
    issues.push(...validateTypeConfig(instance))
  }

  return { instance, issues }
}

export function validateTypeConfig(instance: ModuleInstance): ValidationIssue[] {
  switch (instance.type) {
    case 'placeholder':
    case 'hero':
      return requireTitle(instance, `${instance.type} modules require titleKey or title`)
    case 'text':
      if (
        !hasCopy(instance.config.titleKey, instance.config.title) &&
        !hasCopy(instance.config.bodyKey, instance.config.body)
      ) {
        return [
          missingConfig('text modules require title or body (key or literal)'),
        ]
      }
      return []
    case 'image':
      if (!readString(instance.config.src) || !readString(instance.config.alt)) {
        return [missingConfig('image modules require src and alt text')]
      }
      return []
    case 'card-list':
      return validateNamedEntries(
        instance.config.entries,
        'card-list modules require entries with titleKey or title',
      )
    case 'section':
      if (!Array.isArray(instance.config.children)) {
        return [missingConfig('section modules require a children array')]
      }
      return []
    case 'calendar':
      return validateCalendar(instance)
    default:
      return []
  }
}

function requireTitle(instance: ModuleInstance, message: string): ValidationIssue[] {
  if (!hasCopy(instance.config.titleKey, instance.config.title)) {
    return [missingConfig(message)]
  }
  if (
    instance.type === 'hero' &&
    readString(instance.config.mediaSrc) &&
    !readString(instance.config.mediaAlt)
  ) {
    return [missingConfig('hero media requires mediaAlt')]
  }
  return []
}

function validateNamedEntries(
  value: unknown,
  message: string,
): ValidationIssue[] {
  if (!Array.isArray(value) || value.length === 0) {
    return [missingConfig(message)]
  }
  for (const entry of value) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      return [missingConfig(message)]
    }
    const item = entry as Record<string, unknown>
    if (!hasCopy(item.titleKey, item.title)) {
      return [missingConfig(message)]
    }
  }
  return []
}

const CALENDAR_LAYOUTS: ReadonlySet<string> = new Set([
  'list',
  'month',
  'grid',
  'hybrid',
  'agenda',
])

function validateCalendar(instance: ModuleInstance): ValidationIssue[] {
  const events = instance.config.events
  const message = 'calendar modules require events with date and title'
  if (!Array.isArray(events) || events.length === 0) {
    return [missingConfig(message)]
  }
  for (const event of events) {
    if (!event || typeof event !== 'object' || Array.isArray(event)) {
      return [missingConfig(message)]
    }
    const item = event as Record<string, unknown>
    if (!readString(item.date) || !hasCopy(item.titleKey, item.title)) {
      return [missingConfig(message)]
    }
  }

  const layout = readString(instance.config.layout)
  if (layout && !CALENDAR_LAYOUTS.has(layout)) {
    return [
      missingConfig('calendar layout must be list, month, grid, or hybrid'),
    ]
  }

  const month = readString(instance.config.month)
  if (month && !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    return [missingConfig('calendar month must be YYYY-MM')]
  }

  const upcomingCount = instance.config.upcomingCount
  if (
    upcomingCount !== undefined &&
    !(Number.isInteger(upcomingCount) && (upcomingCount as number) > 0)
  ) {
    return [
      missingConfig('calendar upcomingCount must be a positive whole number'),
    ]
  }

  return []
}

function missingConfig(message: string): ValidationIssue {
  return { code: 'missing-config', message }
}

export function prepareModule(
  raw: unknown,
  registeredTypes: ReadonlySet<string>,
): PreparedModule {
  const { instance, issues } = validateModuleInstance(raw, registeredTypes)
  const blocking = issues.some((issue) => BLOCKING.has(issue.code))

  return {
    instance: instance ?? SYNTHETIC_FALLBACK,
    valid: Boolean(instance) && !blocking,
    issues,
    renderMode: blocking || !instance ? 'fallback' : 'component',
  }
}
