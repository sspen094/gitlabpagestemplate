/**
 * Closed style vocabulary for pages and module instances (product §10, §15).
 * A site builder picks named options in config; there is no freeform CSS path.
 * Unknown values degrade to the default so a page always renders.
 */

export type ModuleVariant = 'default' | 'quiet' | 'feature'
export type StyleAlignment = 'start' | 'center'
export type StyleWidth = 'default' | 'narrow' | 'full'
export type StyleTone = 'default' | 'accent' | 'muted'
export type StyleSurface = 'default' | 'plain' | 'card' | 'raised'
export type StyleSpacing = 'default' | 'compact' | 'roomy'

export type PageWidth = 'reading' | 'narrow' | 'shell'
export type PageRhythm = 'default' | 'compact' | 'roomy'

/** Author-facing shape: every axis optional, unset means the default. */
export type ModuleStyle = {
  variant?: ModuleVariant
  align?: StyleAlignment
  width?: StyleWidth
  tone?: StyleTone
  surface?: StyleSurface
  spacing?: StyleSpacing
  /** Module-type specific layout, validated against that type's closed set. */
  layout?: string
}

export type ResolvedModuleStyle = {
  variant: ModuleVariant
  align: StyleAlignment
  width: StyleWidth
  tone: StyleTone
  surface: StyleSurface
  spacing: StyleSpacing
  layout?: string
}

export type PageAppearance = {
  width?: PageWidth
  tone?: StyleTone
  rhythm?: PageRhythm
}

export type ResolvedPageAppearance = {
  width: PageWidth
  tone: StyleTone
  rhythm: PageRhythm
}

const VARIANTS: readonly ModuleVariant[] = ['default', 'quiet', 'feature']
const ALIGNMENTS: readonly StyleAlignment[] = ['start', 'center']
const WIDTHS: readonly StyleWidth[] = ['default', 'narrow', 'full']
const TONES: readonly StyleTone[] = ['default', 'accent', 'muted']
const SURFACES: readonly StyleSurface[] = ['default', 'plain', 'card', 'raised']
const SPACINGS: readonly StyleSpacing[] = ['default', 'compact', 'roomy']
const PAGE_WIDTHS: readonly PageWidth[] = ['reading', 'narrow', 'shell']
const PAGE_RHYTHMS: readonly PageRhythm[] = ['default', 'compact', 'roomy']

/**
 * Layout options per module type. Calendar keeps the `grid` / `agenda` aliases
 * that `config.layout` already accepted so folding them in changes nothing.
 */
export const MODULE_LAYOUTS: Readonly<Record<string, readonly string[]>> = {
  'card-list': ['grid', 'list'],
  calendar: ['list', 'month', 'grid', 'hybrid', 'agenda'],
}

export const DEFAULT_MODULE_STYLE: ResolvedModuleStyle = {
  variant: 'default',
  align: 'start',
  width: 'default',
  tone: 'default',
  surface: 'default',
  spacing: 'default',
}

export const DEFAULT_PAGE_APPEARANCE: ResolvedPageAppearance = {
  width: 'reading',
  tone: 'default',
  rhythm: 'default',
}

export type ModuleStyleResolution = {
  style: ResolvedModuleStyle
  /** Axis names whose configured value was unknown and fell back. */
  degraded: string[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readOption<T extends string>(
  raw: Record<string, unknown>,
  axis: string,
  allowed: readonly T[],
  fallback: T,
  degraded: string[],
): T {
  const value = raw[axis]
  if (value === undefined) {
    return fallback
  }
  if (typeof value === 'string' && allowed.includes(value.trim() as T)) {
    return value.trim() as T
  }
  degraded.push(axis)
  return fallback
}

/**
 * Sanitize an authored `style` block. Never throws: any unknown value is
 * reported and replaced with the default variant for that axis.
 */
export function resolveModuleStyle(
  raw: unknown,
  moduleType?: string,
): ModuleStyleResolution {
  const degraded: string[] = []
  if (!isRecord(raw)) {
    return { style: { ...DEFAULT_MODULE_STYLE }, degraded }
  }

  const style: ResolvedModuleStyle = {
    variant: readOption(raw, 'variant', VARIANTS, 'default', degraded),
    align: readOption(raw, 'align', ALIGNMENTS, 'start', degraded),
    width: readOption(raw, 'width', WIDTHS, 'default', degraded),
    tone: readOption(raw, 'tone', TONES, 'default', degraded),
    surface: readOption(raw, 'surface', SURFACES, 'default', degraded),
    spacing: readOption(raw, 'spacing', SPACINGS, 'default', degraded),
  }

  if (raw.layout !== undefined) {
    const allowed = moduleType ? MODULE_LAYOUTS[moduleType] : undefined
    const layout = typeof raw.layout === 'string' ? raw.layout.trim() : ''
    if (allowed && allowed.includes(layout)) {
      style.layout = layout
    } else {
      degraded.push('layout')
    }
  }

  return { style, degraded }
}

export function resolvePageAppearance(raw: unknown): ResolvedPageAppearance {
  if (!isRecord(raw)) {
    return { ...DEFAULT_PAGE_APPEARANCE }
  }
  const ignored: string[] = []
  return {
    width: readOption(raw, 'width', PAGE_WIDTHS, 'reading', ignored),
    tone: readOption(raw, 'tone', TONES, 'default', ignored),
    rhythm: readOption(raw, 'rhythm', PAGE_RHYTHMS, 'default', ignored),
  }
}

/** Variant classes carry scoped custom-property overrides defined in `App.css`. */
export function moduleStyleClassNames(style: ResolvedModuleStyle): string[] {
  const classes: string[] = []
  if (style.variant !== 'default') {
    classes.push(`module--variant-${style.variant}`)
  }
  if (style.align !== 'start') {
    classes.push(`module--align-${style.align}`)
  }
  if (style.width !== 'default') {
    classes.push(`module--width-${style.width}`)
  }
  if (style.tone !== 'default') {
    classes.push(`module--tone-${style.tone}`)
  }
  if (style.surface !== 'default') {
    classes.push(`module--surface-${style.surface}`)
  }
  if (style.spacing !== 'default') {
    classes.push(`module--spacing-${style.spacing}`)
  }
  return classes
}

export function pageAppearanceClassNames(
  appearance: ResolvedPageAppearance,
): string[] {
  const classes: string[] = []
  if (appearance.width !== 'reading') {
    classes.push(`page-composer--width-${appearance.width}`)
  }
  if (appearance.tone !== 'default') {
    classes.push(`page-composer--tone-${appearance.tone}`)
  }
  if (appearance.rhythm !== 'default') {
    classes.push(`page-composer--rhythm-${appearance.rhythm}`)
  }
  return classes
}

/**
 * Layout for a module: the typed `style.layout` wins, then the legacy
 * `config.layout` string, then the module's default.
 */
export function readLayoutOption(
  styleLayout: unknown,
  configLayout: unknown,
  allowed: readonly string[],
  fallback: string,
): string {
  for (const candidate of [styleLayout, configLayout]) {
    const value = typeof candidate === 'string' ? candidate.trim() : ''
    if (value && allowed.includes(value)) {
      return value
    }
  }
  return fallback
}
