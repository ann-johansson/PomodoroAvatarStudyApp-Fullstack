import Navbar from './Navbar'
import './MainLayout.css'

export default function MainLayout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-content">{children}</main>
    </div>
  )
}
