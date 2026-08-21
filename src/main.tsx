import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TextProvider } from './modules/text/t-lookup/index.ts'
import { ThemeProvider } from './modules/theme/site-theme/index.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <TextProvider>
        <App />
      </TextProvider>
    </ThemeProvider>
  </StrictMode>,
)
