import express from 'express';
import {
    createDoubt,
    getDoubts,
    getDoubtById,
    addAnswer,
    upvoteAnswer,
    markSolved,
    deleteDoubt,
    deleteAllDoubts
} from '../controllers/doubtController.js';

const router = express.Router();

router.route('/')
    .get(getDoubts)
    .post(createDoubt)
    .delete(deleteAllDoubts);

router.route('/:id')
    .get(getDoubtById)
    .delete(deleteDoubt);

router.route('/:id/answers')
    .post(addAnswer);

router.route('/:id/answers/:answerId/upvote')
    .put(upvoteAnswer);

router.route('/:id/solve')
    .put(markSolved);

export default router;

