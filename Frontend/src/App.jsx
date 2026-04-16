import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Avatar from './pages/Avatar'

function App() {
  return (
    // Wrap the entire application routing inside the MainLayout component
    // MainLayout provides the global app shell and navigation bar
    <MainLayout>
      <Routes>
        {/* Public routes accessible to anyone */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* Private protected routes - requires user to be authenticated */}
        <Route
          path="/dashboard"
          element={
            // The ProtectedRoute wrapper checks for the auth token. If missing, redirects to /login.
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/avatar"
          element={
            <ProtectedRoute>
              <Avatar />
            </ProtectedRoute>
          }
        />
        
        {/* Fallback pattern: Redirect any unknown URL endpoints back to the Home page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  )
}

export default App
