import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [activeTheme, setActiveTheme] = useState(() => {
    const rootTheme = document.documentElement.getAttribute('data-theme')
    return rootTheme || 'calm-green'
  })

  const handleThemeChange = (event) => {
    const nextTheme = event.target.value
    document.documentElement.setAttribute('data-theme', nextTheme)
    localStorage.setItem('siteTheme', nextTheme)
    setActiveTheme(nextTheme)
  }

  return (
    <nav className="app-nav" aria-label="Primary">
      <div className="app-nav-links">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/dashboard">Dashboard</Link>
      </div>

      <div className="app-nav-tools">
        <div className="app-theme-select-wrap">
          <select id="theme-select" value={activeTheme} onChange={handleThemeChange}>
            <option value="calm-green">Calm Green</option>
            <option value="soft-blue">Soft Blue</option>
            <option value="pastel-lilac">Pastel Lilac</option>
            <option value="warm-beige">Warm Beige</option>
          </select>
        </div>
      </div>
    </nav>
  )
}
