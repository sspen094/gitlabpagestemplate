import { defaultFallbackConfig, type TextFallbackConfig } from './fallback.ts'
import { resolveText } from './resolve.ts'
import { defaultText, type TextTree } from './text-config.ts'
import { getActiveTextTree, getTextFallback } from './text-runtime.ts'

/** Resolve a `[page].[section].[item]` key against the active text tree. */
export function t(key: string): string {
  return resolveText(getActiveTextTree(), key, getTextFallback())
}

/** Bind lookup to a specific tree (and optional fallback) without changing key call sites. */
export function createT(
  tree: TextTree = defaultText,
  fallback: TextFallbackConfig = defaultFallbackConfig,
): (key: string) => string {
  return (key: string) => resolveText(tree, key, fallback)
}
