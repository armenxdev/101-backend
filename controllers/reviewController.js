const reviewService = require('../services/reviewService');
const { DuplicateReviewError } = require('../services/reviewService');

exports.addReview = async (req, res) => {
  try {
    const result = await reviewService.addReview(req.body, req.userId);
    res.status(201).json(result);
  } catch (err) {
    if (err instanceof DuplicateReviewError) {
      return res.status(400).json({ statusM: 111, error: err.message });
    }
    throw err;
  }
};

exports.getReviewsByProduct = async (req, res) => {
  const reviews = await reviewService.getReviewsByProduct(req.params.productId);
  res.json(reviews);
};
