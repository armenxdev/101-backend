const { sequelize } = require('../config/database');
const cartRepository = require('../repositories/cartRepository');
const productRepository = require('../repositories/productRepository');
const AppError = require('../utils/AppError');
const { mapCartItem } = require('../utils/responseMappers');

const parseImages = (image) => {
  if (!image) return [];
  if (Array.isArray(image)) return image;
  try {
    const parsed = JSON.parse(image);
    return Array.isArray(parsed) ? parsed : [image];
  } catch {
    return [image];
  }
};

const getUserOrFail = async (userPublicId) => {
  const user = await cartRepository.findUserByPublicId(userPublicId);
  if (!user) throw new AppError('User not found', 404);
  return user;
};

const addToCart = async (userPublicId, { productId, quantity, size, title, price, image }) => {
  const user = await getUserOrFail(userPublicId);
  const transaction = await sequelize.transaction();

  try {
    const cart = await cartRepository.getOrCreateCart(user.id, transaction);
    const product = await productRepository.findByExternalId(productId);
    const images = parseImages(image);

    let item = await cartRepository.findCartItem(cart.id, productId, size);

    if (item) {
      await cartRepository.updateCartItem(item, { quantity, title, price }, transaction);
      await cartRepository.deleteCartItemImages(item.id, transaction);
    } else {
      item = await cartRepository.createCartItem({
        cartId: cart.id,
        productId: product?.id || null,
        productExternalId: productId,
        quantity,
        size,
        title,
        price,
      }, transaction);
    }

    if (images.length > 0) {
      await cartRepository.createCartItemImages(
        images.map((url, i) => ({ cartItemId: item.id, url, sortOrder: i })),
        transaction
      );
    }

    await transaction.commit();

    const updatedCart = await cartRepository.findCartWithItems(user.id);
    return { cart: updatedCart.items.map(mapCartItem) };
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

const removeFromCart = async (userPublicId, { cartItemId, size }) => {
  const user = await getUserOrFail(userPublicId);
  const cart = await cartRepository.findCartWithItems(user.id);
  if (!cart) throw new AppError('User not found', 404);

  const item = cart.items.find(
    (i) => i.productExternalId === cartItemId && i.size === size
  );
  if (item) await cartRepository.deleteCartItem(item);

  const updatedCart = await cartRepository.findCartWithItems(user.id);
  return { cart: (updatedCart?.items || []).map(mapCartItem) };
};

const getCartWrapped = async (userPublicId) => {
  const user = await getUserOrFail(userPublicId);
  const cart = await cartRepository.findCartWithItems(user.id);
  return { cart: (cart?.items || []).map(mapCartItem) };
};

const getCartRaw = async (userPublicId) => {
  const user = await getUserOrFail(userPublicId);
  const cart = await cartRepository.findCartWithItems(user.id);
  return (cart?.items || []).map(mapCartItem);
};

const clearUserCart = async (userPublicId) => {
  const user = await getUserOrFail(userPublicId);
  await cartRepository.clearCart(user.id);
};

module.exports = {
  addToCart,
  removeFromCart,
  getCartWrapped,
  getCartRaw,
  clearUserCart,
};
