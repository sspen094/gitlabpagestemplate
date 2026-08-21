export const MOBILE_MEDIA_QUERY = '(max-width: 767px)'

export function matchesMobileMedia(
  media: Pick<Window, 'matchMedia'> | null | undefined = globalThis.window,
): boolean {
  return Boolean(media?.matchMedia?.(MOBILE_MEDIA_QUERY).matches)
}
