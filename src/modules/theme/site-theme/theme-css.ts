import type { SiteTheme, ThemePalette } from './config.ts'

function paletteProperties(palette: ThemePalette): string {
  return [
    `--color-text:${palette.text}`,
    `--color-heading:${palette.heading}`,
    `--color-background:${palette.background}`,
    `--color-surface:${palette.surface}`,
    `--color-surface-raised:${palette.surfaceRaised}`,
    `--color-border:${palette.border}`,
    `--color-code-background:${palette.codeBackground}`,
    `--color-accent:${palette.accent}`,
    `--color-accent-strong:${palette.accentStrong}`,
    `--color-accent-soft:${palette.accentSoft}`,
    `--color-accent-border:${palette.accentBorder}`,
    `--color-backdrop:${palette.backdrop}`,
    `--color-danger:${palette.danger}`,
  ].join(';')
}

function sharedProperties(theme: SiteTheme): string {
  const { typography, spacing, radius, shadow, layout, breakpoints, zIndex } =
    theme

  return [
    `--font-sans:${typography.sans}`,
    `--font-heading:${typography.heading}`,
    `--font-mono:${typography.mono}`,
    `--font-root-size:${typography.rootSize}`,
    `--font-compact-root-size:${typography.compactRootSize}`,
    `--font-line-height:${typography.lineHeight}`,
    `--font-letter-spacing:${typography.letterSpacing}`,
    `--font-size-small:${typography.sizeSmall}`,
    `--font-size-body:${typography.sizeBody}`,
    `--font-size-lead:${typography.sizeLead}`,
    `--font-size-control:${typography.sizeControl}`,
    `--font-size-display:${typography.sizeDisplay}`,
    `--font-size-display-compact:${typography.sizeDisplayCompact}`,
    `--font-size-title:${typography.sizeTitle}`,
    `--font-size-title-compact:${typography.sizeTitleCompact}`,
    `--font-size-heading:${typography.sizeHeading}`,
    `--space-xxs:${spacing.xxs}`,
    `--space-xs:${spacing.xs}`,
    `--space-sm:${spacing.sm}`,
    `--space-md:${spacing.md}`,
    `--space-lg:${spacing.lg}`,
    `--space-xl:${spacing.xl}`,
    `--space-2xl:${spacing['2xl']}`,
    `--space-3xl:${spacing['3xl']}`,
    `--space-4xl:${spacing['4xl']}`,
    `--space-5xl:${spacing['5xl']}`,
    `--radius-small:${radius.small}`,
    `--radius-medium:${radius.medium}`,
    `--radius-large:${radius.large}`,
    `--radius-pill:${radius.pill}`,
    `--shadow-soft:${shadow.soft}`,
    `--shadow-raised:${shadow.raised}`,
    `--shadow-focus:${shadow.focus}`,
    `--layout-shell:${layout.shell}`,
    `--layout-reading:${layout.reading}`,
    `--layout-form:${layout.form}`,
    `--layout-card-track:${layout.cardTrack}`,
    `--breakpoint-compact:${breakpoints.compact}px`,
    `--breakpoint-mobile:${breakpoints.mobile}px`,
    `--z-dropdown:${zIndex.dropdown}`,
    `--z-backdrop:${zIndex.backdrop}`,
    `--z-drawer:${zIndex.drawer}`,
  ].join(';')
}

export function createThemeCss(theme: SiteTheme): string {
  const shared = sharedProperties(theme)
  const light = paletteProperties(theme.palettes.light)
  const dark = paletteProperties(theme.palettes.dark)

  if (theme.mode === 'light') {
    return `:root{${shared};${light};color-scheme:light}`
  }

  if (theme.mode === 'dark') {
    return `:root{${shared};${dark};color-scheme:dark}`
  }

  return `:root{${shared};${light};color-scheme:light dark}@media (prefers-color-scheme:dark){:root{${dark}}}`
}
