const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middlewares/validate');
const { loginLimiter } = require('../middlewares/rateLimiter');
const {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require('../validations/authValidation');
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  refresh,
  logout,
  getProfile,
  deleteAccount,
} = require('../controllers/authController');

router.post('/refresh', asyncHandler(refresh));
router.post('/register', validate(registerSchema), asyncHandler(register));
router.post('/login', loginLimiter, validate(loginSchema), asyncHandler(login));
router.post('/forgot-password', loginLimiter, validate(forgotPasswordSchema), asyncHandler(forgotPassword));
router.post('/reset-password', validate(resetPasswordSchema), asyncHandler(resetPassword));
router.post('/verify-email', loginLimiter, validate(verifyEmailSchema), asyncHandler(verifyEmail));
router.post('/logout', asyncHandler(logout));
router.get('/profile', auth, asyncHandler(getProfile));
router.delete('/delete', auth, asyncHandler(deleteAccount));

module.exports = router;
