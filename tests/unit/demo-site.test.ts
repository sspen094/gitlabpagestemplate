import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { defaultNav } from '../../src/modules/navigation/navbar/nav-config.ts'
import { defaultPages } from '../../src/modules/pages/modular-pages/pages-config.ts'
import type { ModuleInstance } from '../../src/modules/pages/modular-pages/types.ts'
import { sheetMappings } from '../../src/modules/updatable-content/sheets-hydration/sheet-mappings.ts'

const fixtureRoot = new URL('../fixtures/google-sheets/', import.meta.url)

function flattenModules(modules: readonly ModuleInstance[]): ModuleInstance[] {
  return modules.flatMap((module) => {
    const children = Array.isArray(module.config.children)
      ? (module.config.children as ModuleInstance[])
      : []
    return [module, ...flattenModules(children)]
  })
}

describe('realistic sample site', () => {
  it('uses believable routes and retires the component-gallery route', () => {
    expect(defaultPages.map((page) => page.path)).toEqual([
      '/',
      '/events',
      '/about',
      '/about/contact',
      '/about/members',
    ])
    expect(defaultPages.some((page) => page.path === '/demo')).toBe(false)
    expect(defaultNav.some((item) => item.href === '/events')).toBe(true)
    expect(defaultNav.some((item) => item.href === '/demo')).toBe(false)
  })

  it('places every shipped content module and update pattern in page config', () => {
    const modules = flattenModules(defaultPages.flatMap((page) => page.modules))
    const types = new Set(modules.map((module) => module.type))

    expect(types).toEqual(
      new Set([
        'hero',
        'section',
        'text',
        'image',
        'calendar',
        'contact',
        'contact-form',
        'card-list',
      ]),
    )
    expect(
      modules
        .filter((module) => module.mode === 'updatable')
        .map((module) => module.id),
    ).toEqual(['demo-text', 'demo-calendar', 'contact-info', 'demo-cards'])
  })

  it('keeps a committed placeholder fixture for every live sheet mapping', () => {
    for (const mapping of sheetMappings) {
      const fixture = readFileSync(
        new URL(`${mapping.tab ?? mapping.id}.csv`, fixtureRoot),
        'utf8',
      )
      expect(fixture.trim().split(/\r?\n/).length).toBeGreaterThan(1)
      expect(fixture).toMatch(/sample|placeholder|fictional|example\.test/i)
    }
  })
})
