import { createContext } from 'react'

export type TextLookup = (key: string) => string

export const TextContext = createContext<TextLookup | null>(null)
