import db from '../config/database.js';

/**
 * Fetch a single task by its ID.
 * @param {number|string} taskId
 * @returns {object|undefined} Task record or undefined if not found
 */
export function getTaskById(taskId) {
  const sql = 'SELECT * FROM tasks WHERE id = ?';
  return db.prepare(sql).get(taskId);
}

/**
 * Create a new task.
 * @param {object} taskData - Task attributes (column_id, title, description, priority, optional created_at)
 * @returns {object} The newly created task record
 */
export function createTask(taskData) {
  const columnId = taskData.column_id ?? taskData.columnId;
  const title = taskData.title;
  const description = taskData.description !== undefined ? taskData.description : null;
  const priority = taskData.priority;
  const createdAt = taskData.created_at ?? taskData.createdAt;

  if (createdAt !== undefined) {
    const sql = `
      INSERT INTO tasks (column_id, title, description, priority, created_at)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = db.prepare(sql).run(columnId, title, description, priority, createdAt);
    return getTaskById(result.lastInsertRowid);
  }

  const sql = `
    INSERT INTO tasks (column_id, title, description, priority)
    VALUES (?, ?, ?, ?)
  `;
  const result = db.prepare(sql).run(columnId, title, description, priority);
  return getTaskById(result.lastInsertRowid);
}

/**
 * Fetch tasks from the database with optional SQL filtering.
 * @param {object} [filter={}] - Filter criteria (column_id, board_id, priority)
 * @returns {Array<object>} Array of task records
 */
export function getTasks(filter = {}) {
  let sql = 'SELECT * FROM tasks';
  const conditions = [];
  const params = [];

  const columnId = filter.column_id ?? filter.columnId;
  const boardId = filter.board_id ?? filter.boardId;
  const priority = filter.priority;

  if (boardId !== undefined) {
    sql = `
      SELECT t.*
      FROM tasks t
      JOIN columns c ON t.column_id = c.id
    `;
    conditions.push('c.board_id = ?');
    params.push(boardId);
  }

  if (columnId !== undefined) {
    conditions.push(boardId !== undefined ? 't.column_id = ?' : 'column_id = ?');
    params.push(columnId);
  }

  if (priority !== undefined) {
    conditions.push(boardId !== undefined ? 't.priority = ?' : 'priority = ?');
    params.push(priority);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' ORDER BY id ASC';

  return db.prepare(sql).all(...params);
}

/**
 * Update an existing task's title, description, and/or priority.
 * @param {number|string} taskId
 * @param {object} taskData - Fields to update (title, description, priority)
 * @returns {object} Database run result ({ changes, lastInsertRowid })
 */
export function updateTask(taskId, taskData) {
  const updates = [];
  const params = [];

  if (taskData.title !== undefined) {
    updates.push('title = ?');
    params.push(taskData.title);
  }

  if (taskData.description !== undefined) {
    updates.push('description = ?');
    params.push(taskData.description);
  }

  if (taskData.priority !== undefined) {
    updates.push('priority = ?');
    params.push(taskData.priority);
  }

  if (updates.length === 0) {
    return { changes: 0, lastInsertRowid: 0 };
  }

  params.push(taskId);
  const sql = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
  return db.prepare(sql).run(...params);
}

/**
 * Delete a task by ID.
 * @param {number|string} taskId
 * @returns {object} Database run result ({ changes, lastInsertRowid })
 */
export function deleteTask(taskId) {
  const sql = 'DELETE FROM tasks WHERE id = ?';
  return db.prepare(sql).run(taskId);
}

/**
 * Move a task to another column.
 * @param {number|string} taskId
 * @param {number|string|object} columnId
 * @returns {object} Database run result ({ changes, lastInsertRowid })
 */
export function moveTask(taskId, columnId) {
  const targetColumnId = typeof columnId === 'object' && columnId !== null
    ? (columnId.column_id ?? columnId.columnId)
    : columnId;
  const sql = 'UPDATE tasks SET column_id = ? WHERE id = ?';
  return db.prepare(sql).run(targetColumnId, taskId);
}

/**
 * Get tasks with a given priority, ordered newest first.
 * @param {string} priority - Priority level ('Low', 'Medium', 'High')
 * @returns {Array<object>} Filtered and sorted task records with column names
 */
export function getTasksByPriority(priority) {
  const sql = `
    SELECT 
      t.id,
      t.column_id,
      c.name AS column_name,
      t.title,
      t.description,
      t.priority,
      t.created_at
    FROM tasks t
    JOIN columns c ON t.column_id = c.id
    WHERE t.priority = ?
    ORDER BY t.created_at DESC
  `;
  return db.prepare(sql).all(priority);
}

/**
 * Count tasks per column for a specified board (includes columns with 0 tasks).
 * @param {number|string} boardId
 * @returns {Array<object>} Column task counts
 */
export function countTasksPerColumn(boardId) {
  const sql = `
    SELECT 
      c.id AS column_id,
      c.name AS column_name,
      c.position AS column_position,
      COUNT(t.id) AS task_count
    FROM columns c
    LEFT JOIN tasks t ON c.id = t.column_id
    WHERE c.board_id = ?
    GROUP BY c.id, c.name, c.position
    ORDER BY c.position ASC
  `;
  return db.prepare(sql).all(boardId);
}

export default {
  getTaskById,
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  moveTask,
  getTasksByPriority,
  countTasksPerColumn,
};
