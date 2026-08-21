/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it } from 'vitest'
import { AppShell } from '../../src/App.tsx'
import {
  canStepMonth,
  clampMonthToSteppingRange,
  selectUpcomingEvents,
  type CalendarEvent,
} from '../../src/modules/pages/modular-pages/calendar-events.ts'
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

  it('pairs next-event cards with the month grid when layout is hybrid', () => {
    render(
      <PageComposer
        modules={[
          {
            id: 'events',
            type: 'calendar',
            mode: 'static',
            config: {
              title: 'Event calendar',
              layout: 'hybrid',
              upcomingCount: 2,
              events: [
                { id: 'past', date: '2020-01-05', title: 'Old news' },
                { id: 'third', date: '2026-12-02', title: 'Third up' },
                { id: 'first', date: '2026-10-02', title: 'First up' },
                { id: 'second', date: '2026-11-02', title: 'Second up' },
              ],
            },
          },
        ]}
      />,
    )

    const cards = document.querySelector('.module-calendar__upcoming')
    expect(cards?.textContent).toContain('First up')
    expect(cards?.textContent).toContain('Second up')
    expect(cards?.textContent).not.toContain('Third up')
    expect(cards?.textContent).not.toContain('Old news')
    expect(screen.getByRole('heading', { level: 3, name: 'Next events' })).toBeTruthy()
    expect(screen.getByRole('table', { name: 'October 2026' })).toBeTruthy()
  })

  it('steps the month grid within this year and next year only', () => {
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
              events: [{ date: '2026-09-01', title: 'Kickoff' }],
            },
          },
        ]}
      />,
    )

    expect(screen.getByRole('table', { name: 'September 2026' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Next month' }))
    expect(screen.getByRole('table', { name: 'October 2026' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Previous month' }))
    expect(screen.getByRole('table', { name: 'September 2026' })).toBeTruthy()
  })

  it('clamps a month outside this year and next, and disables the far-end buttons', () => {
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
              month: '2029-03',
              events: [{ date: '2026-09-01', title: 'Kickoff' }],
            },
          },
        ]}
      />,
    )

    expect(screen.getByRole('table', { name: 'December 2027' })).toBeTruthy()
    expect(
      (screen.getByRole('button', { name: 'Next month' }) as HTMLButtonElement)
        .disabled,
    ).toBe(true)
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

describe('upcoming event selection', () => {
  function event(date: string, title: string): CalendarEvent {
    return { key: title, date, title, detail: '', time: '', location: '', link: '' }
  }

  const today = new Date(2026, 8, 10)

  it('takes the soonest events from today forward', () => {
    const selected = selectUpcomingEvents(
      [
        event('2026-09-20', 'Later'),
        event('2026-09-01', 'Passed'),
        event('2026-09-10', 'Today'),
      ],
      2,
      today,
    )

    expect(selected.map((item) => item.title)).toEqual(['Today', 'Later'])
  })

  it('shows the most recent events when every event is in the past', () => {
    const selected = selectUpcomingEvents(
      [event('2026-01-05', 'Oldest'), event('2026-08-05', 'Newest')],
      1,
      today,
    )

    expect(selected.map((item) => item.title)).toEqual(['Newest'])
  })

  it('keeps rows whose date is not an ISO day so nothing silently disappears', () => {
    const selected = selectUpcomingEvents([event('Autumn 2026', 'Undated')], 5, today)

    expect(selected.map((item) => item.title)).toEqual(['Undated'])
  })
})

describe('calendar month stepping range', () => {
  const today = new Date(2026, 8, 21)

  it('clamps months before this year and after next year', () => {
    expect(clampMonthToSteppingRange({ year: 2025, monthIndex: 11 }, today)).toEqual({
      year: 2026,
      monthIndex: 0,
    })
    expect(clampMonthToSteppingRange({ year: 2028, monthIndex: 0 }, today)).toEqual({
      year: 2027,
      monthIndex: 11,
    })
  })

  it('blocks stepping out of this year and next', () => {
    expect(canStepMonth({ year: 2026, monthIndex: 0 }, -1, today)).toBe(false)
    expect(canStepMonth({ year: 2027, monthIndex: 11 }, 1, today)).toBe(false)
    expect(canStepMonth({ year: 2026, monthIndex: 0 }, 1, today)).toBe(true)
  })
})

describe('demo page composition', () => {
  it('renders one sheet-backed example of each updatable type', () => {
    render(
      <MemoryRouter initialEntries={['/demo']}>
        <AppShell />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { level: 1, name: defaultText.demo.hero.title }),
    ).toBeTruthy()
    expect(
      screen.getByRole('heading', { name: defaultText.demo.live.title }),
    ).toBeTruthy()
    expect(
      screen.getByRole('heading', { name: defaultText.demo.live.textTitle }),
    ).toBeTruthy()
    expect(
      screen.getByRole('heading', { name: defaultText.demo.live.cardsTitle }),
    ).toBeTruthy()
    expect(
      screen.getByRole('heading', { name: defaultText.demo.live.eventsTitle }),
    ).toBeTruthy()
    expect(
      screen.getByRole('heading', { name: defaultText.demo.live.upcomingTitle }),
    ).toBeTruthy()
    expect(screen.getByRole('table')).toBeTruthy()
  })

  it('renders the contact info module on the contact page', () => {
    render(
      <MemoryRouter initialEntries={['/about/contact']}>
        <AppShell />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: defaultText.contact.info.title }),
    ).toBeTruthy()
    expect(
      screen.getAllByText(defaultText.contact.info.labelOne).length,
    ).toBeGreaterThan(0)
    expect(
      screen.getByRole('link', { name: defaultText.contact.info.valueOne }),
    ).toBeTruthy()
    expect(
      screen.getByRole('heading', { name: defaultText.contact.form.title }),
    ).toBeTruthy()
    expect(screen.getByRole('button', { name: defaultText.contact.form.submit })).toBeTruthy()
  })
})
