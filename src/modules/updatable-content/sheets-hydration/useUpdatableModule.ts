import { useEffect, useState } from 'react'
import type { FeedFormat } from '../../data-sources/feed-client/index.ts'
import type { ModuleInstance } from '../../pages/modular-pages/index.ts'
import { resolveMappings } from './config.ts'
import { toFallback } from './fallback.ts'
import { hydrateMapping, type HydrationResult } from './hydrate.ts'
import { findMappingById, type SheetMapping } from './mapping.ts'
import { getUpdatableFetch } from './runtime.ts'
import { applyUpdatableData, updatableTypeForModule } from './to-config.ts'

/**
 * Non-blocking hydration for one updatable module instance. First render always
 * returns the static shell (so the page paints immediately); the feed loads in
 * an effect and swaps in sheet data — or a safe fallback — when it resolves.
 */

export type UpdatableStatus = 'shell' | 'ready' | 'fallback'

export type UpdatableState = {
  status: UpdatableStatus
  instance: ModuleInstance
}

/**
 * Resolve where a module reads from: an inline `dataSource` (Slice 02 reserved
 * field) wins, else a committed mapping matching the parent module id. A legacy
 * `config.sourceId` can still override that name. Returns `undefined` when there
 * is no usable source, keeping the module on its shell.
 */
export function resolveModuleMapping(
  instance: ModuleInstance,
): SheetMapping | undefined {
  const type = updatableTypeForModule(instance.type)
  if (!type) {
    return undefined
  }

  const inlineUrl = instance.dataSource?.publishedUrl
  if (inlineUrl) {
    return {
      id: instance.id,
      page: '',
      moduleId: instance.id,
      type,
      publishedUrl: inlineUrl,
      format: readFormat(instance.config.format),
      tab: instance.dataSource?.tab,
      gid: instance.dataSource?.gid,
      range: readOptionalString(instance.config.range),
      limit: readOptionalNumber(instance.config.limit),
    }
  }

  const sourceId = readOptionalString(instance.config.sourceId) ?? instance.id
  const mapping = findMappingById(resolveMappings(), sourceId)
  return mapping && mapping.type === type ? mapping : undefined
}

export function useUpdatableModule(instance: ModuleInstance): UpdatableState {
  const mapping = resolveModuleMapping(instance)
  const [result, setResult] = useState<HydrationResult | null>(null)

  const key = mapping
    ? `${mapping.id}::${mapping.publishedUrl}::${mapping.gid ?? ''}::${mapping.range ?? ''}`
    : ''

  useEffect(() => {
    setResult(null)
    if (!mapping || !mapping.publishedUrl) {
      return
    }

    let active = true
    hydrateMapping(mapping, { fetchImpl: getUpdatableFetch() })
      .then((hydrated) => {
        if (active) {
          setResult(hydrated)
        }
      })
      .catch(() => {
        if (active) {
          setResult({
            ok: false,
            type: mapping.type,
            fallback: toFallback('fetch-failed'),
          })
        }
      })

    return () => {
      active = false
    }
    // Re-run only when the resolved source identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  if (!result) {
    return { status: 'shell', instance }
  }
  if (!result.ok) {
    return {
      status: 'fallback',
      instance: { ...instance, fallback: { messageKey: result.fallback.messageKey } },
    }
  }
  return { status: 'ready', instance: applyUpdatableData(instance, result.data) }
}

function readFormat(value: unknown): FeedFormat {
  return value === 'json' ? 'json' : 'csv'
}

function readOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function readOptionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}
