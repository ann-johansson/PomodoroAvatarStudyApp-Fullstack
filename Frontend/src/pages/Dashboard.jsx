import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

export default function Dashboard() {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('authToken')

    // Redirect to login
    navigate('/login')
  }

  return (
    <section className="dashboard-page">
      <header className="dashboard-header">
        <p className="dashboard-kicker">Your Focus Space</p>
        <h1>Dashboard</h1>
        <p className="dashboard-subtitle">Your tasks and timer will go here.</p>
      </header>

      <div className="dashboard-grid">
        <article className="dashboard-card">
          <h2>Today</h2>
          <p>Start your next focus block and keep the streak alive.</p>
        </article>

        <article className="dashboard-card dashboard-status">
          <h2>Status</h2>
          <p className="status-ok">Logged in and ready to study.</p>
        </article>
      </div>

      <button className="dashboard-logout" onClick={handleLogout}>
        Logout
      </button>
    </section>
  )
}
