import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  // Access the current location via React Router
  const location = useLocation()
  
  // Check if the user is authenticated by looking for an auth token in local storage
  const isAuthenticated = !!localStorage.getItem('authToken')

  // Initialize the active theme state. Defaults to 'calm-green' if not set
  const [activeTheme, setActiveTheme] = useState(() => {
    const rootTheme = document.documentElement.getAttribute('data-theme')
    return rootTheme || 'calm-green'
  })

  // Event handler for when the user selects a new theme from the dropdown
  const handleThemeChange = (event) => {
    const nextTheme = event.target.value
    // Update the DOM to apply the new theme styles
    document.documentElement.setAttribute('data-theme', nextTheme)
    // Persist the user's theme choice in local storage
    localStorage.setItem('siteTheme', nextTheme)
    // Update the component's state to reflect the selected theme
    setActiveTheme(nextTheme)
  }

  return (
    <nav className="app-nav" aria-label="Primary">
      {/* Navigation links container */}
      <div className="app-nav-links">
        <Link to="/">Home</Link>
        {/* Render Avatar link if logged in, otherwise show Login link */}
        {isAuthenticated ? (
          <Link to="/avatar">Avatar</Link>
        ) : (
          <Link to="/login">Login</Link>
        )}
        <Link to="/dashboard">Dashboard</Link>
      </div>

      {/* Container for secondary tools like the theme selector */}
      <div className="app-nav-tools">
        <div className="app-theme-select-wrap">
          {/* Dropdown menu to allow users to switch themes dynamically */}
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
