const Joi = require('joi');

const verifyPaymentSchema = Joi.object({
  orderID: Joi.string().trim().required()
    .messages({ 'any.required': 'orderID is required' }),
});

const userOrderSchema = Joi.object({
  printfulOrder: Joi.array().min(1).required()
    .messages({
      'any.required': 'No printfulOrder provided',
      'array.min': 'No printfulOrder provided',
    }),
});

module.exports = {
  verifyPaymentSchema,
  userOrderSchema,
};
