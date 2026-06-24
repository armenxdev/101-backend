const Joi = require('joi');

const createOrderSchema = Joi.object({
  userId: Joi.string().trim().allow('', null).optional(),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().trim().required(),
      quantity: Joi.number().integer().min(1).required(),
      size: Joi.string().trim().required(),
      title: Joi.string().trim().required(),
      price: Joi.number().required(),
      image: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
      ).optional(),
    })
  ).min(1).required()
    .messages({
      'any.required': 'Cart is empty',
      'array.min': 'Cart is empty',
    }),
});

const orderIdParamsSchema = Joi.object({
  id: Joi.string().trim().required()
    .messages({ 'any.required': 'Order ID is required' }),
});

module.exports = {
  createOrderSchema,
  orderIdParamsSchema,
};
