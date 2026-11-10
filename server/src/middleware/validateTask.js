const VALID_PRIORITIES = ['Low', 'Medium', 'High'];

/**
 * Middleware to validate task creation requests (POST /api/tasks).
 */
export function validateCreateTask(req, res, next) {
  const { title, priority, columnId, column_id } = req.body || {};

  // Validate title
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Task title is required',
    });
  }

  // Validate column ID format
  const rawColumnId = columnId ?? column_id;
  if (
    rawColumnId === undefined ||
    rawColumnId === null ||
    isNaN(Number(rawColumnId)) ||
    Number(rawColumnId) <= 0
  ) {
    return res.status(400).json({
      success: false,
      error: 'Valid column ID is required',
    });
  }

  // Validate priority if provided
  if (priority !== undefined && priority !== null && priority !== '') {
    const isPriorityValid = VALID_PRIORITIES.some(
      (p) => p.toLowerCase() === String(priority).trim().toLowerCase()
    );
    if (!isPriorityValid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid priority. Allowed values: Low, Medium, High',
      });
    }
  }

  // Normalize trimmed title on body
  req.body.title = title.trim();

  next();
}

/**
 * Middleware to validate task update requests (PUT /api/tasks/:id).
 */
export function validateUpdateTask(req, res, next) {
  const { id } = req.params;
  const { title, priority } = req.body || {};

  // Validate task ID in params
  if (!id || isNaN(Number(id)) || Number(id) <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid task ID',
    });
  }

  // If title is explicitly provided, it cannot be empty or whitespace
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Task title cannot be empty',
      });
    }
    req.body.title = title.trim();
  }

  // If priority is explicitly provided, validate value
  if (priority !== undefined) {
    if (priority === null || priority === '') {
      return res.status(400).json({
        success: false,
        error: 'Invalid priority. Allowed values: Low, Medium, High',
      });
    }
    const isPriorityValid = VALID_PRIORITIES.some(
      (p) => p.toLowerCase() === String(priority).trim().toLowerCase()
    );
    if (!isPriorityValid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid priority. Allowed values: Low, Medium, High',
      });
    }
  }

  next();
}

/**
 * Middleware to validate task movement requests (PATCH /api/tasks/:id/move).
 */
export function validateMoveTask(req, res, next) {
  const { id } = req.params;
  const { columnId, column_id } = req.body || {};

  // Validate task ID
  if (!id || isNaN(Number(id)) || Number(id) <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid task ID',
    });
  }

  // Validate target column ID
  const targetColumnId = columnId ?? column_id;
  if (
    targetColumnId === undefined ||
    targetColumnId === null ||
    isNaN(Number(targetColumnId)) ||
    Number(targetColumnId) <= 0
  ) {
    return res.status(400).json({
      success: false,
      error: 'Valid column ID is required',
    });
  }

  next();
}

export default {
  validateCreateTask,
  validateUpdateTask,
  validateMoveTask,
};
