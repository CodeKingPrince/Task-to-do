import boardRepository from '../repositories/boardRepository.js';

/**
 * Fetch a board and its associated columns by board ID.
 * @param {number|string} boardId
 * @returns {object} Board object with columns array
 */
export function getBoard(boardId) {
  const parsedBoardId = Number(boardId);
  if (!boardId || isNaN(parsedBoardId) || parsedBoardId <= 0) {
    throw new Error('Invalid board ID');
  }

  const board = boardRepository.getBoard(parsedBoardId);
  if (!board) {
    throw new Error('Board not found');
  }

  const columns = boardRepository.getColumnsByBoard(parsedBoardId);

  return {
    ...board,
    columns: columns || [],
  };
}

/**
 * Get task count per column for a given board.
 * @param {number|string} boardId
 * @returns {Array<object>} Task count per column
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

  return boardRepository.countTasksPerColumn(parsedBoardId);
}

export default {
  getBoard,
  countTasksPerColumn,
};
