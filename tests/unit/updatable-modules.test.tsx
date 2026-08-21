/** @vitest-environment jsdom */

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import type { FetchLike } from '../../src/modules/data-sources/feed-client/index.ts'
import { PageComposer } from '../../src/modules/pages/modular-pages/pipeline.tsx'
import type { ModuleInstance } from '../../src/modules/pages/modular-pages/types.ts'
import { defaultText } from '../../src/modules/text/t-lookup/text-config.ts'
import {
  resetUpdatableFetch,
  setUpdatableFetch,
} from '../../src/modules/updatable-content/sheets-hydration/runtime.ts'
import { resolveModuleMapping } from '../../src/modules/updatable-content/sheets-hydration/useUpdatableModule.ts'

function feed(body: string): FetchLike {
  return async () => ({ ok: true, status: 200, text: async () => body })
}

function failingFeed(): FetchLike {
  return async () => {
    throw new Error('network down')
  }
}

function updatable(
  type: string,
  config: Record<string, unknown>,
  withSource = true,
): ModuleInstance {
  return {
    id: `u-${type}`,
    type,
    mode: 'updatable',
    config,
    dataSource: withSource
      ? { kind: 'sheets', publishedUrl: 'https://sheet/feed' }
      : undefined,
    fallback: { messageKey: 'updatable.fallback.unavailable' },
  }
}

const textShell = {
  titleKey: 'home.updates.title',
  blocks: [{ id: 'shell', textKey: 'home.updates.body' }],
}

const cardShell = {
  layout: 'grid',
  titleKey: 'members.directory.title',
  entries: [{ id: 'shell', titleKey: 'members.directory.cardOneTitle' }],
}

const eventShell = {
  layout: 'list',
  titleKey: 'events.calendar.title',
  events: [
    {
      id: 'shell',
      date: '2026-10-01',
      titleKey: 'events.calendar.eventOneTitle',
    },
  ],
}

const contactShell = {
  titleKey: 'contact.info.title',
  entries: [
    { id: 'shell', labelKey: 'contact.info.labelOne', valueKey: 'contact.info.valueOne' },
  ],
}

afterEach(() => {
  cleanup()
  resetUpdatableFetch()
})

describe('updatable module hydration', () => {
  it('matches a parent module to its same-named worksheet without sourceId', () => {
    const mapping = resolveModuleMapping({
      id: 'demo-calendar',
      type: 'calendar',
      mode: 'updatable',
      config: {},
    })

    expect(mapping?.moduleId).toBe('demo-calendar')
    expect(mapping?.tab).toBe('demo-calendar')
    expect(mapping?.type).toBe('event-list')
  })

  it('paints the static shell before the feed resolves (non-blocking)', () => {
    setUpdatableFetch(feed('text\nLive body'))
    render(<PageComposer modules={[updatable('text', textShell)]} />)

    expect(
      screen.getByRole('heading', { name: defaultText.home.updates.title }),
    ).toBeTruthy()
  })

  it('hydrates a text block from a published feed', async () => {
    setUpdatableFetch(feed('text\nLive body'))
    render(<PageComposer modules={[updatable('text', textShell)]} />)

    expect(
      await screen.findByRole('heading', {
        name: defaultText.home.updates.title,
      }),
    ).toBeTruthy()
    expect(screen.getByText('Live body')).toBeTruthy()
  })

  it('adds one paragraph per text row instead of only the first', async () => {
    setUpdatableFetch(feed('text\nFirst\nSecond\nThird'))
    render(<PageComposer modules={[updatable('text', textShell)]} />)

    expect(await screen.findByText('First')).toBeTruthy()
    expect(screen.getByText('Second')).toBeTruthy()
    expect(screen.getByText('Third')).toBeTruthy()
  })

  it('renders a card row that carries only a description', async () => {
    setUpdatableFetch(feed('title,description\n,Body only'))
    render(<PageComposer modules={[updatable('card-list', cardShell)]} />)

    expect(await screen.findByText('Body only')).toBeTruthy()
  })

  it('renders the subtitle, link, and image columns of a card', async () => {
    setUpdatableFetch(
      feed('title,subtitle,link,imageUrl\nAlpha,Sub,example.com,https://img.test/a.png'),
    )
    render(<PageComposer modules={[updatable('card-list', cardShell)]} />)

    const link = await screen.findByRole('link', { name: 'Alpha' })
    expect(link.getAttribute('href')).toBe('https://example.com')
    expect(screen.getByText('Sub')).toBeTruthy()
    expect(
      document.querySelector('img.module-card__image')?.getAttribute('src'),
    ).toBe('https://img.test/a.png')
  })

  it('hydrates a card list and enforces the collection limit', async () => {
    setUpdatableFetch(feed('title\nA\nB\nC\nD\nE'))
    render(
      <PageComposer
        modules={[updatable('card-list', { ...cardShell, limit: 2 })]}
      />,
    )

    expect(await screen.findByText('A')).toBeTruthy()
    expect(screen.getByText('B')).toBeTruthy()
    expect(screen.queryByText('C')).toBeNull()
  })

  it('hydrates events into the calendar', async () => {
    setUpdatableFetch(feed('title,date\nLaunch Day,2026-11-05'))
    render(<PageComposer modules={[updatable('calendar', eventShell)]} />)

    expect(await screen.findByText('Launch Day')).toBeTruthy()
  })

  it('accepts a date in the format a Google Sheets column exports', async () => {
    setUpdatableFetch(feed('title,date,location\nLaunch Day,11/5/2026,Studio'))
    render(<PageComposer modules={[updatable('calendar', eventShell)]} />)

    expect(await screen.findByText('Launch Day')).toBeTruthy()
    expect(screen.getByText('Studio')).toBeTruthy()
    expect(document.querySelector('time')?.getAttribute('datetime')).toBe(
      '2026-11-05',
    )
  })

  it('hydrates contact entries into linked values', async () => {
    setUpdatableFetch(feed('label,value,type\nEmail,team@example.test,email'))
    render(<PageComposer modules={[updatable('contact', contactShell)]} />)

    const link = await screen.findByRole('link', { name: 'team@example.test' })
    expect(link.getAttribute('href')).toBe('mailto:team@example.test')
    expect(screen.getByText('Email')).toBeTruthy()
  })

  it('renders fallback copy when the feed fails', async () => {
    setUpdatableFetch(failingFeed())
    render(<PageComposer modules={[updatable('text', textShell)]} />)

    expect(
      await screen.findByText(defaultText.updatable.fallback.unavailable),
    ).toBeTruthy()
  })

  it('falls back when every row is malformed', async () => {
    setUpdatableFetch(feed('title,date\nNo date,not-a-date'))
    render(<PageComposer modules={[updatable('calendar', eventShell)]} />)

    expect(
      await screen.findByText(defaultText.updatable.fallback.malformed),
    ).toBeTruthy()
  })

  it('keeps the static shell when no source is configured', () => {
    render(
      <PageComposer modules={[updatable('text', textShell, false)]} />,
    )

    expect(
      screen.getByRole('heading', { name: defaultText.home.updates.title }),
    ).toBeTruthy()
  })
})
