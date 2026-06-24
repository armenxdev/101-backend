const AppError = require('../utils/AppError');

const validate = (schema, property = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[property], {
    abortEarly: true,
    stripUnknown: true,
  });

  if (error) {
    const message = error.details[0]?.message || 'Validation failed';
    return next(new AppError(message, 400, 'VALIDATION_ERROR'));
  }

  req[property] = value;
  next();
};

module.exports = validate;
