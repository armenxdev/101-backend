const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middlewares/validate');
const { verifyPaymentSchema } = require('../validations/paymentValidation');
const { verifyPayment } = require('../controllers/paymentController');

router.post('/verify', validate(verifyPaymentSchema), asyncHandler(verifyPayment));

module.exports = router;
