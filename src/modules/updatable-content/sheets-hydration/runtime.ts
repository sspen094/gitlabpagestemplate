import type { FetchLike } from '../../data-sources/feed-client/index.ts'

/**
 * Optional fetch override for updatable hydration. Production leaves this unset
 * so the feed client uses the global `fetch`; tests inject a stub feed here
 * (mirrors the `text-runtime` swap pattern).
 */
let override: FetchLike | undefined

export function setUpdatableFetch(fetchImpl: FetchLike | undefined): void {
  override = fetchImpl
}

export function resetUpdatableFetch(): void {
  override = undefined
}

export function getUpdatableFetch(): FetchLike | undefined {
  return override
}
