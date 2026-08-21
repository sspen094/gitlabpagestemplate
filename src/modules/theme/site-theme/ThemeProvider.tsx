import { useMemo, type ReactNode } from 'react'
import type { DeepPartial, SiteTheme, ThemeMode } from './config.ts'
import { resolveTheme } from './resolve.ts'
import { ThemeContext } from './ThemeContext.ts'
import { createThemeCss } from './theme-css.ts'

type ThemeProviderProps = {
  children: ReactNode
  /** Partial builder configuration; invalid values safely use the defaults. */
  theme?: DeepPartial<SiteTheme>
  /** Optional deployment-level palette override. No visitor control is rendered. */
  mode?: ThemeMode
}

export function ThemeProvider({
  children,
  theme,
  mode,
}: ThemeProviderProps) {
  const resolvedTheme = useMemo(
    () => resolveTheme(mode ? { ...theme, mode } : theme),
    [theme, mode],
  )
  const css = useMemo(() => createThemeCss(resolvedTheme), [resolvedTheme])

  return (
    <ThemeContext.Provider value={resolvedTheme}>
      <style data-site-theme={resolvedTheme.mode}>{css}</style>
      {children}
    </ThemeContext.Provider>
  )
}
