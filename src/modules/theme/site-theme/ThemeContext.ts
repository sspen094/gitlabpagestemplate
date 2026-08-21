import { createContext } from 'react'
import { defaultTheme, type SiteTheme } from './config.ts'

export const ThemeContext = createContext<SiteTheme>(defaultTheme)
