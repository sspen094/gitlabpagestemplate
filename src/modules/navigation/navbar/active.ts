import { normalizePagePath } from '../../pages/modular-pages/pages-config.ts'
import type { NavItem, NavSectionItem } from './types.ts'

export function isHrefActive(currentPath: string, href: string): boolean {
  return normalizePagePath(currentPath) === normalizePagePath(href)
}

export function isSectionActive(
  currentPath: string,
  item: NavSectionItem,
): boolean {
  if (item.href && isHrefActive(currentPath, item.href)) {
    return true
  }
  return item.children.some((child) => isHrefActive(currentPath, child.href))
}

export function isNavItemActive(currentPath: string, item: NavItem): boolean {
  if (item.kind === 'link') {
    return isHrefActive(currentPath, item.href)
  }
  return isSectionActive(currentPath, item)
}
