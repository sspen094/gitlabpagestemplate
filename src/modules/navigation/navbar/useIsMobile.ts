import { useEffect, useState } from 'react'
import { matchesMobileMedia, MOBILE_MEDIA_QUERY } from './mobile-query.ts'

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(matchesMobileMedia)

  useEffect(() => {
    const media = window.matchMedia?.(MOBILE_MEDIA_QUERY)
    if (!media) {
      return
    }

    function onChange() {
      setIsMobile(matchesMobileMedia())
    }

    media.addEventListener('change', onChange)
    onChange()
    return () => media.removeEventListener('change', onChange)
  }, [])

  return isMobile
}
