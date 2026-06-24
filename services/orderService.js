const { sequelize } = require('../config/database');
const orderRepository = require('../repositories/orderRepository');
const productRepository = require('../repositories/productRepository');
const AppError = require('../utils/AppError');
const { mapOrder } = require('../utils/responseMappers');

const parseImages = (image) => {
  if (!image) return [];
  if (Array.isArray(image)) return image;
  return [image];
};

const createOrder = async ({ items, userId }) => {
  if (!items || items.length === 0) {
    throw new AppError('Cart is empty', 400);
  }

  let totalPrice = 0;
  const populatedItems = [];

  for (const item of items) {
    const product = await productRepository.findByExternalId(item.productId);
    if (!product) {
      throw new AppError(`Product not found in DB for externalId ${item.productId}`, 500);
    }
    totalPrice += item.price * item.quantity;
    populatedItems.push({
      productId: product.id,
      productExternalId: item.productId,
      quantity: item.quantity,
      size: item.size,
      title: item.title,
      price: item.price,
      images: parseImages(item.image),
    });
  }

  let dbUserId = null;
  if (userId) {
    const user = await orderRepository.findUserByPublicId(userId);
    dbUserId = user?.id || null;
  }

  const transaction = await sequelize.transaction();

  try {
    const order = await orderRepository.create({
      userId: dbUserId,
      totalPrice,
      status: 'pending',
    }, transaction);

    const createdItems = await orderRepository.createItems(
      populatedItems.map(({ images, ...rest }) => ({ ...rest, orderId: order.id })),
      transaction
    );

    const allImages = [];
    createdItems.forEach((createdItem, index) => {
      populatedItems[index].images.forEach((url, i) => {
        allImages.push({ orderItemId: createdItem.id, url, sortOrder: i });
      });
    });

    if (allImages.length > 0) {
      await orderRepository.createItemImages(allImages, transaction);
    }

    await transaction.commit();
    return { success: true, orderId: order.publicId };
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

const getOrderById = async (publicId) => {
  const order = await orderRepository.findByPublicId(publicId);
  if (!order) throw new AppError('Order not found', 404);
  return mapOrder(order);
};

module.exports = {
  createOrder,
  getOrderById,
};
