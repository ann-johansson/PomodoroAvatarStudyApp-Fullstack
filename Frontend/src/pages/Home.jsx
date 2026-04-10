import { useMemo, useState } from 'react'
import './Home.css'

export default function Home() {
  const themeOptions = useMemo(
    () => [
      { id: 'calm-green', label: 'Calm Green' },
      { id: 'soft-blue', label: 'Soft Blue' },
      { id: 'pastel-lilac', label: 'Pastel Lilac' },
      { id: 'warm-beige', label: 'Warm Beige' },
    ],
    [],
  )

  const [activeTheme, setActiveTheme] = useState(() => {
    const rootTheme = document.documentElement.getAttribute('data-theme')
    return rootTheme || 'calm-green'
  })

  const applyTheme = (themeId) => {
    document.documentElement.setAttribute('data-theme', themeId)
    localStorage.setItem('siteTheme', themeId)
    setActiveTheme(themeId)
  }

  return (
    <main className="home-page">
      <section className="home-hero">
        <p className="home-kicker">Slow focus, steady progress</p>
        <h1>Study with a calm rhythm</h1>
        <p className="home-subtitle">
          Build momentum with gentle pomodoro cycles, meaningful breaks, and
          clear goals for each session.
        </p>
      </section>

      <section className="home-cards" aria-label="How it works">
        <article className="home-card">
          <h2>Set one clear task</h2>
          <p>
            Start with a single intention, then give it your full attention for
            one focused block.
          </p>
        </article>

        <article className="home-card">
          <h2>Track your sessions</h2>
          <p>
            Keep a simple log of what you completed and where your energy felt
            strongest.
          </p>
        </article>

        <article className="home-card">
          <h2>Reward consistency</h2>
          <p>
            Celebrate small wins as your avatar grows and your study habit gets
            stronger each day.
          </p>
        </article>
      </section>

      <section className="theme-switcher" aria-label="Theme switcher">
        <h2>Pick your theme</h2>
        <p>Choose the palette that feels most calm today.</p>

        <div className="theme-buttons" role="group" aria-label="Theme options">
          {themeOptions.map((theme) => (
            <button
              key={theme.id}
              type="button"
              className={activeTheme === theme.id ? 'is-active' : ''}
              onClick={() => applyTheme(theme.id)}
            >
              {theme.label}
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}
