const Joi = require('joi');

const createProductSchema = Joi.object({
  title: Joi.string().trim().required()
    .messages({ 'any.required': 'Product title is required' }),
  price: Joi.number().positive().required()
    .messages({
      'any.required': 'Product price is required',
      'number.positive': 'Price must be a positive number',
    }),
  category: Joi.string().trim().allow('', null).optional(),
  colors: Joi.alternatives().try(
    Joi.array().items(Joi.string().trim()),
    Joi.string().trim()
  ).optional(),
  isNewProducts: Joi.alternatives().try(Joi.boolean(), Joi.string()).optional(),
  isPopular: Joi.alternatives().try(Joi.boolean(), Joi.string()).optional(),
  visible: Joi.alternatives().try(Joi.boolean(), Joi.string()).optional(),
  description: Joi.string().trim().allow('', null).optional(),
});

const deleteProductParamsSchema = Joi.object({
  id: Joi.string().pattern(/^\d+$/).required()
    .messages({
      'any.required': 'Product ID is required',
      'string.pattern.base': 'Product ID must be numeric',
    }),
});

const favoriteSchema = Joi.object({
  productId: Joi.string().trim().required()
    .messages({ 'any.required': 'Product ID is required' }),
});

const cartItemSchema = Joi.object({
  productId: Joi.string().trim().required()
    .messages({ 'any.required': 'Product ID is required' }),
  quantity: Joi.number().integer().min(1).required()
    .messages({
      'any.required': 'Quantity is required',
      'number.min': 'Quantity must be at least 1',
    }),
  size: Joi.string().trim().required()
    .messages({ 'any.required': 'Size is required' }),
  title: Joi.string().trim().allow('', null).optional(),
  price: Joi.number().optional(),
  image: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string()
  ).optional(),
});

const removeCartItemSchema = Joi.object({
  cartItemId: Joi.string().trim().required()
    .messages({ 'any.required': 'Cart item ID is required' }),
  size: Joi.string().trim().required()
    .messages({ 'any.required': 'Size is required' }),
});

module.exports = {
  createProductSchema,
  deleteProductParamsSchema,
  favoriteSchema,
  cartItemSchema,
  removeCartItemSchema,
};
