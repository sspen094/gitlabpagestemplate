/** @vitest-environment jsdom */

import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import {
  isFullTextKey,
  isGroupedTextKey,
  normalizeTextKey,
} from '../../src/modules/text/t-lookup/keys.ts'
import { createT, t } from '../../src/modules/text/t-lookup/t.ts'
import { defaultText, type TextTree } from '../../src/modules/text/t-lookup/text-config.ts'
import { TextProvider } from '../../src/modules/text/t-lookup/TextProvider.tsx'
import { useText } from '../../src/modules/text/t-lookup/useText.ts'
import {
  resetActiveTextTree,
  resetTextFallback,
  setActiveTextTree,
  setTextFallback,
} from '../../src/modules/text/t-lookup/text-runtime.ts'

afterEach(() => {
  resetActiveTextTree()
  resetTextFallback()
})

describe('text key grouping', () => {
  it('requires at least [page].[section]', () => {
    expect(isGroupedTextKey('home')).toBe(false)
    expect(isGroupedTextKey('home.hero')).toBe(true)
    expect(isGroupedTextKey('home.hero.title')).toBe(true)
    expect(isGroupedTextKey('')).toBe(false)
  })

  it('treats [page].[section].[item] as a full key', () => {
    expect(isFullTextKey('home.hero')).toBe(false)
    expect(isFullTextKey('home.hero.title')).toBe(true)
  })

  it('normalizes extra dots and whitespace', () => {
    expect(normalizeTextKey(' home.hero.title ')).toBe('home.hero.title')
    expect(normalizeTextKey('home..hero.title')).toBe('home.hero.title')
  })
})

describe('t()', () => {
  it('resolves known [page].[section].[item] keys from the central store', () => {
    expect(t('home.header.brand')).toBe(defaultText.home.header.brand)
    expect(t('home.hero.title')).toBe(defaultText.home.hero.title)
    expect(t('home.hero.body')).toBe(defaultText.home.hero.body)
  })

  it('echoes a missing key and does not throw', () => {
    expect(() => t('home.hero.missing')).not.toThrow()
    expect(t('home.hero.missing')).toBe('home.hero.missing')
  })

  it('falls back for malformed keys without throwing', () => {
    expect(() => t('not-a-key')).not.toThrow()
    expect(t('not-a-key')).toBe('not-a-key')
    expect(t('')).toBe('')
  })

  it('supports a configurable placeholder fallback', () => {
    setTextFallback({ mode: 'placeholder', placeholder: 'MISSING:{key}' })
    expect(t('home.hero.missing')).toBe('MISSING:home.hero.missing')
  })
})

describe('alternate text set', () => {
  const altTree: TextTree = {
    home: {
      hero: {
        title: 'Titre alternatif',
      },
    },
  }

  it('createT binds lookup to another tree without changing keys', () => {
    const altT = createT(altTree)
    expect(altT('home.hero.title')).toBe('Titre alternatif')
    expect(t('home.hero.title')).toBe(defaultText.home.hero.title)
  })

  it('setActiveTextTree swaps the module-level t() tree', () => {
    setActiveTextTree(altTree)
    expect(t('home.hero.title')).toBe('Titre alternatif')
  })
})

function Probe({ lookupKey }: { lookupKey: string }) {
  const lookup = useText()
  return <p>{lookup(lookupKey)}</p>
}

describe('TextProvider', () => {
  it('lets useText resolve against an alternate tree', () => {
    const altTree: TextTree = {
      home: {
        hero: {
          title: 'Locale title',
        },
      },
    }

    render(
      <TextProvider tree={altTree}>
        <Probe lookupKey="home.hero.title" />
      </TextProvider>,
    )

    expect(screen.getByText('Locale title')).toBeTruthy()
  })
})
