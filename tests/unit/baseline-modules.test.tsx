/** @vitest-environment jsdom */

import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it } from 'vitest'
import { AppShell } from '../../src/App.tsx'
import { PageComposer } from '../../src/modules/pages/modular-pages/pipeline.tsx'
import { defaultText } from '../../src/modules/text/t-lookup/text-config.ts'

afterEach(() => {
  cleanup()
})

describe('baseline modules', () => {
  it('renders hero, text, image, cards, section, and calendar from config', () => {
    render(
      <MemoryRouter>
        <PageComposer
          modules={[
            {
              id: 'hero',
              type: 'hero',
              mode: 'static',
              config: { title: 'Hero title', subtitle: 'Hero subtitle' },
            },
            {
              id: 'copy',
              type: 'text',
              mode: 'static',
              config: { title: 'Text title', body: 'Text body' },
            },
            {
              id: 'photo',
              type: 'image',
              mode: 'static',
              config: { src: '/favicon.svg', alt: 'Example mark' },
            },
            {
              id: 'group',
              type: 'section',
              mode: 'static',
              config: {
                title: 'Section title',
                children: [
                  {
                    id: 'cards',
                    type: 'card-list',
                    mode: 'static',
                    config: {
                      title: 'Cards title',
                      entries: [
                        { title: 'Card one', body: 'Card body' },
                        { title: 'Card two' },
                      ],
                    },
                  },
                  {
                    id: 'events',
                    type: 'calendar',
                    mode: 'static',
                    config: {
                      title: 'Calendar title',
                      events: [
                        {
                          date: '2026-09-01',
                          title: 'Kickoff',
                          detail: 'Example event',
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ]}
        />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Hero title' })).toBeTruthy()
    expect(screen.getByText('Hero subtitle')).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: 'Text title' })).toBeTruthy()
    expect(screen.getByText('Text body')).toBeTruthy()
    expect(screen.getByRole('img', { name: 'Example mark' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: 'Section title' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 3, name: 'Cards title' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 4, name: 'Card one' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 3, name: 'Calendar title' })).toBeTruthy()
    expect(screen.getByText('Kickoff')).toBeTruthy()
    expect(screen.getByText('Example event')).toBeTruthy()
  })

  it('falls back when an image is missing alt text', () => {
    render(
      <PageComposer
        modules={[
          {
            id: 'photo',
            type: 'image',
            mode: 'static',
            config: { src: '/favicon.svg' },
            fallback: { message: 'Image needs alt' },
          },
        ]}
      />,
    )

    expect(screen.getByText('Image needs alt')).toBeTruthy()
    expect(screen.queryByRole('img')).toBeNull()
  })
})

describe('calendar layouts', () => {
  it('places events on their day when layout is a month grid', () => {
    render(
      <PageComposer
        modules={[
          {
            id: 'events',
            type: 'calendar',
            mode: 'static',
            config: {
              title: 'Event calendar',
              layout: 'month',
              month: '2026-09',
              events: [
                { id: 'kickoff', date: '2026-09-01', title: 'Kickoff' },
                { id: 'review', date: '2026-09-15', title: 'Review' },
                { id: 'other-month', date: '2026-10-02', title: 'Later' },
              ],
            },
          },
        ]}
      />,
    )

    const grid = screen.getByRole('table', { name: 'September 2026' })
    expect(screen.getByRole('columnheader', { name: 'Sun' })).toBeTruthy()

    const kickoffDay = screen.getByText('Kickoff').closest('td')
    expect(kickoffDay?.querySelector('time')?.getAttribute('datetime')).toBe(
      '2026-09-01',
    )
    const reviewDay = screen.getByText('Review').closest('td')
    expect(reviewDay?.querySelector('time')?.getAttribute('datetime')).toBe(
      '2026-09-15',
    )
    expect(grid.textContent).not.toContain('Later')
  })

  it('falls back when the month layout config is malformed', () => {
    render(
      <PageComposer
        modules={[
          {
            id: 'events',
            type: 'calendar',
            mode: 'static',
            config: {
              title: 'Event calendar',
              layout: 'month',
              month: '09-2026',
              events: [{ date: '2026-09-01', title: 'Kickoff' }],
            },
            fallback: { message: 'Calendar month must be YYYY-MM' },
          },
        ]}
      />,
    )

    expect(screen.getByText('Calendar month must be YYYY-MM')).toBeTruthy()
    expect(screen.queryByRole('table')).toBeNull()
  })
})

describe('demo page composition', () => {
  it('renders default demo modules including calendar events', () => {
    render(
      <MemoryRouter initialEntries={['/demo']}>
        <AppShell />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { level: 1, name: defaultText.demo.hero.title }),
    ).toBeTruthy()
    expect(screen.getByText(defaultText.demo.intro.body)).toBeTruthy()
    expect(
      screen.getByRole('img', {
        name: 'Template mark used as example module media',
      }),
    ).toBeTruthy()
    expect(screen.getByText(defaultText.demo.cards.oneTitle)).toBeTruthy()
    expect(
      screen.getAllByText(defaultText.demo.calendar.oneTitle).length,
    ).toBeGreaterThan(0)
    expect(
      screen.getByRole('heading', { name: defaultText.demo.calendar.title }),
    ).toBeTruthy()
    expect(
      screen.getByRole('heading', {
        name: defaultText.demo.calendar.monthTitle,
      }),
    ).toBeTruthy()
  })
})
