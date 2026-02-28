import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar'; // 1. Import the new Navbar

import LostFound from './pages/LostFound';
import Events from './pages/Events';
import Doubts from './pages/Doubts';
import DoubtDetails from './pages/DoubtDetails';
import Complaints from './pages/Complaints';
import ComplaintDetails from './pages/ComplaintDetails';
<<<<<<< Updated upstream
import Notes from './pages/Notes';
import NoteDetails from './pages/NoteDetails';
=======
import Login from './pages/Login'; 
>>>>>>> Stashed changes

function App() {
  return (
    <Router>
      <div className="app">
<<<<<<< Updated upstream
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
          <NavLink to="/notes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            📚 Notes
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
          <Route path="/notes" element={<Notes />} />
          <Route path="/notes/:id" element={<NoteDetails />} />
        </Routes>
=======
        {/* 2. Place the Navbar here */}
        <Navbar />

        {/* Routes wrapped in a 'content' container for CSS layout management */}
        <main className="content">
          <Routes>
            <Route path="/" element={<ProtectedRoute><LostFound /></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
            <Route path="/doubts" element={<ProtectedRoute><Doubts /></ProtectedRoute>} />
            <Route path="/doubts/:id" element={<ProtectedRoute><DoubtDetails /></ProtectedRoute>} />
            <Route path="/complaints" element={<ProtectedRoute><Complaints /></ProtectedRoute>} />
            <Route path="/complaints/:id" element={<ProtectedRoute><ComplaintDetails /></ProtectedRoute>} />
            
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
>>>>>>> Stashed changes
      </div>
    </Router>
  );
}

export default App;