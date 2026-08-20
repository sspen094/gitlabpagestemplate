import { useMemo, type ReactNode } from 'react'
import { defaultFallbackConfig, type TextFallbackConfig } from './fallback.ts'
import { resolveText } from './resolve.ts'
import { defaultText, type TextTree } from './text-config.ts'
import { TextContext, type TextLookup } from './TextContext.ts'

type TextProviderProps = {
  children: ReactNode
  /** Alternate locale/set. Defaults to the central `defaultText` tree. */
  tree?: TextTree
  fallback?: TextFallbackConfig
}

/**
 * Supplies a bound `t()` to `useText()` so an alternate text set can be
 * swapped at the tree root without changing component call sites.
 */
export function TextProvider({
  children,
  tree = defaultText,
  fallback = defaultFallbackConfig,
}: TextProviderProps) {
  const lookup = useMemo<TextLookup>(
    () => (key: string) => resolveText(tree, key, fallback),
    [tree, fallback],
  )

  return <TextContext.Provider value={lookup}>{children}</TextContext.Provider>
}
