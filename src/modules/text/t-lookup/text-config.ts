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
    intro: {
      title: 'Demo page',
      body: 'This page is registered from configuration only — no custom page component.',
    },
    image: {
      caption: 'Image block with required alt text',
    },
    section: {
      title: 'Grouped modules',
    },
    cards: {
      title: 'Card examples',
      oneTitle: 'First card',
      oneBody: 'Config-driven card copy.',
      twoTitle: 'Second card',
      twoBody: 'Cards sit in a responsive grid.',
    },
    calendar: {
      title: 'Upcoming events',
      monthTitle: 'Event calendar',
      oneTitle: 'Kickoff',
      oneDetail: 'Example static event.',
      twoTitle: 'Review',
      twoDetail: 'Calendar entries come from config in this slice.',
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
    fallback: {
      unknownType: 'This module type is not registered.',
      invalid: 'This module could not be displayed.',
      unhydrated: 'This content is not available yet.',
    },
  },
}
