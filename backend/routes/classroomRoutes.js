import express from 'express';
import {
    createClassroom,
    getAllClassrooms,
    getAvailableClassrooms,
} from '../controllers/classroomController.js';

const router = express.Router();

// Define routes
router.post('/', createClassroom);
router.get('/', getAllClassrooms);
router.get('/available', getAvailableClassrooms);

export default router;
