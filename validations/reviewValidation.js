const Joi = require('joi');

const addReviewSchema = Joi.object({
  productId: Joi.string().trim().required()
    .messages({ 'any.required': 'Missing required fields' }),
  username: Joi.string().trim().allow('', null).optional(),
  rating: Joi.number().integer().min(1).max(5).required()
    .messages({
      'any.required': 'Missing required fields',
      'number.min': 'Rating must be between 1 and 5',
      'number.max': 'Rating must be between 1 and 5',
    }),
  message: Joi.string().trim().max(2000).allow('', null).optional(),
  guestId: Joi.string().trim().allow('', null).optional(),
});

const productIdParamsSchema = Joi.object({
  productId: Joi.string().trim().required()
    .messages({ 'any.required': 'Product ID is required' }),
});

module.exports = {
  addReviewSchema,
  productIdParamsSchema,
};
