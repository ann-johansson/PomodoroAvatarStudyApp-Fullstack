import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('authToken')

    // Redirect to login
    navigate('/login')
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Your tasks and timer will go here</p>
      <p style={{ color: 'green', fontWeight: 'bold' }}>✓ You are logged in!</p>
      <button onClick={handleLogout} style={{ padding: '10px 20px', cursor: 'pointer' }}>
        Logout
      </button>
    </div>
  )
}
