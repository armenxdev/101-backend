const { Cart, CartItem, CartItemImage, User } = require('../models');

const cartIncludes = [
  {
    model: CartItem,
    as: 'items',
    include: [{ model: CartItemImage, as: 'images' }],
  },
];

const findUserByPublicId = (publicId) =>
  User.findOne({ where: { publicId } });

const getOrCreateCart = async (userId, transaction) => {
  let cart = await Cart.findOne({ where: { userId }, transaction });
  if (!cart) {
    cart = await Cart.create({ userId }, { transaction });
  }
  return cart;
};

const findCartWithItems = (userId) =>
  Cart.findOne({ where: { userId }, include: cartIncludes });

const findCartItem = (cartId, productExternalId, size) =>
  CartItem.findOne({ where: { cartId, productExternalId, size } });

const createCartItem = (data, transaction) =>
  CartItem.create(data, { transaction });

const updateCartItem = (item, data, transaction) =>
  item.update(data, { transaction });

const deleteCartItem = (item, transaction) =>
  item.destroy({ transaction });

const createCartItemImages = (images, transaction) =>
  CartItemImage.bulkCreate(images, { transaction });

const deleteCartItemImages = (cartItemId, transaction) =>
  CartItemImage.destroy({ where: { cartItemId }, transaction });

const clearCart = async (userId, transaction) => {
  const cart = await Cart.findOne({ where: { userId }, transaction });
  if (!cart) return;
  await CartItem.destroy({ where: { cartId: cart.id }, transaction });
};

const removeItemsByExternalId = async (productExternalId, transaction) => {
  await CartItem.destroy({ where: { productExternalId }, transaction });
};

module.exports = {
  findUserByPublicId,
  getOrCreateCart,
  findCartWithItems,
  findCartItem,
  createCartItem,
  updateCartItem,
  deleteCartItem,
  createCartItemImages,
  deleteCartItemImages,
  clearCart,
  removeItemsByExternalId,
  cartIncludes,
};
