const express = require('express');
const router = express.Router();
const optionalAuth = require('../middlewares/optionalAuth');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middlewares/validate');
const { addReviewSchema, productIdParamsSchema } = require('../validations/reviewValidation');
const { addReview, getReviewsByProduct } = require('../controllers/reviewController');

router.post('/', optionalAuth, validate(addReviewSchema), asyncHandler(addReview));
router.get('/:productId', validate(productIdParamsSchema, 'params'), asyncHandler(getReviewsByProduct));

module.exports = router;
