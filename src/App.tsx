import './App.css'
import { useText } from './modules/text/t-lookup/index.ts'

function App() {
  const t = useText()

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <p className="app-shell__brand">{t('home.header.brand')}</p>
      </header>
      <main className="app-shell__main">
        <h1>{t('home.hero.title')}</h1>
        <p>{t('home.hero.body')}</p>
      </main>
    </div>
  )
}

export default App
