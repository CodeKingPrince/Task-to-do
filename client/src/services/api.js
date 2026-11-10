import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch a board and its columns by ID.
 * @param {number|string} boardId
 * @returns {Promise<object>} Board object with columns array
 */
export async function getBoard(boardId = 1) {
  const response = await apiClient.get(`/boards/${boardId}`);
  return response.data.data;
}

/**
 * Fetch all tasks.
 * @returns {Promise<Array<object>>} Array of task records
 */
export async function getTasks() {
  const response = await apiClient.get('/tasks');
  return response.data.data;
}

/**
 * Fetch tasks filtered by priority with newest-first ordering.
 * @param {string} priority - 'Low', 'Medium', or 'High'
 * @returns {Promise<Array<object>>} Array of task records
 */
export async function getTasksByPriority(priority) {
  const response = await apiClient.get('/tasks', {
    params: { priority },
  });
  return response.data.data;
}

/**
 * Create a new task.
 * @param {object} taskData - { title, description, priority, columnId }
 * @returns {Promise<object>} Newly created task
 */
export async function createTask(taskData) {
  const response = await apiClient.post('/tasks', taskData);
  return response.data.data;
}

/**
 * Update an existing task's title, description, and/or priority.
 * @param {number|string} taskId
 * @param {object} taskData - { title, description, priority }
 * @returns {Promise<object>} Updated task
 */
export async function updateTask(taskId, taskData) {
  const response = await apiClient.put(`/tasks/${taskId}`, taskData);
  return response.data.data;
}

/**
 * Delete a task by ID.
 * @param {number|string} taskId
 * @returns {Promise<object>} Deletion result
 */
export async function deleteTask(taskId) {
  const response = await apiClient.delete(`/tasks/${taskId}`);
  return response.data;
}

/**
 * Move a task to a different column.
 * @param {number|string} taskId
 * @param {number|string} columnId
 * @returns {Promise<object>} Updated task with new column_id
 */
export async function moveTask(taskId, columnId) {
  const response = await apiClient.patch(`/tasks/${taskId}/move`, { columnId });
  return response.data.data;
}

export default {
  getBoard,
  getTasks,
  getTasksByPriority,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
};
