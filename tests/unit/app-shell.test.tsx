/** @vitest-environment jsdom */

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { AppShell } from '../../src/App.tsx'
import { defaultText } from '../../src/modules/text/t-lookup/text-config.ts'

describe('app shell', () => {
  it('renders the placeholder landing with no external data', () => {
    render(
      <MemoryRouter>
        <AppShell />
      </MemoryRouter>,
    )
    expect(screen.getByText(defaultText.home.header.brand)).toBeTruthy()
    expect(
      screen.getByRole('heading', { name: defaultText.home.hero.title }),
    ).toBeTruthy()
    expect(screen.getByText(defaultText.home.hero.body)).toBeTruthy()
  })
})
