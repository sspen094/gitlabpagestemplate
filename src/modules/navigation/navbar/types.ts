/** Developer-authored navigation tree. Add items in `nav-config.ts`. */

export type NavLinkItem = {
  id: string
  kind: 'link'
  labelKey: string
  href: string
}

export type NavSectionItem = {
  id: string
  kind: 'section'
  labelKey: string
  /** Optional landing page for the section itself (e.g. About). */
  href?: string
  children: readonly NavLinkItem[]
}

export type NavItem = NavLinkItem | NavSectionItem
