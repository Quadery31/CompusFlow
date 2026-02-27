import express from 'express';
import {
    createItem,
    getItems,
    updateItem,
    deleteItem
} from '../controllers/lostFoundController.js';

const router = express.Router();

router.route('/')
    .get(getItems)
    .post(createItem);

router.route('/:id')
    .put(updateItem)
    .delete(deleteItem);

export default router;
