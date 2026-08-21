/** @vitest-environment jsdom */

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { defaultPages } from '../../src/modules/pages/modular-pages/pages-config.ts'
import { PageComposer } from '../../src/modules/pages/modular-pages/pipeline.tsx'
import { getRegisteredTypes } from '../../src/modules/pages/modular-pages/registry.ts'
import {
  resolveModuleStyle,
  resolvePageAppearance,
} from '../../src/modules/pages/modular-pages/style.ts'
import type { ModuleInstance } from '../../src/modules/pages/modular-pages/types.ts'
import { prepareModule } from '../../src/modules/pages/modular-pages/validate.ts'
import { stubMatchMedia } from './stub-match-media.ts'

afterEach(() => {
  cleanup()
  stubMatchMedia(false)
})

const types = getRegisteredTypes()

function textModule(style?: ModuleInstance['style']): ModuleInstance {
  return {
    id: 'styled',
    type: 'text',
    mode: 'static',
    style,
    config: { title: 'Styled module', body: 'Body copy' },
  }
}

describe('page appearance options', () => {
  it('applies width, tone, and rhythm from page config', () => {
    render(
      <PageComposer
        modules={[textModule()]}
        appearance={{ width: 'shell', tone: 'muted', rhythm: 'roomy' }}
      />,
    )

    const page = document.querySelector('.page-composer')
    expect(page?.className).toContain('page-composer--width-shell')
    expect(page?.className).toContain('page-composer--tone-muted')
    expect(page?.className).toContain('page-composer--rhythm-roomy')
    expect(page?.getAttribute('data-page-width')).toBe('shell')
  })

  it('keeps the default reading measure when appearance is unset', () => {
    render(<PageComposer modules={[textModule()]} />)

    const page = document.querySelector('.page-composer')
    expect(page?.className.trim()).toBe('page-composer')
    expect(page?.getAttribute('data-page-width')).toBe('reading')
  })

  it('falls back to the defaults for unknown or malformed appearance values', () => {
    expect(
      resolvePageAppearance({ width: 'enormous', tone: 7, rhythm: 'default' }),
    ).toEqual({ width: 'reading', tone: 'default', rhythm: 'default' })
    expect(resolvePageAppearance(null)).toEqual({
      width: 'reading',
      tone: 'default',
      rhythm: 'default',
    })
  })
})

describe('module style options', () => {
  it('applies each style axis and keeps the module data hooks', () => {
    render(
      <PageComposer
        modules={[
          textModule({
            variant: 'feature',
            align: 'center',
            width: 'narrow',
            tone: 'accent',
            surface: 'card',
            spacing: 'roomy',
          }),
        ]}
      />,
    )

    const module = screen.getByRole('region', { name: 'Styled module' })
    expect(module.className).toBe(
      [
        'module-text',
        'module--variant-feature',
        'module--align-center',
        'module--width-narrow',
        'module--tone-accent',
        'module--surface-card',
        'module--spacing-roomy',
      ].join(' '),
    )
    expect(module.getAttribute('data-module-id')).toBe('styled')
    expect(module.getAttribute('data-module-type')).toBe('text')
    expect(module.getAttribute('data-module-mode')).toBe('static')
    expect(module.getAttribute('data-module-render')).toBe('component')
  })

  it('adds no style classes when style is unset', () => {
    render(<PageComposer modules={[textModule()]} />)

    expect(
      screen.getByRole('region', { name: 'Styled module' }).className,
    ).toBe('module-text')
  })

  it('degrades unknown style values to the default variant and still renders', () => {
    const prepared = prepareModule(
      {
        ...textModule({ variant: 'sparkly', surface: 'hologram' } as never),
      },
      types,
    )

    expect(prepared.renderMode).toBe('component')
    expect(prepared.valid).toBe(true)
    expect(prepared.issues.some((issue) => issue.code === 'style-degraded')).toBe(
      true,
    )

    render(
      <PageComposer
        modules={[textModule({ variant: 'sparkly' } as never)]}
      />,
    )
    const module = screen.getByRole('region', { name: 'Styled module' })
    expect(module.className).toBe('module-text')
    expect(module.getAttribute('data-module-variant')).toBe('default')
  })

  it('degrades a non-object style without throwing', () => {
    const prepared = prepareModule(
      { ...textModule(), style: 'feature' },
      types,
    )

    expect(prepared.renderMode).toBe('component')
    expect(prepared.issues.some((issue) => issue.code === 'style-degraded')).toBe(
      true,
    )
    expect(resolveModuleStyle('feature').style.variant).toBe('default')
  })
})

