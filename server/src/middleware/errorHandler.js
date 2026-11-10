/**
 * Centralized Express error-handling middleware.
 */
export function errorHandler(err, req, res, next) {
  const message = err.message || 'Internal server error';

  // Determine status code based on error message or explicit statusCode
  let statusCode = err.statusCode || err.status || 500;

  if (
    message.includes('not found') ||
    message.includes('Not found')
  ) {
    statusCode = 404;
  } else if (
    message.includes('required') ||
    message.includes('invalid') ||
    message.includes('Invalid') ||
    message.includes('cannot be empty') ||
    message.includes('CHECK constraint failed')
  ) {
    statusCode = 400;
  }

  // Ensure 500 errors don't leak database/system internals
  const clientMessage =
    statusCode === 500
      ? 'Internal server error'
      : message;

  res.status(statusCode).json({
    success: false,
    error: clientMessage,
  });
}

export default errorHandler;
