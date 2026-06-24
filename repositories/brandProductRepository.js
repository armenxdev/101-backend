const {
  BrandProduct,
  BrandProductImage,
  BrandProductColor,
  UserOrder,
  User,
} = require('../models');

const brandIncludes = [
  { model: BrandProductImage, as: 'images' },
  { model: BrandProductColor, as: 'colors' },
];

const findAllBrandProducts = () =>
  BrandProduct.findAll({ include: brandIncludes, order: [['sortOrder', 'ASC']] });

const createUserOrder = (data) => UserOrder.create(data);

const findUserOrders = async (userPublicId) => {
  const user = await User.findOne({ where: { publicId: userPublicId } });
  if (!user) return null;
  return UserOrder.findAll({
    where: { userId: user.id },
    order: [['createdAt', 'DESC']],
  });
};

const findUserByPublicId = (publicId) =>
  User.findOne({ where: { publicId } });

module.exports = {
  findAllBrandProducts,
  createUserOrder,
  findUserOrders,
  findUserByPublicId,
};
