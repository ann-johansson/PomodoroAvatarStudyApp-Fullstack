import './Home.css'

export default function Home() {
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
    </main>
  )
}
