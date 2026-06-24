const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middlewares/validate');
const { userOrderSchema } = require('../validations/paymentValidation');
const {
  getCart,
  getPayments,
  checkId,
  saveUserOrder,
  getUserOrders,
} = require('../controllers/userController');

router.get('/cart', auth, asyncHandler(getCart));
router.get('/payments', auth, asyncHandler(getPayments));
router.get('/checkId', auth, asyncHandler(checkId));
router.post('/userOrders', auth, validate(userOrderSchema), asyncHandler(saveUserOrder));
router.get('/userOrders', auth, asyncHandler(getUserOrders));

module.exports = router;
