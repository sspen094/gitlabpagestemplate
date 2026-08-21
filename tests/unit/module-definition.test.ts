import { describe, expect, it } from 'vitest'
import { getRegisteredTypes } from '../../src/modules/pages/modular-pages/registry.ts'
import { prepareModule } from '../../src/modules/pages/modular-pages/validate.ts'

const types = getRegisteredTypes()

const validPlaceholder = {
  id: 'hero',
  type: 'placeholder',
  mode: 'static' as const,
  config: { titleKey: 'home.hero.title' },
}

describe('module definition model', () => {
  it('accepts a static placeholder that matches the registered type', () => {
    const prepared = prepareModule(validPlaceholder, types)
    expect(prepared.renderMode).toBe('component')
    expect(prepared.valid).toBe(true)
    expect(prepared.instance.type).toBe('placeholder')
    expect(prepared.instance.mode).toBe('static')
  })

  it('keeps dataSource and fallback on the instance for later hydration', () => {
    const prepared = prepareModule(
      {
        ...validPlaceholder,
        mode: 'updatable',
        dataSource: {
          kind: 'sheets',
          publishedUrl: 'https://example.invalid/sheet',
          tab: 'Home',
        },
        fallback: { messageKey: 'modules.fallback.unhydrated' },
      },
      types,
    )
    expect(prepared.renderMode).toBe('component')
    expect(prepared.issues.some((issue) => issue.code === 'updatable-unhydrated')).toBe(
      true,
    )
    expect(prepared.instance.dataSource?.tab).toBe('Home')
    expect(prepared.instance.fallback?.messageKey).toBe(
      'modules.fallback.unhydrated',
    )
  })

  it('falls back for an unknown module type', () => {
    const prepared = prepareModule(
      { ...validPlaceholder, type: 'faq' },
      types,
    )
    expect(prepared.renderMode).toBe('fallback')
    expect(prepared.valid).toBe(false)
    expect(prepared.issues.some((issue) => issue.code === 'unknown-type')).toBe(true)
  })

  it('falls back when required placeholder config is missing', () => {
    const prepared = prepareModule(
      { ...validPlaceholder, config: {} },
      types,
    )
    expect(prepared.renderMode).toBe('fallback')
    expect(prepared.issues.some((issue) => issue.code === 'missing-config')).toBe(
      true,
    )
  })

  it('accepts registered baseline types and falls back for incomplete image or calendar config', () => {
    expect(types.has('hero')).toBe(true)
    expect(types.has('calendar')).toBe(true)
    expect(types.has('contact-form')).toBe(true)

    const hero = prepareModule(
      {
        id: 'hero',
        type: 'hero',
        mode: 'static',
        config: { title: 'Hello' },
      },
      types,
    )
    expect(hero.renderMode).toBe('component')

    const image = prepareModule(
      {
        id: 'photo',
        type: 'image',
        mode: 'static',
        config: { src: '/favicon.svg' },
      },
      types,
    )
    expect(image.renderMode).toBe('fallback')

    const calendar = prepareModule(
      {
        id: 'events',
        type: 'calendar',
        mode: 'static',
        config: { title: 'Events', events: [] },
      },
      types,
    )
    expect(calendar.renderMode).toBe('fallback')
  })

  it('falls back for invalid mode or missing id', () => {
    expect(
      prepareModule({ ...validPlaceholder, mode: 'live' }, types).renderMode,
    ).toBe('fallback')
    expect(prepareModule({ ...validPlaceholder, id: '' }, types).renderMode).toBe(
      'fallback',
    )
    expect(prepareModule(null, types).renderMode).toBe('fallback')
  })
})
