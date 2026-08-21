import {
  defaultTheme,
  type DeepPartial,
  type SiteTheme,
  type ThemeMode,
} from './config.ts'

const COLOR_PATTERN =
  /^(?:#[\da-f]{3,8}|(?:rgb|rgba|hsl|hsla|oklch|oklab|lab|lch|color)\([^{};]+\)|transparent|currentColor)$/i
const LENGTH_PATTERN =
  /^-?(?:\d+|\d*\.\d+)(?:px|rem|em|%|vw|vh|svw|svh|ch|ex)$/
const NUMBER_PATTERN = /^(?:\d+|\d*\.\d+)$/

function isSafeCss(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.trim().length > 0 &&
    !/[;{}<>]/.test(value) &&
    !/url\s*\(/i.test(value)
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function color(value: unknown, fallback: string): string {
  const candidate = typeof value === 'string' ? value.trim() : ''
  return isSafeCss(candidate) && COLOR_PATTERN.test(candidate) ? candidate : fallback
}

function length(value: unknown, fallback: string): string {
  const candidate = typeof value === 'string' ? value.trim() : ''
  return isSafeCss(candidate) && LENGTH_PATTERN.test(candidate) ? candidate : fallback
}

function numberValue(value: unknown, fallback: number, minimum = 0): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= minimum
    ? value
    : fallback
}

function safeCss(value: unknown, fallback: string): string {
  return isSafeCss(value) ? value.trim() : fallback
}

function fontSize(value: unknown, fallback: string): string {
  const candidate = typeof value === 'string' ? value.trim() : ''
  return isSafeCss(candidate) &&
    (LENGTH_PATTERN.test(candidate) || NUMBER_PATTERN.test(candidate))
    ? candidate
    : fallback
}

function resolvePalette(
  input: DeepPartial<SiteTheme['palettes']['light']> | undefined,
  fallback: SiteTheme['palettes']['light'],
): SiteTheme['palettes']['light'] {
  return {
    text: color(input?.text, fallback.text),
    heading: color(input?.heading, fallback.heading),
    background: color(input?.background, fallback.background),
    surface: color(input?.surface, fallback.surface),
    surfaceRaised: color(input?.surfaceRaised, fallback.surfaceRaised),
    border: color(input?.border, fallback.border),
    codeBackground: color(input?.codeBackground, fallback.codeBackground),
    accent: color(input?.accent, fallback.accent),
    accentStrong: color(input?.accentStrong, fallback.accentStrong),
    accentSoft: color(input?.accentSoft, fallback.accentSoft),
    accentBorder: color(input?.accentBorder, fallback.accentBorder),
    backdrop: color(input?.backdrop, fallback.backdrop),
    danger: color(input?.danger, fallback.danger),
  }
}

export function resolveTheme(raw: unknown = {}): SiteTheme {
  const input: DeepPartial<SiteTheme> = isRecord(raw)
    ? (raw as DeepPartial<SiteTheme>)
    : {}
  const mode: ThemeMode =
    input.mode === 'light' || input.mode === 'dark' || input.mode === 'system'
      ? input.mode
      : defaultTheme.mode

  return {
    mode,
    palettes: {
      light: resolvePalette(input.palettes?.light, defaultTheme.palettes.light),
      dark: resolvePalette(input.palettes?.dark, defaultTheme.palettes.dark),
    },
    typography: {
      sans: safeCss(input.typography?.sans, defaultTheme.typography.sans),
      heading: safeCss(input.typography?.heading, defaultTheme.typography.heading),
      mono: safeCss(input.typography?.mono, defaultTheme.typography.mono),
      rootSize: length(
        input.typography?.rootSize,
        defaultTheme.typography.rootSize,
      ),
      compactRootSize: length(
        input.typography?.compactRootSize,
        defaultTheme.typography.compactRootSize,
      ),
      lineHeight: fontSize(
        input.typography?.lineHeight,
        defaultTheme.typography.lineHeight,
      ),
      letterSpacing: length(
        input.typography?.letterSpacing,
        defaultTheme.typography.letterSpacing,
      ),
      sizeSmall: fontSize(
        input.typography?.sizeSmall,
        defaultTheme.typography.sizeSmall,
      ),
      sizeBody: fontSize(
        input.typography?.sizeBody,
        defaultTheme.typography.sizeBody,
      ),
      sizeLead: fontSize(
        input.typography?.sizeLead,
        defaultTheme.typography.sizeLead,
      ),
      sizeControl: fontSize(
        input.typography?.sizeControl,
        defaultTheme.typography.sizeControl,
      ),
      sizeDisplay: fontSize(
        input.typography?.sizeDisplay,
        defaultTheme.typography.sizeDisplay,
      ),
      sizeDisplayCompact: fontSize(
        input.typography?.sizeDisplayCompact,
        defaultTheme.typography.sizeDisplayCompact,
      ),
      sizeTitle: fontSize(
        input.typography?.sizeTitle,
        defaultTheme.typography.sizeTitle,
      ),
      sizeTitleCompact: fontSize(
        input.typography?.sizeTitleCompact,
        defaultTheme.typography.sizeTitleCompact,
      ),
      sizeHeading: fontSize(
        input.typography?.sizeHeading,
        defaultTheme.typography.sizeHeading,
      ),
    },
    spacing: {
      xxs: length(input.spacing?.xxs, defaultTheme.spacing.xxs),
      xs: length(input.spacing?.xs, defaultTheme.spacing.xs),
      sm: length(input.spacing?.sm, defaultTheme.spacing.sm),
      md: length(input.spacing?.md, defaultTheme.spacing.md),
      lg: length(input.spacing?.lg, defaultTheme.spacing.lg),
      xl: length(input.spacing?.xl, defaultTheme.spacing.xl),
      '2xl': length(input.spacing?.['2xl'], defaultTheme.spacing['2xl']),
      '3xl': length(input.spacing?.['3xl'], defaultTheme.spacing['3xl']),
      '4xl': length(input.spacing?.['4xl'], defaultTheme.spacing['4xl']),
      '5xl': length(input.spacing?.['5xl'], defaultTheme.spacing['5xl']),
    },
    radius: {
      small: length(input.radius?.small, defaultTheme.radius.small),
      medium: length(input.radius?.medium, defaultTheme.radius.medium),
      large: length(input.radius?.large, defaultTheme.radius.large),
      pill: length(input.radius?.pill, defaultTheme.radius.pill),
    },
    shadow: {
      soft: safeCss(input.shadow?.soft, defaultTheme.shadow.soft),
      raised: safeCss(input.shadow?.raised, defaultTheme.shadow.raised),
      focus: safeCss(input.shadow?.focus, defaultTheme.shadow.focus),
    },
    layout: {
      shell: length(input.layout?.shell, defaultTheme.layout.shell),
      reading: length(input.layout?.reading, defaultTheme.layout.reading),
      form: length(input.layout?.form, defaultTheme.layout.form),
      cardTrack: length(input.layout?.cardTrack, defaultTheme.layout.cardTrack),
    },
    breakpoints: {
      compact: numberValue(
        input.breakpoints?.compact,
        defaultTheme.breakpoints.compact,
        320,
      ),
      mobile: numberValue(
        input.breakpoints?.mobile,
        defaultTheme.breakpoints.mobile,
        320,
      ),
    },
    zIndex: {
      dropdown: numberValue(input.zIndex?.dropdown, defaultTheme.zIndex.dropdown),
      backdrop: numberValue(input.zIndex?.backdrop, defaultTheme.zIndex.backdrop),
      drawer: numberValue(input.zIndex?.drawer, defaultTheme.zIndex.drawer),
    },
  }
}
