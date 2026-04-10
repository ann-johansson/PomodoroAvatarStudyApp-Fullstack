import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

const SAVED_THEME = localStorage.getItem('siteTheme')
const ACTIVE_THEME = SAVED_THEME || 'calm-green'
document.documentElement.setAttribute('data-theme', ACTIVE_THEME)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
