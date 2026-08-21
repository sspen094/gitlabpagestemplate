/** @vitest-environment jsdom */

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import {
  MOBILE_BREAKPOINT,
  MOBILE_MEDIA_QUERY,
} from '../../src/modules/navigation/navbar/mobile-query.ts'
import { PageComposer } from '../../src/modules/pages/modular-pages/pipeline.tsx'
import { defaultTheme } from '../../src/modules/theme/site-theme/config.ts'
import { stubMatchMedia } from './stub-match-media.ts'

afterEach(() => {
  cleanup()
  stubMatchMedia(false)
})

const appCss = readFileSync(resolve('src/App.css'), 'utf8')
const indexCss = readFileSync(resolve('src/index.css'), 'utf8')
const indexHtml = readFileSync(resolve('index.html'), 'utf8')

describe('mobile layout quality gate', () => {
  it('declares a device-width viewport', () => {
    expect(indexHtml).toMatch(/width=device-width/)
  })

  it('keeps the root and media fluid', () => {
    expect(indexCss).toMatch(/#root[\s\S]*max-width:\s*100%/)
    expect(indexCss).toMatch(/img[\s\S]*max-width:\s*100%/)
  })

  it('wraps main content and uses wrapping-safe card grids', () => {
    expect(appCss).toMatch(/\.app-shell__main[\s\S]*overflow-wrap:\s*anywhere/)
    expect(appCss).toMatch(
      /grid-template-columns:\s*[\r\n\s]*repeat\(auto-fit,\s*minmax\(min\(var\(--layout-card-track\),\s*100%\),\s*1fr\)\)/,
    )
    expect(appCss).not.toMatch(/minmax\(\s*\d+(?:\.\d+)?rem\s*,/)
  })

  it('keeps named CSS breakpoints and the navbar query synchronized', () => {
    expect(MOBILE_BREAKPOINT).toBe(defaultTheme.breakpoints.mobile)
    expect(MOBILE_MEDIA_QUERY).toBe(
      `(max-width: ${defaultTheme.breakpoints.mobile}px)`,
    )
    expect(appCss).toContain(
      `@media (max-width: ${defaultTheme.breakpoints.compact}px)`,
    )
    expect(appCss).toContain(
      `@media (max-width: ${defaultTheme.breakpoints.mobile}px)`,
    )
    expect(indexCss).toContain(
      `@media (max-width: ${defaultTheme.breakpoints.compact}px)`,
    )
  })

  it('consumes theme tokens for component spacing and visual values', () => {
    expect(appCss).not.toMatch(
      /(?:gap|padding(?:-[a-z]+)?|margin(?:-[a-z]+)?|border-radius|z-index):[^;]*(?:\d+(?:\.\d+)?px|rgba\()/,
    )
    expect(appCss).not.toMatch(/font-size:\s*(?:0\.85em|1\.25em)/)
    expect(appCss).not.toContain('rgba(0, 0, 0, 0.4)')
    expect(appCss).toMatch(
      /\.page-composer\s*\{[^}]*max-width:\s*var\(--page-measure,\s*var\(--layout-reading\)\)/,
    )
  })

  it('puts the month calendar in a horizontal scroll wrapper', () => {
    stubMatchMedia(false)
    render(
      <PageComposer
        modules={[
          {
            id: 'month',
            type: 'calendar',
            mode: 'static',
            config: {
              title: 'Event calendar',
              layout: 'month',
              month: '2026-09',
              events: [{ date: '2026-09-01', title: 'Kickoff' }],
            },
          },
        ]}
      />,
    )
    expect(document.querySelector('.module-calendar__grid-wrap')).toBeTruthy()
    expect(
      document.querySelector('.module-calendar__grid-wrap .module-calendar__grid'),
    ).toBeTruthy()
  })
})
