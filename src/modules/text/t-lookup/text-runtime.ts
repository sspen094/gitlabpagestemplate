import {
  defaultFallbackConfig,
  type TextFallbackConfig,
} from './fallback.ts'
import { defaultText, type TextTree } from './text-config.ts'

let activeTree: TextTree = defaultText
let activeFallback: TextFallbackConfig = defaultFallbackConfig

export function getActiveTextTree(): TextTree {
  return activeTree
}

/** Swap the tree used by module-level `t()` without changing call sites. */
export function setActiveTextTree(tree: TextTree): void {
  activeTree = tree
}

export function resetActiveTextTree(): void {
  activeTree = defaultText
}

export function getTextFallback(): TextFallbackConfig {
  return activeFallback
}

export function setTextFallback(config: TextFallbackConfig): void {
  activeFallback = config
}

export function resetTextFallback(): void {
  activeFallback = defaultFallbackConfig
}
