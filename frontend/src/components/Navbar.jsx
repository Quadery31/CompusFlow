import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  // If we are on the login page, don't show the navbar at all
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <nav className="main-nav">
      <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        📦 Lost & Found
      </NavLink>
      <NavLink to="/events" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        🗓️ Events
      </NavLink>
      <NavLink to="/doubts" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        ❓ Doubts
      </NavLink>
      <NavLink to="/complaints" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        📢 Complaints
      </NavLink>
      <NavLink to="/notes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        📚 Notes
      </NavLink>

      {user ? (
        <button onClick={logout} className="nav-link logout-btn">
          🚪 Logout
        </button>
      ) : (
        <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          🔑 Login
        </NavLink>
      )}
    </nav>
  );
}