describe('layout folded into the style model', () => {
  const cards = [
    { id: 'one', title: 'One' },
    { id: 'two', title: 'Two' },
  ]

  function cardList(
    style?: ModuleInstance['style'],
    config: Record<string, unknown> = {},
  ): ModuleInstance {
    return {
      id: 'cards',
      type: 'card-list',
      mode: 'static',
      style,
      config: { title: 'Directory', entries: cards, ...config },
    }
  }

  it('reads the card layout from style, then legacy config, then the default', () => {
    render(<PageComposer modules={[cardList({ layout: 'list' })]} />)
    expect(document.querySelector('.module-cards__list--list')).toBeTruthy()
    cleanup()

    render(<PageComposer modules={[cardList(undefined, { layout: 'list' })]} />)
    expect(document.querySelector('.module-cards__list--list')).toBeTruthy()
    cleanup()

    render(<PageComposer modules={[cardList()]} />)
    expect(document.querySelector('.module-cards__list--grid')).toBeTruthy()
  })

  it('degrades an unknown card layout to the default grid', () => {
    render(<PageComposer modules={[cardList({ layout: 'carousel' })]} />)
    expect(document.querySelector('.module-cards__list--grid')).toBeTruthy()
  })

  it('drives the calendar layouts from style without changing behavior', () => {
    const events = [{ id: 'kickoff', date: '2026-09-01', title: 'Kickoff' }]

    render(
      <PageComposer
        modules={[
          {
            id: 'events',
            type: 'calendar',
            mode: 'static',
            style: { layout: 'month' },
            config: { title: 'Events', month: '2026-09', events },
          },
        ]}
      />,
    )
    expect(screen.getByRole('table', { name: 'September 2026' })).toBeTruthy()
    cleanup()

    render(
      <PageComposer
        modules={[
          {
            id: 'events',
            type: 'calendar',
            mode: 'static',
            style: { layout: 'hybrid' },
            config: { title: 'Events', month: '2026-09', events },
          },
        ]}
      />,
    )
    expect(document.querySelector('.module-calendar__hybrid')).toBeTruthy()
    cleanup()

    render(
      <PageComposer
        modules={[
          {
            id: 'events',
            type: 'calendar',
            mode: 'static',
            style: { layout: 'telepathy' } as never,
            config: { title: 'Events', events },
          },
        ]}
      />,
    )
    expect(screen.queryByRole('table')).toBeNull()
    expect(document.querySelector('.module-calendar__list')).toBeTruthy()
  })
})

describe('sample site style coverage', () => {
  it('exercises every style axis across the realistic pages', () => {
    const pages = defaultPages
    const modules = pages.flatMap((page) => page.modules)

    expect(pages.some((page) => page.appearance?.width === 'shell')).toBe(true)
    expect(pages.some((page) => page.appearance?.tone === 'muted')).toBe(true)
    expect(pages.some((page) => page.appearance?.rhythm)).toBe(true)
    expect(pages.some((page) => page.appearance === undefined)).toBe(true)

    const used = new Set(
      modules.flatMap((module) => Object.keys(module.style ?? {})),
    )
    for (const axis of [
      'variant',
      'align',
      'width',
      'tone',
      'surface',
      'spacing',
      'layout',
    ]) {
      expect(used.has(axis)).toBe(true)
    }
  })

  it('keeps every configured page and module style inside the closed vocabulary', () => {
    for (const page of defaultPages) {
      expect(resolvePageAppearance(page.appearance).width).toBe(
        page.appearance?.width ?? 'reading',
      )
      for (const module of page.modules) {
        expect(resolveModuleStyle(module.style, module.type).degraded).toEqual([])
      }
    }
  })
})
