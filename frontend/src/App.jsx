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
import Notes from './pages/Notes';
import NoteDetails from './pages/NoteDetails';
import ClassroomAvailability from './pages/ClassroomAvailability';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <div className="app">
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
            <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
            <Route path="/notes/:id" element={<ProtectedRoute><NoteDetails /></ProtectedRoute>} />
            <Route path="/classrooms" element={<ProtectedRoute><ClassroomAvailability /></ProtectedRoute>} />

            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;