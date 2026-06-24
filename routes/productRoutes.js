const express = require('express');
const multer = require('multer');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middlewares/validate');
const { isAllowedMediaType } = require('../utils/cloudinary');
const {
  createProductSchema,
  deleteProductParamsSchema,
  favoriteSchema,
  cartItemSchema,
  removeCartItemSchema,
} = require('../validations/productValidation');
const {
  addProduct,
  getProducts,
  addToFavorites,
  removeFromFavorites,
  addToCart,
  removeFromCart,
  getCart,
  getBrandProducts,
  deleteProduct,
} = require('../controllers/productController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (isAllowedMediaType(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  },
});

router.post('/', upload.array('images'), validate(createProductSchema), asyncHandler(addProduct));
router.get('/', asyncHandler(getProducts));
router.delete('/:id(\\d+)', validate(deleteProductParamsSchema, 'params'), asyncHandler(deleteProduct));

router.post('/favorites', auth, validate(favoriteSchema), asyncHandler(addToFavorites));
router.delete('/favorites', auth, validate(favoriteSchema), asyncHandler(removeFromFavorites));

router.post('/cart', auth, validate(cartItemSchema), asyncHandler(addToCart));
router.delete('/cart', auth, validate(removeCartItemSchema), asyncHandler(removeFromCart));
router.get('/cart', auth, asyncHandler(getCart));
router.get('/brand', asyncHandler(getBrandProducts));

module.exports = router;
