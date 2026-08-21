import type { FeedFormat } from '../../data-sources/feed-client/index.ts'
import type { UpdatableType } from './schemas.ts'

/**
 * Explicit binding of one updatable module to a same-named worksheet:
 * page → parent module/worksheet → data type. `publishedUrl` is the one shared,
 * public spreadsheet URL applied at runtime; an empty URL keeps the safe shell.
 */
export type SheetMapping = {
  id: string
  page: string
  moduleId: string
  type: UpdatableType
  publishedUrl: string
  format: FeedFormat
  tab?: string
  /** Worksheet id from the spreadsheet URL; supplied per site through env. */
  gid?: string
  range?: string
  /** Max items rendered from a collection feed (SC-05 groundwork). */
  limit?: number
}

export function findMapping(
  mappings: readonly SheetMapping[],
  page: string,
  moduleId: string,
): SheetMapping | undefined {
  return mappings.find(
    (mapping) => mapping.page === page && mapping.moduleId === moduleId,
  )
}

export function findMappingById(
  mappings: readonly SheetMapping[],
  id: string,
): SheetMapping | undefined {
  return mappings.find((mapping) => mapping.id === id)
}
