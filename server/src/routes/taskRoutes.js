import express from 'express';
import taskController from '../controllers/taskController.js';
import {
  validateCreateTask,
  validateUpdateTask,
  validateMoveTask,
} from '../middleware/validateTask.js';

const router = express.Router();

router.get('/', taskController.getTasks);
router.post('/', validateCreateTask, taskController.createTask);
router.put('/:id', validateUpdateTask, taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.patch('/:id/move', validateMoveTask, taskController.moveTask);

export default router;
