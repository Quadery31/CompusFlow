import express from 'express';
import {
    createComplaint,
    getComplaints,
    getComplaintById,
    upvoteComplaint,
    addComment,
    updateStatus,
    deleteComplaint,
    deleteAllComplaints
} from '../controllers/complaintController.js';

const router = express.Router();

router.route('/')
    .get(getComplaints)
    .post(createComplaint)
    .delete(deleteAllComplaints);

router.route('/:id')
    .get(getComplaintById)
    .delete(deleteComplaint);

router.route('/:id/upvote')
    .put(upvoteComplaint);

router.route('/:id/comments')
    .post(addComment);

router.route('/:id/status')
    .put(updateStatus);

export default router;
