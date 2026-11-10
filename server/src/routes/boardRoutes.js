import express from 'express';
import boardController from '../controllers/boardController.js';

const router = express.Router();

router.get('/:id', boardController.getBoard);

export default router;
