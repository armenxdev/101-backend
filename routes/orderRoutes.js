const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middlewares/validate');
const { createOrderSchema, orderIdParamsSchema } = require('../validations/orderValidation');
const { createOrder, getOrderById } = require('../controllers/orderController');

router.post('/create', validate(createOrderSchema), asyncHandler(createOrder));
router.get('/:id', validate(orderIdParamsSchema, 'params'), asyncHandler(getOrderById));

module.exports = router;
