const reviewRepository = require('../repositories/reviewRepository');
const productRepository = require('../repositories/productRepository');
const AppError = require('../utils/AppError');
const { mapReview } = require('../utils/responseMappers');

class DuplicateReviewError extends Error {
  constructor() {
    super('You already reviewed this product');
    this.statusM = 111;
  }
}

const addReview = async ({ productId, username, rating, message, guestId }, userPublicId) => {
  const product = await productRepository.findByExternalId(productId);
  if (!product) throw new AppError('Product not found', 404);

  const existing = await reviewRepository.findExistingReview({
    productExternalId: productId,
    userPublicId: userPublicId || null,
    guestId: guestId || null,
  });

  if (existing) {
    const err = new DuplicateReviewError();
    throw err;
  }

  const review = await reviewRepository.create({
    productId: product.id,
    productExternalId: productId,
    userId: userPublicId ? (await require('../repositories/cartRepository').findUserByPublicId(userPublicId))?.id : null,
    userPublicId: userPublicId || null,
    guestId: guestId || null,
    username: username || 'Anonymous',
    rating,
    message: message || null,
    reviewDate: new Date().toLocaleDateString(),
  });

  return { success: true, review: mapReview(review) };
};

const getReviewsByProduct = async (productExternalId) => {
  const reviews = await reviewRepository.findByProductExternalId(productExternalId);
  return reviews.map(mapReview);
};

module.exports = {
  addReview,
  getReviewsByProduct,
  DuplicateReviewError,
};
