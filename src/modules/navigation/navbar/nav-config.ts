import type { NavItem } from './types.ts'

/**
 * Registered nav. Add a top-level page or dropdown subsection by appending
 * an entry — the navbar reads this list; no extra React page component.
 */
export const defaultNav: readonly NavItem[] = [
  {
    id: 'home',
    kind: 'link',
    labelKey: 'nav.items.home',
    href: '/',
  },
  {
    id: 'events',
    kind: 'link',
    labelKey: 'nav.items.events',
    href: '/events',
  },
  {
    id: 'about',
    kind: 'section',
    labelKey: 'nav.items.about',
    href: '/about',
    children: [
      {
        id: 'contact',
        kind: 'link',
        labelKey: 'nav.items.contact',
        href: '/about/contact',
      },
      {
        id: 'members',
        kind: 'link',
        labelKey: 'nav.items.members',
        href: '/about/members',
      },
    ],
  },
]
