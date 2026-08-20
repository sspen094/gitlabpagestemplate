import {
  createContext,
  createElement,
  useContext,
  type ReactNode,
} from 'react'

const HeadingLevelContext = createContext(2)

function clampLevel(level: number): number {
  return Math.min(6, Math.max(1, Math.round(level)))
}

export function HeadingLevelProvider({
  level,
  children,
}: {
  level: number
  children: ReactNode
}) {
  return (
    <HeadingLevelContext.Provider value={clampLevel(level)}>
      {children}
    </HeadingLevelContext.Provider>
  )
}

function useHeadingLevel(): number {
  return useContext(HeadingLevelContext)
}

export function NestedHeadingScope({ children }: { children: ReactNode }) {
  const level = useHeadingLevel()
  return (
    <HeadingLevelProvider level={level + 1}>{children}</HeadingLevelProvider>
  )
}

export function ModuleHeading({
  id,
  level,
  children,
}: {
  id?: string
  level?: number
  children: ReactNode
}) {
  const fromContext = useHeadingLevel()
  const headingLevel = clampLevel(level ?? fromContext)
  const tag = `h${headingLevel}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  return createElement(tag, { id }, children)
}
