import express from 'express';
import uploadMiddleware from '../middleware/uploadMiddleware.js';
import {
    uploadNote,
    getNotes,
    getNoteById,
    upvoteNote,
    addComment,
    deleteNote,
    deleteAllNotes,
    deleteComment,
    deleteAllComments
} from '../controllers/noteController.js';

const router = express.Router();

router.route('/')
    .get(getNotes)
    .post(uploadMiddleware, uploadNote)
    .delete(deleteAllNotes);

router.route('/:id')
    .get(getNoteById)
    .delete(deleteNote);

router.route('/:id/upvote')
    .put(upvoteNote);

router.route('/:id/comments')
    .post(addComment)
    .delete(deleteAllComments);

router.route('/:id/comments/:commentId')
    .delete(deleteComment);

export default router;
