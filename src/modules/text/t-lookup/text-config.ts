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
    },
  },
}
