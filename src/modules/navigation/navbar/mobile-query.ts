import { defaultTheme } from '../../theme/site-theme/config.ts'

export const MOBILE_BREAKPOINT = defaultTheme.breakpoints.mobile
export const MOBILE_MEDIA_QUERY = `(max-width: ${MOBILE_BREAKPOINT}px)`

export function matchesMobileMedia(
  media: Pick<Window, 'matchMedia'> | null | undefined = globalThis.window,
): boolean {
  return Boolean(media?.matchMedia?.(MOBILE_MEDIA_QUERY).matches)
}
