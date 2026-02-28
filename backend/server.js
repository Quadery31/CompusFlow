import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import connectDB from './config/db.js';
import lostFoundRoutes from './routes/lostFoundRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import doubtRoutes from './routes/doubtRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import authRoutes from './routes/authRoutes.js';
import classroomRoutes from './routes/classroomRoutes.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Basic root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// API test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test API is working successfully!' });
});

// Mount Routes
app.use('/api/lost', lostFoundRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/doubts', doubtRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/classrooms', classroomRoutes);

// FIXED: Mount the auth routes here so Express listens for /api/auth/google
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});