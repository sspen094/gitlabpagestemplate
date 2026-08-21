/** @vitest-environment jsdom */

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { cleanup, render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it } from 'vitest'
import { AppShell } from '../../src/App.tsx'
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
      /grid-template-columns:\s*repeat\(auto-fit,\s*minmax\(min\(14rem,\s*100%\),\s*1fr\)\)/,
    )
    expect(appCss).not.toMatch(/minmax\(\s*\d+(?:\.\d+)?rem\s*,/)
  })

  it('puts the month calendar in a horizontal scroll wrapper', () => {
    stubMatchMedia(false)
    render(
      <MemoryRouter initialEntries={['/demo']}>
        <AppShell />
      </MemoryRouter>,
    )
    expect(document.querySelector('.module-calendar__grid-wrap')).toBeTruthy()
    expect(
      document.querySelector('.module-calendar__grid-wrap .module-calendar__grid'),
    ).toBeTruthy()
  })
})
