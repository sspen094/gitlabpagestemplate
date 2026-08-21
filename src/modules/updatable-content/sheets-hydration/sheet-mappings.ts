import type { SheetMapping } from './mapping.ts'

/**
 * Each mapping id, module id, and worksheet tab use the same parent-element
 * name. One public spreadsheet URL and its per-tab `gid` values are applied by
 * `config.ts` from env, so this file stays free of site-specific ids.
 */
export const sheetMappings: readonly SheetMapping[] = [
  {
    id: 'demo-text',
    page: 'demo',
    moduleId: 'demo-text',
    type: 'text-block',
    publishedUrl: '',
    format: 'csv',
    tab: 'demo-text',
    limit: 20,
  },
  {
    id: 'demo-cards',
    page: 'demo',
    moduleId: 'demo-cards',
    type: 'card-list',
    publishedUrl: '',
    format: 'csv',
    tab: 'demo-cards',
    limit: 12,
  },
  {
    id: 'demo-calendar',
    page: 'demo',
    moduleId: 'demo-calendar',
    type: 'event-list',
    publishedUrl: '',
    format: 'csv',
    tab: 'demo-calendar',
    limit: 25,
  },
  {
    id: 'contact-info',
    page: 'contact',
    moduleId: 'contact-info',
    type: 'contact-info',
    publishedUrl: '',
    format: 'csv',
    tab: 'contact-info',
    limit: 20,
  },
]
