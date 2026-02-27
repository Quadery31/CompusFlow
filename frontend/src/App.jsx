import './App.css';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import LostFound from './pages/LostFound';
import Events from './pages/Events';
import Doubts from './pages/Doubts';
import DoubtDetails from './pages/DoubtDetails';
import Complaints from './pages/Complaints';
import ComplaintDetails from './pages/ComplaintDetails';

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
          <NavLink to="/doubts" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            ❓ Doubts
          </NavLink>
          <NavLink to="/complaints" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            📢 Complaints
          </NavLink>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<LostFound />} />
          <Route path="/events" element={<Events />} />
          <Route path="/doubts" element={<Doubts />} />
          <Route path="/doubts/:id" element={<DoubtDetails />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/complaints/:id" element={<ComplaintDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

