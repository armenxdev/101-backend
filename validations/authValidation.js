const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().trim().allow('').optional()
    .messages({ 'string.base': 'Username must be a string' }),
  email: Joi.string().trim().email().required()
    .messages({
      'any.required': 'Email is required',
      'string.email': 'Please provide a valid email address',
    }),
  password: Joi.string().min(6).required()
    .messages({
      'any.required': 'Password is required',
      'string.min': 'Password must be at least 6 characters',
    }),
});

const loginSchema = Joi.object({
  identifier: Joi.string().trim().required()
    .messages({
      'any.required': 'Email or username is required',
    }),
  password: Joi.string().required()
    .messages({ 'any.required': 'Password is required' }),
});

const verifyEmailSchema = Joi.object({
  email: Joi.string().trim().email().required()
    .messages({
      'any.required': 'Email is required',
      'string.email': 'Please provide a valid email address',
    }),
  code: Joi.string().trim().length(6).required()
    .messages({
      'any.required': 'Verification code is required',
      'string.length': 'Verification code must be 6 digits',
    }),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().trim().email().required()
    .messages({
      'any.required': 'Please enter your email',
      'string.email': 'Please provide a valid email address',
    }),
});

const resetPasswordSchema = Joi.object({
  code: Joi.string().trim().length(6).required()
    .messages({
      'any.required': 'Please provide the code and new password',
      'string.length': 'Reset code must be 6 digits',
    }),
  password: Joi.string().min(6).required()
    .messages({
      'any.required': 'Please provide the code and new password',
      'string.min': 'Password must be at least 6 characters',
    }),
});

module.exports = {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
