import type { ModuleInstance, PageDefinition } from './types.ts'

/**
 * Registered pages. Add a page by appending an entry (id, path, modules).
 * Routes are derived from this list — no per-page React component.
 *
 * Every content module below is `mode: 'updatable'`: its id matches a worksheet
 * in the configured spreadsheet (`sheet-mappings.ts`), and its static config is
 * only the shell shown before the sheet resolves or when none is configured.
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
        id: 'demo-live',
        type: 'section',
        mode: 'static',
        config: {
          titleKey: 'demo.live.title',
          children: [
            updatable('demo-text', 'text', {
              titleKey: 'demo.live.textTitle',
              blocks: [
                { id: 'demo-text-shell', textKey: 'demo.live.textBody' },
              ],
            }),
            updatable('demo-cards', 'card-list', {
              layout: 'grid',
              titleKey: 'demo.live.cardsTitle',
              entries: [
                {
                  id: 'demo-cards-shell',
                  titleKey: 'demo.live.cardOneTitle',
                  bodyKey: 'demo.live.cardOneBody',
                },
              ],
            }),
            updatable('demo-calendar', 'calendar', {
              layout: 'hybrid',
              upcomingCount: 5,
              titleKey: 'demo.live.eventsTitle',
              upcomingTitleKey: 'demo.live.upcomingTitle',
              events: [
                {
                  id: 'demo-calendar-shell',
                  date: '2026-10-01',
                  titleKey: 'demo.live.eventOneTitle',
                  detailKey: 'demo.live.eventOneDetail',
                },
              ],
            }),
          ],
        },
      },
    ],
  },
  heroPage('about', '/about', 'about.hero.title', 'about.hero.body'),
  {
    id: 'contact',
    path: '/about/contact',
    modules: [
      {
        id: 'contact-hero',
        type: 'hero',
        mode: 'static',
        config: {
          titleKey: 'contact.hero.title',
          bodyKey: 'contact.hero.body',
        },
      },
      updatable('contact-info', 'contact', {
        titleKey: 'contact.info.title',
        entries: [
          {
            id: 'contact-info-shell',
            labelKey: 'contact.info.labelOne',
            valueKey: 'contact.info.valueOne',
            type: 'email',
          },
        ],
      }),
      {
        id: 'contact-form',
        type: 'contact-form',
        mode: 'static',
        config: {
          titleKey: 'contact.form.title',
          adapter: 'email-service',
        },
      },
    ],
  },
  heroPage(
    'members',
    '/about/members',
    'members.hero.title',
    'members.hero.body',
  ),
]

/**
 * A sheet-backed module instance. The id doubles as the worksheet name, so a
 * mapping is found without repeating the source in page config.
 */
function updatable(
  id: string,
  type: string,
  config: Record<string, unknown>,
): ModuleInstance {
  return {
    id,
    type,
    mode: 'updatable',
    config,
    fallback: { messageKey: 'updatable.fallback.unavailable' },
  }
}

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
