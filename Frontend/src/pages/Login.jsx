import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()

    // Simple validation
    if (username && password) {
      // Store token in localStorage (simulated - real app uses API response)
      localStorage.setItem('authToken', 'fake-jwt-token-123')

      // Redirect to dashboard
      navigate('/dashboard')
    } else {
      alert('Please enter username and password')
    }
  }

  return (
    <section className="login-page">
      <div className="login-card">
        <p className="login-kicker">Welcome back</p>
        <h1>Sign in to continue</h1>

        <form className="login-form" onSubmit={handleLogin}>
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button type="submit">Login</button>
        </form>

        <p className="login-hint">
          Demo: Use any username/password to test (no real validation yet)
        </p>
      </div>
    </section>
  )
}
