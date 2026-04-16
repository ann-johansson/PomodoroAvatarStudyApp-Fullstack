// MainLayout.jsx 
import Navbar from './Navbar'
import './MainLayout.css'

// MainLayout component that wraps the entire application with a consistent layout
export default function MainLayout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-content">{children}</main>
    </div>
  )
}
