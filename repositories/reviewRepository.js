const { Review } = require('../models');

const findByProductExternalId = (productExternalId) =>
  Review.findAll({
    where: { productExternalId },
    order: [['createdAt', 'DESC']],
  });

const findExistingReview = ({ productExternalId, userPublicId, guestId }) => {
  const { Op } = require('sequelize');
  const conditions = [{ productExternalId }];

  if (userPublicId) {
    return Review.findOne({ where: { productExternalId, userPublicId } });
  }
  if (guestId) {
    return Review.findOne({ where: { productExternalId, guestId } });
  }
  return null;
};

const create = (data) => Review.create(data);

module.exports = {
  findByProductExternalId,
  findExistingReview,
  create,
};
