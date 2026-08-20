export { defaultText, type TextTree } from './text-config.ts'
export {
  isFullTextKey,
  isGroupedTextKey,
  normalizeTextKey,
  splitTextKey,
} from './keys.ts'
export { t, createT } from './t.ts'
export { useText } from './useText.ts'
export { TextProvider } from './TextProvider.tsx'
export { TextContext, type TextLookup } from './TextContext.ts'
export {
  defaultFallbackConfig,
  formatMissingKey,
  type FallbackMode,
  type TextFallbackConfig,
} from './fallback.ts'
export { resolveText } from './resolve.ts'
export {
  getActiveTextTree,
  setActiveTextTree,
  resetActiveTextTree,
  getTextFallback,
  setTextFallback,
  resetTextFallback,
} from './text-runtime.ts'
