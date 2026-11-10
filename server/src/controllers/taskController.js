import taskService from '../services/taskService.js';

/**
 * Handle GET /api/tasks (with optional ?priority= filter)
 */
export function getTasks(req, res, next) {
  try {
    const { priority } = req.query;
    let tasks;
    if (priority) {
      tasks = taskService.getTasksByPriority(priority);
    } else {
      tasks = taskService.getTasks();
    }

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Handle POST /api/tasks
 */
export function createTask(req, res, next) {
  try {
    const createdTask = taskService.createTask(req.body);
    res.status(201).json({
      success: true,
      data: createdTask,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Handle PUT /api/tasks/:id
 */
export function updateTask(req, res, next) {
  try {
    const { id } = req.params;
    const updatedTask = taskService.updateTask(id, req.body);
    res.status(200).json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Handle DELETE /api/tasks/:id
 */
export function deleteTask(req, res, next) {
  try {
    const { id } = req.params;
    const result = taskService.deleteTask(id);
    res.status(200).json({
      success: true,
      data: {
        message: result.message || 'Task deleted successfully',
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Handle PATCH /api/tasks/:id/move
 */
export function moveTask(req, res, next) {
  try {
    const { id } = req.params;
    const columnId = req.body.columnId ?? req.body.column_id;
    const movedTask = taskService.moveTask(id, columnId);
    res.status(200).json({
      success: true,
      data: movedTask,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
};
