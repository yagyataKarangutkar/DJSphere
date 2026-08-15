// Handle 404 Not Found routes
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global Express error handler middleware
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose duplicate key error (e.g. unique email constraint)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate ${field} entered. ${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // Handle Mongoose invalid ObjectId (CastError)
  if (err.name === 'CastError') {
    statusCode = 404;
    message = `Resource not found with id of ${err.value}`;
  }

  // Handle JWT invalid or expired token errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Not authorized, token failed verification';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Not authorized, token has expired';
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
