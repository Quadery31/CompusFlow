import express from 'express';
import { googleAuth } from '../controllers/authController.js'; // Matches the named export

const router = express.Router();

router.post('/google', googleAuth);

export default router;