# Complete Refactoring Todo List

## Phase 1: Foundation & Configuration
- [ ] Update package.json (remove MongoDB/mongoose, add mysql2, sequelize, redis, joi, cloudinary, ioredis)
- [ ] Create MySQL database config (config/database.js) with Sequelize
- [ ] Create Redis config (config/redis.js)
- [ ] Create Cloudinary config (config/cloudinary.js)
- [ ] Create .env.example

## Phase 2: Sequelize Models (Replacing MongoDB Models)
- [ ] models/User.js
- [ ] models/Product.js
- [ ] models/Review.js
- [ ] models/Order.js
- [ ] models/OrderItem.js
- [ ] models/Payment.js
- [ ] models/RefreshToken.js
- [ ] models/TempUser.js
- [ ] models/BrandProduct.js
- [ ] models/Favorite.js
- [ ] models/Cart.js
- [ ] models/CartItem.js
- [ ] models/UserOrder.js
- [ ] models/index.js (associations)

## Phase 3: Utility Files
- [ ] utils/AppError.js (Custom Error Class)
- [ ] utils/asyncHandler.js (Async Wrapper)
- [ ] utils/cookieUtils.js (JWT Cookie Management)
- [ ] utils/cryptoUtils.js (Hashing/Encryption)
- [ ] utils/logger.js (Winston Logger)
- [ ] utils/cloudinary.js (Media Upload)
- [ ] utils/sendEmail.js (Email Service)
- [ ] utils/paypal.js (PayPal Integration)
- [ ] utils/printfulApi.js (Printful API)

## Phase 4: Middlewares
- [ ] middleware/authMiddleware.js (RBAC-ready)
- [ ] middleware/optionalAuth.js
- [ ] middleware/validate.js (Joi Validation Middleware)
- [ ] middleware/rateLimiter.js
- [ ] middleware/errorHandler.js (Global Error Handler)

## Phase 5: Joi Validation Schemas
- [ ] validations/authValidation.js
- [ ] validations/productValidation.js
- [ ] validations/reviewValidation.js
- [ ] validations/orderValidation.js

## Phase 6: Repositories (Sequelize Queries)
- [ ] repositories/userRepository.js
- [ ] repositories/productRepository.js
- [ ] repositories/reviewRepository.js
- [ ] repositories/orderRepository.js
- [ ] repositories/paymentRepository.js
- [ ] repositories/brandProductRepository.js

## Phase 7: Services (Business Logic)
- [ ] services/authService.js
- [ ] services/productService.js
- [ ] services/reviewService.js
- [ ] services/orderService.js
- [ ] services/paymentService.js
- [ ] services/userService.js

## Phase 8: Controllers (Thin, Only Request/Response)
- [ ] controllers/authController.js
- [ ] controllers/productController.js
- [ ] controllers/reviewController.js
- [ ] controllers/orderController.js
- [ ] controllers/paymentController.js
- [ ] controllers/userController.js

## Phase 9: Routes
- [ ] routes/authRoutes.js
- [ ] routes/productRoutes.js
- [ ] routes/reviewRoutes.js
- [ ] routes/orderRoutes.js
- [ ] routes/paypalRoutes.js
- [ ] routes/userRoutes.js

## Phase 10: Server Entry Point
- [ ] server.js (Express app with all middleware, Redis, DB sync)

## Phase 11: Verification
- [ ] Test that API response structure matches frontend expectations
- [ ] Verify all endpoints work correctly
