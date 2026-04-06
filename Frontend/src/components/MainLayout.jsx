import Navbar from './Navbar'

export default function MainLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main style={{ padding: '20px' }}>{children}</main>
    </div>
  )
}
