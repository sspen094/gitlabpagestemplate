/** How `t()` behaves when a key is missing or malformed. Never throws. */
export type FallbackMode = 'echo' | 'placeholder'

export type TextFallbackConfig = {
  mode: FallbackMode
  /** Used when `mode` is `placeholder`. `{key}` is replaced with the lookup key. */
  placeholder?: string
}

export const defaultFallbackConfig: TextFallbackConfig = {
  mode: 'echo',
}

const DEFAULT_PLACEHOLDER = '[{key}]'

export function formatMissingKey(
  key: string,
  config: TextFallbackConfig = defaultFallbackConfig,
): string {
  if (config.mode === 'placeholder') {
    const template = config.placeholder ?? DEFAULT_PLACEHOLDER
    return template.replaceAll('{key}', key)
  }
  return key
}
