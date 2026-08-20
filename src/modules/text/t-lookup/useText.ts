import { useContext } from 'react'
import { TextContext, type TextLookup } from './TextContext.ts'
import { t } from './t.ts'

/** Same lookup as `t()`; uses `TextProvider` when present so locale trees can wrap the app. */
export function useText(): TextLookup {
  return useContext(TextContext) ?? t
}
