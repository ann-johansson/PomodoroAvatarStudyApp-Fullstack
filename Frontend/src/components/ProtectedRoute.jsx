import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  // Check if user is authenticated by looking for token in localStorage
  const isAuthenticated = localStorage.getItem('authToken')

  // If no token, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // If token exists, render the protected page (Dashboard)
  return children
}
