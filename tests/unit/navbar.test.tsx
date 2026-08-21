/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { Navbar } from '../../src/modules/navigation/navbar/Navbar.tsx'
import {
  isHrefActive,
  isSectionActive,
} from '../../src/modules/navigation/navbar/active.ts'
import { defaultNav } from '../../src/modules/navigation/navbar/nav-config.ts'
import type { NavItem } from '../../src/modules/navigation/navbar/types.ts'
import { defaultText } from '../../src/modules/text/t-lookup/text-config.ts'
import { stubMatchMedia } from './stub-match-media.ts'

beforeEach(() => {
  stubMatchMedia(false)
})

afterEach(() => {
  cleanup()
  stubMatchMedia(false)
})

function renderNav(
  path: string,
  items: readonly NavItem[] = defaultNav,
) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Navbar items={items} />
    </MemoryRouter>,
  )
}

describe('navbar', () => {
  it('renders top-level pages, a section, and dropdown subsections', () => {
    renderNav('/')

    expect(
      screen.getByRole('navigation', { name: defaultText.nav.chrome.label }),
    ).toBeTruthy()
    expect(
      screen.getByRole('link', { name: defaultText.nav.items.home }).getAttribute(
        'href',
      ),
    ).toBe('/')
    expect(
      screen.getByRole('link', { name: defaultText.nav.items.events }).getAttribute(
        'href',
      ),
    ).toBe('/events')
    const about = screen.getByRole('link', { name: defaultText.nav.items.about })
    expect(about.getAttribute('href')).toBe('/about')
    expect(about.getAttribute('aria-haspopup')).toBe('true')
    expect(about.getAttribute('aria-expanded')).toBe('false')

    about.focus()
    fireEvent.keyDown(about, { key: 'ArrowDown' })

    expect(about.getAttribute('aria-expanded')).toBe('true')
    expect(
      screen
        .getByRole('menuitem', { name: defaultText.nav.items.contact })
        .getAttribute('href'),
    ).toBe('/about/contact')
    expect(
      screen
        .getByRole('menuitem', { name: defaultText.nav.items.members })
        .getAttribute('href'),
    ).toBe('/about/members')
  })

  it('surfaces a new item when the nav config gains an entry', () => {
    const extra: NavItem = {
      id: 'faq',
      kind: 'link',
      labelKey: 'nav.items.faq',
      href: '/faq',
    }

    renderNav('/', [...defaultNav, extra])

    expect(screen.getByRole('link', { name: 'nav.items.faq' }).getAttribute('href')).toBe(
      '/faq',
    )
  })

  it('marks the current route as the active page', () => {
    renderNav('/events')

    const events = screen.getByRole('link', { name: defaultText.nav.items.events })
    expect(events.getAttribute('aria-current')).toBe('page')
    expect(events.className).toContain('is-active')

    const home = screen.getByRole('link', { name: defaultText.nav.items.home })
    expect(home.getAttribute('aria-current')).toBeNull()
  })

  it('marks a section active when a subsection is current', () => {
    renderNav('/about/contact')

    const about = screen.getByRole('link', { name: defaultText.nav.items.about })
    fireEvent.keyDown(about, { key: 'ArrowDown' })

    const contact = screen.getByRole('menuitem', {
      name: defaultText.nav.items.contact,
    })
    expect(contact.getAttribute('aria-current')).toBe('page')

    const aboutItem = document.querySelector('[data-nav-id="about"]')
    expect(aboutItem?.className).toContain('is-active')
  })
})

describe('nav active matching', () => {
  it('matches normalized paths and section children', () => {
    expect(isHrefActive('/events/', '/events')).toBe(true)
    expect(isHrefActive('/about', '/events')).toBe(false)

    const about = defaultNav.find((item) => item.id === 'about')
    if (!about || about.kind !== 'section') {
      throw new Error('expected about section in defaultNav')
    }
    expect(isSectionActive('/about/members', about)).toBe(true)
    expect(isSectionActive('/', about)).toBe(false)
  })
})

describe('navbar keyboard', () => {
  it('moves across top-level items with arrow keys', () => {
    renderNav('/')

    const home = screen.getByRole('link', { name: defaultText.nav.items.home })
    const events = screen.getByRole('link', { name: defaultText.nav.items.events })
    home.focus()
    fireEvent.keyDown(home, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(events)

    fireEvent.keyDown(events, { key: 'ArrowLeft' })
    expect(document.activeElement).toBe(home)
  })

  it('opens the submenu with ArrowDown and closes with Escape', async () => {
    renderNav('/')

    const about = screen.getByRole('link', { name: defaultText.nav.items.about })
    about.focus()
    fireEvent.keyDown(about, { key: 'ArrowDown' })

    const contact = await screen.findByRole('menuitem', {
      name: defaultText.nav.items.contact,
    })
    expect(about.getAttribute('aria-expanded')).toBe('true')
    expect(document.activeElement).toBe(contact)

    fireEvent.keyDown(contact, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(
      screen.getByRole('menuitem', { name: defaultText.nav.items.members }),
    )

    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'Escape' })
    expect(about.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(about)
  })
})

describe('navbar mobile drawer', () => {
  it('shows a hamburger that opens a side menu of configured items', () => {
    stubMatchMedia(true)
    renderNav('/')

    expect(
      screen.queryByRole('link', { name: defaultText.nav.items.home }),
    ).toBeNull()

    fireEvent.click(
      screen.getByRole('button', { name: defaultText.nav.chrome.openMenu }),
    )

    expect(
      screen.getByRole('dialog', { name: defaultText.nav.chrome.menu }),
    ).toBeTruthy()
    expect(
      screen.getByRole('link', { name: defaultText.nav.items.home }).getAttribute(
        'href',
      ),
    ).toBe('/')
    expect(
      screen
        .getByRole('link', { name: defaultText.nav.items.contact })
        .getAttribute('href'),
    ).toBe('/about/contact')
    expect(
      screen
        .getByRole('link', { name: defaultText.nav.items.members })
        .getAttribute('href'),
    ).toBe('/about/members')

    fireEvent.click(
      screen.getByRole('button', { name: defaultText.nav.chrome.closeMenu }),
    )
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('closes the drawer on Escape', () => {
    stubMatchMedia(true)
    renderNav('/')
    fireEvent.click(
      screen.getByRole('button', { name: defaultText.nav.chrome.openMenu }),
    )
    expect(screen.getByRole('dialog')).toBeTruthy()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
