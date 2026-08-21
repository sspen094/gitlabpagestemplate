/**
 * Central developer-authored copy. Edit strings here; components use `t(key)`.
 * Shape is `[page][section][item]`. Swap an alternate tree via `TextProvider`,
 * `createT()`, or `setActiveTextTree()` without changing `t(key)` call sites.
 */
export type TextLeaf = string

export type TextSection = {
  [item: string]: TextLeaf
}

export type TextPage = {
  [section: string]: TextSection
}

export type TextTree = {
  [page: string]: TextPage
}

export const defaultText: TextTree = {
  home: {
    header: {
      brand: 'MY APP',
    },
    hero: {
      title: 'My Website Template',
      body: 'This is a static React template for GitHub Pages. Content modules and live data sources are not configured yet.',
      cta: 'See demo',
    },
  },
  demo: {
    hero: {
      title: 'Modular demo',
      subtitle: 'Baseline modules rendered from page configuration.',
      cta: 'Back home',
    },
    live: {
      title: 'Updatable from Google Sheets',
      textTitle: 'Announcements',
      textBody:
        'Placeholder copy shown until a published Google Sheet is connected. Each row of the worksheet becomes its own paragraph.',
      cardsTitle: 'Featured items',
      cardOneTitle: 'Sample card',
      cardOneBody: 'Connect a sheet to replace these cards.',
      eventsTitle: 'Upcoming events',
      upcomingTitle: 'Next five events',
      eventOneTitle: 'Sample event',
      eventOneDetail: 'Connect a sheet to replace these events.',
    },
  },
  nav: {
    chrome: {
      label: 'Primary',
      menu: 'Menu',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
    },
    items: {
      home: 'Home',
      demo: 'Demo',
      about: 'About',
      contact: 'Contact',
      members: 'Members',
    },
  },
  about: {
    hero: {
      title: 'About',
      body: 'Section landing. Subpages are listed in the About dropdown.',
    },
  },
  contact: {
    hero: {
      title: 'Contact',
      body: 'Example About subsection.',
    },
    info: {
      title: 'Get in touch',
      labelOne: 'Email',
      valueOne: 'hello@example.test',
    },
  },
  members: {
    hero: {
      title: 'Members',
      body: 'Example About subsection.',
    },
  },
  app: {
    notFound: {
      body: 'Page not found.',
    },
  },
  modules: {
    calendar: {
      upcoming: 'Next events',
      previousMonth: 'Previous month',
      nextMonth: 'Next month',
    },
    fallback: {
      unknownType: 'This module type is not registered.',
      invalid: 'This module could not be displayed.',
      unhydrated: 'This content is not available yet.',
    },
  },
  updatable: {
    fallback: {
      unavailable: 'This content is being updated and will appear shortly.',
      empty: 'No entries to show yet.',
      malformed: 'This content is temporarily unavailable.',
    },
  },
}
