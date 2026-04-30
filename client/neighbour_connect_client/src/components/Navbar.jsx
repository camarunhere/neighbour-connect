import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/">NeighbourConnect</NavLink>
      </div>
      <ul className="navbar-links">
        <li><NavLink to="/" end>Home</NavLink></li>
        <li><NavLink to="/announcements">Announcements</NavLink></li>
        <li><NavLink to="/lost-found">Lost &amp; Found</NavLink></li>
        <li><NavLink to="/events">Events</NavLink></li>
      </ul>
      <div className="navbar-user">
        <span className="navbar-username">
          {user?.username}
          {user?.role === 'admin' && <span className="navbar-admin-badge">Admin</span>}
        </span>
        <button className="navbar-logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  )
}

export default Navbar
