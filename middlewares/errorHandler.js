const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err.name === 'ValidationError' && err.isJoi) {
    return res.status(400).json({ message: err.details[0]?.message || 'Validation failed' });
  }

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const message = err.errors?.[0]?.message || 'Validation failed';
    return res.status(400).json({ message });
  }

  console.error(err.stack || err);
  res.status(500).json({ message: 'Something went wrong!' });
};

module.exports = errorHandler;
