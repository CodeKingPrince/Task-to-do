import taskRepository from '../repositories/taskRepository.js';
import boardRepository from '../repositories/boardRepository.js';

const VALID_PRIORITIES = ['Low', 'Medium', 'High'];

/**
 * Validate that a column exists.
 * @param {number|string} columnId
 * @param {number|string} [boardId=1]
 * @returns {number} Validated column ID
 */
function validateColumnExists(columnId, boardId = 1) {
  const parsedColId = Number(columnId);
  if (!columnId || isNaN(parsedColId) || parsedColId <= 0) {
    throw new Error('Invalid column ID');
  }

  const columns = boardRepository.getColumnsByBoard(boardId);
  const exists = columns && columns.some((col) => col.id === parsedColId);
  if (!exists) {
    throw new Error('Column not found');
  }

  return parsedColId;
}

/**
 * Get all tasks with optional filters.
 * @param {object} [filter]
 * @returns {Array<object>} Array of task records
 */
export function getTasks(filter) {
  return taskRepository.getTasks(filter);
}

/**
 * Fetch a single task by its ID.
 * @param {number|string} taskId
 * @returns {object} Task record
 */
export function getTaskById(taskId) {
  const parsedTaskId = Number(taskId);
  if (!taskId || isNaN(parsedTaskId) || parsedTaskId <= 0) {
    throw new Error('Invalid task ID');
  }

  const task = taskRepository.getTaskById(parsedTaskId);
  if (!task) {
    throw new Error('Task not found');
  }

  return task;
}

/**
 * Create a new task after validating title, column, and priority.
 * @param {object} taskData
 * @returns {object} Created task record
 */
export function createTask(taskData) {
  if (!taskData || typeof taskData !== 'object') {
    throw new Error('Task data is required');
  }

  const title = taskData.title;
  if (typeof title !== 'string' || title.trim() === '') {
    throw new Error('Task title is required');
  }
  const trimmedTitle = title.trim();

  const rawColumnId = taskData.column_id ?? taskData.columnId;
  const boardId = taskData.board_id ?? taskData.boardId ?? 1;
  const validatedColumnId = validateColumnExists(rawColumnId, boardId);

  let priority = 'Medium';
  if (taskData.priority !== undefined && taskData.priority !== null && taskData.priority !== '') {
    const matched = VALID_PRIORITIES.find(
      (p) => p.toLowerCase() === String(taskData.priority).trim().toLowerCase()
    );
    if (!matched) {
      throw new Error('Invalid priority');
    }
    priority = matched;
  }

  const description = taskData.description !== undefined && taskData.description !== null
    ? String(taskData.description).trim()
    : null;

  const insertPayload = {
    column_id: validatedColumnId,
    title: trimmedTitle,
    description: description !== '' ? description : null,
    priority,
  };

  if (taskData.created_at || taskData.createdAt) {
    insertPayload.created_at = taskData.created_at || taskData.createdAt;
  }

  return taskRepository.createTask(insertPayload);
}

/**
 * Update an existing task's title, description, and/or priority.
 * @param {number|string} taskId
 * @param {object} taskData
 * @returns {object} Updated task record
 */
export function updateTask(taskId, taskData) {
  const parsedTaskId = Number(taskId);
  if (!taskId || isNaN(parsedTaskId) || parsedTaskId <= 0) {
    throw new Error('Invalid task ID');
  }

  const existingTask = taskRepository.getTaskById(parsedTaskId);
  if (!existingTask) {
    throw new Error('Task not found');
  }

  if (!taskData || typeof taskData !== 'object') {
    throw new Error('Task data is required');
  }

  const updatePayload = {};

  if (taskData.title !== undefined) {
    if (typeof taskData.title !== 'string' || taskData.title.trim() === '') {
      throw new Error('Task title cannot be empty');
    }
    updatePayload.title = taskData.title.trim();
  }

  if (taskData.description !== undefined) {
    updatePayload.description = taskData.description !== null
      ? String(taskData.description).trim()
      : null;
  }

  if (taskData.priority !== undefined) {
    if (taskData.priority === null || taskData.priority === '') {
      throw new Error('Invalid priority');
    }
    const matched = VALID_PRIORITIES.find(
      (p) => p.toLowerCase() === String(taskData.priority).trim().toLowerCase()
    );
    if (!matched) {
      throw new Error('Invalid priority');
    }
    updatePayload.priority = matched;
  }

  if (Object.keys(updatePayload).length > 0) {
    taskRepository.updateTask(parsedTaskId, updatePayload);
  }

  return taskRepository.getTaskById(parsedTaskId);
}

/**
 * Delete a task by ID after validating existence.
 * @param {number|string} taskId
 * @returns {object} Result object with success and deleted taskId
 */
export function deleteTask(taskId) {
  const parsedTaskId = Number(taskId);
  if (!taskId || isNaN(parsedTaskId) || parsedTaskId <= 0) {
    throw new Error('Invalid task ID');
  }

  const existingTask = taskRepository.getTaskById(parsedTaskId);
  if (!existingTask) {
    throw new Error('Task not found');
  }

  const result = taskRepository.deleteTask(parsedTaskId);
  return {
    success: true,
    message: 'Task deleted successfully',
    taskId: parsedTaskId,
    changes: result.changes,
  };
}

/**
 * Move a task to another column after validating task and target column existence.
 * @param {number|string} taskId
 * @param {number|string|object} columnId
 * @returns {object} Updated task record with new column_id
 */
export function moveTask(taskId, columnId) {
  const parsedTaskId = Number(taskId);
  if (!taskId || isNaN(parsedTaskId) || parsedTaskId <= 0) {
    throw new Error('Invalid task ID');
  }

  const existingTask = taskRepository.getTaskById(parsedTaskId);
  if (!existingTask) {
    throw new Error('Task not found');
  }

  const rawColumnId = typeof columnId === 'object' && columnId !== null
    ? (columnId.column_id ?? columnId.columnId)
    : columnId;
  const validatedColumnId = validateColumnExists(rawColumnId);

  taskRepository.moveTask(parsedTaskId, validatedColumnId);
  return taskRepository.getTaskById(parsedTaskId);
}

/**
 * Get tasks with a given priority, ordered newest first.
 * @param {string} priority
 * @returns {Array<object>} Filtered task records
 */
export function getTasksByPriority(priority) {
  if (!priority || typeof priority !== 'string') {
    throw new Error('Invalid priority');
  }

  const matched = VALID_PRIORITIES.find(
    (p) => p.toLowerCase() === priority.trim().toLowerCase()
  );
  if (!matched) {
    throw new Error('Invalid priority');
  }

  return taskRepository.getTasksByPriority(matched);
}

/**
 * Count tasks per column for a specified board.
 * @param {number|string} boardId
 * @returns {Array<object>} Column task counts
 */
export function countTasksPerColumn(boardId) {
  const parsedBoardId = Number(boardId);
  if (!boardId || isNaN(parsedBoardId) || parsedBoardId <= 0) {
    throw new Error('Invalid board ID');
  }

  const board = boardRepository.getBoard(parsedBoardId);
  if (!board) {
    throw new Error('Board not found');
  }

  return taskRepository.countTasksPerColumn(parsedBoardId);
}

export default {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
  getTasksByPriority,
  countTasksPerColumn,
};
