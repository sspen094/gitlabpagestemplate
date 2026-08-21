import type { ModuleStyle } from './style.ts'
import type { ModuleInstance, PageDefinition } from './types.ts'

/** Registered pages for the realistic, placeholder-only sample site. */
export const defaultPages: PageDefinition[] = [
  {
    id: 'home',
    path: '/',
    appearance: { rhythm: 'roomy' },
    modules: [
      {
        id: 'home-hero',
        type: 'hero',
        mode: 'static',
        style: { variant: 'feature', align: 'center' },
        config: {
          titleKey: 'home.hero.title',
          bodyKey: 'home.hero.body',
          ctaLabelKey: 'home.hero.cta',
          ctaHref: '/events',
        },
      },
      {
        id: 'home-introduction',
        type: 'section',
        mode: 'static',
        style: { spacing: 'roomy' },
        config: {
          titleKey: 'home.introduction.title',
          children: [
            {
              id: 'home-introduction-copy',
              type: 'text',
              mode: 'static',
              config: {
                bodyKey: 'home.introduction.body',
              },
            },
            {
              id: 'home-introduction-image',
              type: 'image',
              mode: 'static',
              config: {
                src: '/favicon.svg',
                alt: 'Abstract placeholder mark for the sample community site',
                captionKey: 'home.introduction.caption',
              },
            },
          ],
        },
      },
      updatable(
        'demo-text',
        'text',
        {
          titleKey: 'home.updates.title',
          blocks: [
            {
              id: 'demo-text-shell',
              textKey: 'home.updates.body',
            },
          ],
        },
        { surface: 'card' },
      ),
    ],
  },
  {
    id: 'events',
    path: '/events',
    appearance: { width: 'shell' },
    modules: [
      {
        id: 'events-hero',
        type: 'hero',
        mode: 'static',
        config: {
          titleKey: 'events.hero.title',
          bodyKey: 'events.hero.body',
        },
      },
      updatable(
        'demo-calendar',
        'calendar',
        {
          upcomingCount: 5,
          titleKey: 'events.calendar.title',
          upcomingTitleKey: 'events.calendar.upcomingTitle',
          events: [
            {
              id: 'demo-calendar-shell',
              date: '2026-10-01',
              titleKey: 'events.calendar.eventOneTitle',
              detailKey: 'events.calendar.eventOneDetail',
            },
          ],
        },
        { layout: 'hybrid', width: 'full' },
      ),
    ],
  },
  {
    id: 'about',
    path: '/about',
    modules: [
      {
        id: 'about-hero',
        type: 'hero',
        mode: 'static',
        config: {
          titleKey: 'about.hero.title',
          bodyKey: 'about.hero.body',
        },
      },
      {
        id: 'about-story',
        type: 'text',
        mode: 'static',
        config: {
          titleKey: 'about.story.title',
          bodyKey: 'about.story.body',
        },
      },
      {
        id: 'about-image',
        type: 'image',
        mode: 'static',
        config: {
          src: '/favicon.svg',
          alt: 'Placeholder illustration for the sample organization',
          captionKey: 'about.story.caption',
        },
      },
    ],
  },
  {
    id: 'contact',
    path: '/about/contact',
    appearance: { tone: 'muted' },
    modules: [
      {
        id: 'contact-hero',
        type: 'hero',
        mode: 'static',
        style: { variant: 'quiet' },
        config: {
          titleKey: 'contact.hero.title',
          bodyKey: 'contact.hero.body',
        },
      },
      updatable(
        'contact-info',
        'contact',
        {
          titleKey: 'contact.info.title',
          entries: [
            {
              id: 'contact-info-shell',
              labelKey: 'contact.info.labelOne',
              valueKey: 'contact.info.valueOne',
              type: 'email',
            },
          ],
        },
        { surface: 'card' },
      ),
      {
        id: 'contact-form',
        type: 'contact-form',
        mode: 'static',
        style: { surface: 'raised', width: 'narrow' },
        config: {
          titleKey: 'contact.form.title',
          adapter: 'email-service',
        },
      },
    ],
  },
  {
    id: 'members',
    path: '/about/members',
    appearance: { width: 'shell', rhythm: 'compact' },
    modules: [
      {
        id: 'members-hero',
        type: 'hero',
        mode: 'static',
        config: {
          titleKey: 'members.hero.title',
          bodyKey: 'members.hero.body',
        },
      },
      updatable(
        'demo-cards',
        'card-list',
        {
          titleKey: 'members.directory.title',
          entries: [
            {
              id: 'demo-cards-shell',
              titleKey: 'members.directory.cardOneTitle',
              bodyKey: 'members.directory.cardOneBody',
            },
          ],
        },
        { layout: 'grid', tone: 'accent', spacing: 'compact' },
      ),
    ],
  },
]

/**
 * A sheet-backed module instance. The id doubles as the worksheet name, so a
 * mapping is found without repeating the source in page config.
 */
function updatable(
  id: string,
  type: string,
  config: Record<string, unknown>,
  style?: ModuleStyle,
): ModuleInstance {
  return {
    id,
    type,
    mode: 'updatable',
    config,
    style,
    fallback: { messageKey: 'updatable.fallback.unavailable' },
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
