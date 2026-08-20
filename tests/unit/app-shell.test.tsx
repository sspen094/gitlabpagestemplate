/** @vitest-environment jsdom */

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../../src/App.tsx'
import { defaultText } from '../../src/modules/text/t-lookup/text-config.ts'

describe('app shell', () => {
  it('renders the placeholder landing with no external data', () => {
    render(<App />)
    expect(screen.getByText(defaultText.home.header.brand)).toBeTruthy()
    expect(
      screen.getByRole('heading', { name: defaultText.home.hero.title }),
    ).toBeTruthy()
    expect(
      screen.getByText(/static React template for GitHub Pages/i),
    ).toBeTruthy()
  })
})
