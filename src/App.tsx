import { HashRouter } from 'react-router'
import { PageRoutes } from './modules/pages/modular-pages/PageRoutes.tsx'
import { defaultPages } from './modules/pages/modular-pages/pages-config.ts'
import type { PageDefinition } from './modules/pages/modular-pages/types.ts'
import { useText } from './modules/text/t-lookup/index.ts'
import './App.css'

export function AppShell({
  pages = defaultPages,
}: {
  pages?: readonly PageDefinition[]
}) {
  const t = useText()

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <p className="app-shell__brand">{t('home.header.brand')}</p>
      </header>
      <main className="app-shell__main">
        <PageRoutes pages={pages} />
      </main>
    </div>
  )
}

/** Hash routing so GitHub Pages can host extra paths without a server rewrite. */
export default function App({
  pages = defaultPages,
}: {
  pages?: readonly PageDefinition[]
}) {
  return (
    <HashRouter>
      <AppShell pages={pages} />
    </HashRouter>
  )
}
