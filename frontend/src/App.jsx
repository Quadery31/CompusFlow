import './App.css';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import LostFound from './pages/LostFound';
import Events from './pages/Events';

function App() {
  return (
    <Router>
      <div className="app">
        {/* Navigation */}
        <nav className="main-nav">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            📦 Lost & Found
          </NavLink>
          <NavLink to="/events" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            🗓️ Events
          </NavLink>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<LostFound />} />
          <Route path="/events" element={<Events />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
