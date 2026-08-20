import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TextProvider } from './modules/text/t-lookup/index.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TextProvider>
      <App />
    </TextProvider>
  </StrictMode>,
)
