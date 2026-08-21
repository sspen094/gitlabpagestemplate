/** @vitest-environment jsdom */

import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it } from 'vitest'
import { AppShell } from '../../src/App.tsx'
import { PageComposer } from '../../src/modules/pages/modular-pages/pipeline.tsx'
import { defaultPages } from '../../src/modules/pages/modular-pages/pages-config.ts'
import type { PageDefinition } from '../../src/modules/pages/modular-pages/types.ts'
import { defaultText } from '../../src/modules/text/t-lookup/text-config.ts'

afterEach(() => {
  cleanup()
})

describe('page composer', () => {
  it('renders configured module instances in order', () => {
    render(
      <PageComposer
        modules={[
          {
            id: 'first',
            type: 'placeholder',
            mode: 'static',
            config: { title: 'First' },
          },
          {
            id: 'second',
            type: 'placeholder',
            mode: 'static',
            config: { title: 'Second' },
          },
        ]}
      />,
    )

    const modules = screen.getAllByRole('region')
    expect(modules.map((node) => node.getAttribute('data-module-id'))).toEqual([
      'first',
      'second',
    ])
    expect(screen.getByRole('heading', { name: 'First' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Second' })).toBeTruthy()
  })

  it('renders fallback for an unknown type instead of crashing', () => {
    render(
      <PageComposer
        modules={[
          {
            id: 'bad',
            type: 'does-not-exist',
            mode: 'static',
            config: { title: 'Nope' },
            fallback: { message: 'Custom fallback' },
          },
        ]}
      />,
    )

    expect(screen.getByText('Custom fallback')).toBeTruthy()
    expect(
      screen.getByRole('region', { name: 'Custom fallback' }).getAttribute(
        'data-module-render',
      ),
    ).toBe('fallback')
  })
})

describe('page registration', () => {
  it('renders a page added only as config, with no custom page component', () => {
    const extra: PageDefinition = {
      id: 'extra',
      path: '/extra',
      modules: [
        {
          id: 'extra-hero',
          type: 'placeholder',
          mode: 'static',
          config: { title: 'Extra page from config' },
        },
      ],
    }

    render(
      <MemoryRouter initialEntries={['/extra']}>
        <AppShell pages={[...defaultPages, extra]} />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: 'Extra page from config' }),
    ).toBeTruthy()
  })

  it('renders the demo page registered in defaultPages', () => {
    render(
      <MemoryRouter initialEntries={['/demo']}>
        <AppShell />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: defaultText.demo.live.title }),
    ).toBeTruthy()
    expect(screen.getByText(defaultText.demo.live.textBody)).toBeTruthy()
  })
})
