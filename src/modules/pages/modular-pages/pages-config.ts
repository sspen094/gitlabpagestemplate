import type { PageDefinition } from './types.ts'

/** Same rows feed the list and month layouts — one date column, one display column. */
const demoEvents = [
  {
    id: 'event-one',
    date: '2026-09-01',
    titleKey: 'demo.calendar.oneTitle',
    detailKey: 'demo.calendar.oneDetail',
  },
  {
    id: 'event-two',
    date: '2026-09-15',
    titleKey: 'demo.calendar.twoTitle',
    detailKey: 'demo.calendar.twoDetail',
  },
]

/**
 * Registered pages. Add a page by appending an entry (id, path, modules).
 * Routes are derived from this list — no per-page React component.
 */
export const defaultPages: PageDefinition[] = [
  {
    id: 'home',
    path: '/',
    modules: [
      {
        id: 'home-hero',
        type: 'hero',
        mode: 'static',
        config: {
          titleKey: 'home.hero.title',
          bodyKey: 'home.hero.body',
          ctaLabelKey: 'home.hero.cta',
          ctaHref: '/demo',
        },
      },
    ],
  },
  {
    id: 'demo',
    path: '/demo',
    modules: [
      {
        id: 'demo-hero',
        type: 'hero',
        mode: 'static',
        config: {
          titleKey: 'demo.hero.title',
          subtitleKey: 'demo.hero.subtitle',
          ctaLabelKey: 'demo.hero.cta',
          ctaHref: '/',
        },
      },
      {
        id: 'demo-intro',
        type: 'text',
        mode: 'static',
        config: {
          titleKey: 'demo.intro.title',
          bodyKey: 'demo.intro.body',
        },
      },
      {
        id: 'demo-image',
        type: 'image',
        mode: 'static',
        config: {
          src: `${import.meta.env.BASE_URL}favicon.svg`,
          alt: 'Template mark used as example module media',
          captionKey: 'demo.image.caption',
        },
      },
      {
        id: 'demo-group',
        type: 'section',
        mode: 'static',
        config: {
          titleKey: 'demo.section.title',
          children: [
            {
              id: 'demo-cards',
              type: 'card-list',
              mode: 'static',
              config: {
                titleKey: 'demo.cards.title',
                layout: 'grid',
                entries: [
                  {
                    id: 'card-one',
                    titleKey: 'demo.cards.oneTitle',
                    bodyKey: 'demo.cards.oneBody',
                  },
                  {
                    id: 'card-two',
                    titleKey: 'demo.cards.twoTitle',
                    bodyKey: 'demo.cards.twoBody',
                  },
                ],
              },
            },
            {
              id: 'demo-calendar',
              type: 'calendar',
              mode: 'static',
              config: {
                titleKey: 'demo.calendar.title',
                layout: 'list',
                events: demoEvents,
              },
            },
            {
              id: 'demo-calendar-month',
              type: 'calendar',
              mode: 'static',
              config: {
                titleKey: 'demo.calendar.monthTitle',
                layout: 'month',
                month: '2026-09',
                events: demoEvents,
              },
            },
          ],
        },
      },
    ],
  },
  heroPage('about', '/about', 'about.hero.title', 'about.hero.body'),
  heroPage(
    'contact',
    '/about/contact',
    'contact.hero.title',
    'contact.hero.body',
  ),
  heroPage(
    'members',
    '/about/members',
    'members.hero.title',
    'members.hero.body',
  ),
]

function heroPage(
  id: string,
  path: string,
  titleKey: string,
  bodyKey: string,
): PageDefinition {
  return {
    id,
    path,
    modules: [
      {
        id: `${id}-hero`,
        type: 'hero',
        mode: 'static',
        config: {
          titleKey,
          bodyKey,
        },
      },
    ],
  }
}

export function getPageByPath(
  pages: readonly PageDefinition[],
  path: string,
): PageDefinition | undefined {
  const normalized = normalizePagePath(path)
  return pages.find((page) => normalizePagePath(page.path) === normalized)
}

export function normalizePagePath(path: string): string {
  if (!path || path === '/') {
    return '/'
  }
  const withSlash = path.startsWith('/') ? path : `/${path}`
  return withSlash.replace(/\/+$/, '') || '/'
}
