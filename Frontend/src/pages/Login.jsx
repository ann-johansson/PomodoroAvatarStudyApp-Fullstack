import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

export default function Login() {
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7012'

  const handleAuthSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setIsError(false)

    if (!username || !password) {
      setIsError(true)
      setMessage('Please enter username and password.')
      return
    }

    if (mode === 'register' && (!displayName || !email)) {
      setIsError(true)
      setMessage('Please fill in display name and email to register.')
      return
    }

    setIsSubmitting(true)

    try {
      if (mode === 'register') {
        const registerResponse = await fetch(`${apiBaseUrl}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
            displayName,
            email,
          }),
        })

        const registerMessage = await registerResponse.text()

        if (!registerResponse.ok) {
          throw new Error(registerMessage || 'Registration failed. Please try again.')
        }

        setIsError(false)
        setMessage(registerMessage || 'Account created! You can sign in now.')
        setMode('login')
        setPassword('')
        return
      }

      // Anrop till din C#-backend
      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      })

      if (response.ok) {
        // Om inloggningen lyckas (200 OK)
        // Parse conditionally since the C# backend might return a raw string token
        const text = await response.text()
        let data
        try {
          data = JSON.parse(text)
        } catch {
          data = text // Use the raw text if it's not JSON
        }
        
        // Spara den riktiga JWT-token från backend (beroende på hur din backend returnerar den)
        localStorage.setItem('authToken', data.token || data)
        navigate('/dashboard')
      } else {
        // Om det är fel lösenord/användarnamn (t.ex. 401 Unauthorized)
        alert('Inloggningen misslyckades. Kontrollera dina uppgifter.')
        setIsError(true)
        setMessage('Inloggningen misslyckades. Kontrollera dina uppgifter.')
      }
    } catch (error) {
      console.error('Nätverksfel:', error)
      alert('Kunde inte ansluta till servern. Har du startat C#-backend?')
      setIsError(true)
      setMessage(error.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="login-page">
      <div className="login-card">
        <p className="login-kicker">Account access</p>
        <h1>{mode === 'login' ? 'Sign in to continue' : 'Create your account'}</h1>

        <div className="auth-toggle" role="tablist" aria-label="Auth mode">
          <button
            type="button"
            className={mode === 'login' ? 'active' : ''}
            aria-selected={mode === 'login'}
            onClick={() => {
              setMode('login')
              setMessage('')
              setIsError(false)
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'active' : ''}
            aria-selected={mode === 'register'}
            onClick={() => {
              setMode('register')
              setMessage('')
              setIsError(false)
            }}
          >
            Register
          </button>
        </div>

        <form className="login-form" onSubmit={handleAuthSubmit}>
          {mode === 'register' && (
            <>
              <label>
                Display name
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </>
          )}

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

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>

        {message && (
          <p className={`auth-message ${isError ? 'error' : 'success'}`} role="status">
            {message}
          </p>
        )}

        <p className="login-hint">
          API base URL: {apiBaseUrl}
        </p>
      </div>
    </section>
  )
}
