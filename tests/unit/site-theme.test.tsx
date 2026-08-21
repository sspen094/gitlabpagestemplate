/** @vitest-environment jsdom */

import { render, screen } from '@testing-library/react'
import { cleanup } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import {
  createThemeCss,
  defaultTheme,
  resolveTheme,
  ThemeProvider,
  useTheme,
  type DeepPartial,
  type SiteTheme,
} from '../../src/modules/theme/site-theme/index.ts'

afterEach(cleanup)

function Probe() {
  const theme = useTheme()
  return <output>{`${theme.palettes.light.accent}|${theme.spacing.lg}`}</output>
}

describe('site theme', () => {
  it('emits typed tokens and lets a provider inject an alternate theme', () => {
    const alternate: DeepPartial<SiteTheme> = {
      palettes: { light: { accent: '#125ca8' } },
      spacing: { lg: '20px' },
    }

    const { container } = render(
      <ThemeProvider theme={alternate}>
        <Probe />
      </ThemeProvider>,
    )

    expect(screen.getByText('#125ca8|20px')).toBeTruthy()
    const css = container.querySelector('style[data-site-theme]')?.textContent
    expect(css).toContain('--color-accent:#125ca8')
    expect(css).toContain('--space-lg:20px')
    expect(css).toContain('@media (prefers-color-scheme:dark)')
  })

  it('honors explicit palette overrides without rendering a visitor toggle', () => {
    const lightCss = createThemeCss(resolveTheme({ mode: 'light' }))
    const darkCss = createThemeCss(resolveTheme({ mode: 'dark' }))

    expect(lightCss).toContain('color-scheme:light')
    expect(lightCss).not.toContain('prefers-color-scheme')
    expect(lightCss).toContain(`--color-background:${defaultTheme.palettes.light.background}`)

    expect(darkCss).toContain('color-scheme:dark')
    expect(darkCss).not.toContain('prefers-color-scheme')
    expect(darkCss).toContain(`--color-background:${defaultTheme.palettes.dark.background}`)
  })

  it('falls back for partial, malformed, and unsafe values without throwing', () => {
    expect(resolveTheme(null)).toEqual(defaultTheme)
    expect(resolveTheme('invalid')).toEqual(defaultTheme)
    expect(resolveTheme([])).toEqual(defaultTheme)

    const resolved = resolveTheme({
      mode: 'sepia' as SiteTheme['mode'],
      palettes: {
        light: {
          accent: 'not-a-color',
          background: 'red;display:none',
        },
      },
      typography: { rootSize: 'huge' },
      spacing: { lg: '' },
      breakpoints: { mobile: Number.NaN },
      zIndex: { drawer: -1 },
    })

    expect(resolved.mode).toBe(defaultTheme.mode)
    expect(resolved.palettes.light.accent).toBe(defaultTheme.palettes.light.accent)
    expect(resolved.palettes.light.background).toBe(
      defaultTheme.palettes.light.background,
    )
    expect(resolved.typography.rootSize).toBe(defaultTheme.typography.rootSize)
    expect(resolved.spacing.lg).toBe(defaultTheme.spacing.lg)
    expect(resolved.breakpoints.mobile).toBe(defaultTheme.breakpoints.mobile)
    expect(resolved.zIndex.drawer).toBe(defaultTheme.zIndex.drawer)
    expect(() => createThemeCss(resolved)).not.toThrow()
  })
})
