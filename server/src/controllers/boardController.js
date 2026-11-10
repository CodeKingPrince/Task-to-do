import boardService from '../services/boardService.js';

/**
 * Handle GET /api/boards/:id
 */
export function getBoard(req, res, next) {
  try {
    const { id } = req.params;
    const board = boardService.getBoard(id);
    res.status(200).json({
      success: true,
      data: board,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getBoard,
};
