import { useContext } from 'react'
import { ThemeContext } from './ThemeContext.ts'

export function useTheme() {
  return useContext(ThemeContext)
}
