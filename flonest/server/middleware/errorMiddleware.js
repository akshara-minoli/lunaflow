// Global Error Middleware for consistent API error response formatting
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = [];

  // Log error stack to console for debug purposes
  console.error('Error Catcher:', err);

  // Mongoose Bad ObjectId Cast Error (e.g. invalid mongo id format)
  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
    errors = ['The requested resource with that ID was not found'];
  }

  // Mongoose Duplicate Key Entry Error (e.g. double registration of emails)
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate database record value entered';
    errors = [Object.keys(err.keyValue).map(k => `${k} is already in use`).join(', ')];
  }

  // Mongoose Model Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map(val => val.message);
  }

  // If express-validator results are mounted on error
  if (err.array && typeof err.array === 'function') {
    statusCode = 400;
    message = 'Input parameters validation failed';
    errors = err.array().map(e => e.msg);
  }

  // If there are no errors populated yet, use message
  if (errors.length === 0) {
    errors = [message];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

module.exports = errorHandler;
