import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

export default function Login() {
  // UI State: Determines whether the form is in "login" or "register" mode
  const [mode, setMode] = useState('login')
  
  // Controlled input states for the form fields
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  
  // Feedback messaging state for the user (errors, success messages, loading)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const navigate = useNavigate()
  
  // Connect to the API. Tries to use Env variables first, falls back to localhost.
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7012'

  // Primary submit handler for both Login and Registration actions
  const handleAuthSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setIsError(false)

    // Basic client-side validation
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
      // === REGISTRATION FLOW ===
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

        // On successful registration, switch the form back to login mode so the user can sign in.
        setIsError(false)
        setMessage(registerMessage || 'Account created! You can sign in now.')
        setMode('login')
        setPassword('') // Clear the password field for security
        return
      }

      // === LOGIN FLOW ===
      // Calls the C# backend to authenticate the user
      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      })

      if (response.ok) {
        // If login succeeds (200 OK), extract the JWT Token
        // Parse conditionally since the C# backend might return a raw string token rather than JSON
        const text = await response.text()
        let data
        try {
          data = JSON.parse(text)
        } catch {
          data = text // Use the raw text if it's not valid JSON
        }
        
        // Save the valid JWT token in localStorage for subsequent authenticated API requests
        localStorage.setItem('authToken', data.token || data)
        // Redirect the user to the application dashboard
        navigate('/dashboard')
      } else {
        // If login fails (e.g., 401 Unauthorized due to bad credentials)
        alert('Inloggningen misslyckades. Kontrollera dina uppgifter.') // Note: Legacy Swedish alert
        setIsError(true)
        setMessage('Inloggningen misslyckades. Kontrollera dina uppgifter.')
      }
    } catch (error) {
      // Catch network errors (e.g., the C# backend server is not running)
      console.error('Nätverksfel:', error)
      alert('Kunde inte ansluta till servern. Har du startat C#-backend?') // Note: Legacy Swedish alert
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

        {/* Tab system to toggle between Login and Registration modes visually */}
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

        {/* The main authentication form */}
        <form className="login-form" onSubmit={handleAuthSubmit}>
          
          {/* Conditionally render Registration fields if mode is 'register' */}
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

        {/* Display feedback messages (success or errors) below the form */}
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
