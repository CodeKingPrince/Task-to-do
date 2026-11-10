import db from '../config/database.js';

/**
 * Fetch a single board by its ID.
 * @param {number|string} boardId
 * @returns {object|undefined} Board record or undefined if not found
 */
export function getBoard(boardId) {
  const sql = 'SELECT * FROM boards WHERE id = ?';
  return db.prepare(sql).get(boardId);
}

/**
 * Fetch all columns belonging to a board, ordered by position.
 * @param {number|string} boardId
 * @returns {Array<object>} Array of column records
 */
export function getColumnsByBoard(boardId) {
  const sql = 'SELECT * FROM columns WHERE board_id = ? ORDER BY position ASC';
  return db.prepare(sql).all(boardId);
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
  getBoard,
  getColumnsByBoard,
  countTasksPerColumn,
};
