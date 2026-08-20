import { describe, expect, it } from 'vitest'
import { normalizePagesBase } from '../../vite.base.ts'

describe('normalizePagesBase', () => {
  it('defaults empty and slash to root', () => {
    expect(normalizePagesBase(undefined)).toBe('/')
    expect(normalizePagesBase('')).toBe('/')
    expect(normalizePagesBase(' / ')).toBe('/')
    expect(normalizePagesBase('/')).toBe('/')
  })

  it('keeps relative ./ base', () => {
    expect(normalizePagesBase('./')).toBe('./')
  })

  it('normalizes a GitHub Pages repo path', () => {
    expect(normalizePagesBase('ex-react')).toBe('/ex-react/')
    expect(normalizePagesBase('/ex-react')).toBe('/ex-react/')
    expect(normalizePagesBase('/ex-react/')).toBe('/ex-react/')
  })
})
