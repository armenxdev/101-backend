const brandProductRepository = require('../repositories/brandProductRepository');
const paymentRepository = require('../repositories/paymentRepository');
const cartService = require('./cartService');
const AppError = require('../utils/AppError');
const { mapPayment, mapUserOrder } = require('../utils/responseMappers');

const getPayments = async (userPublicId) => {
  const payments = await paymentRepository.findByUserPublicId(userPublicId);
  return payments.map(mapPayment);
};

const checkAdmin = async (userPublicId, userRole) => {
  if (userRole === 'admin') {
    return { userId: userPublicId };
  }
  return null;
};

const saveUserOrder = async (userPublicId, printfulOrder) => {
  const user = await brandProductRepository.findUserByPublicId(userPublicId);
  if (!user) throw new AppError('User not found', 404);

  await brandProductRepository.createUserOrder({
    userId: user.id,
    printfulOrder,
  });

  await cartService.clearUserCart(userPublicId);

  return { message: 'Order added successfully', printfulOrder };
};

const getUserOrders = async (userPublicId) => {
  const user = await brandProductRepository.findUserByPublicId(userPublicId);
  if (!user) throw new AppError('User not found', 404);

  const orders = await brandProductRepository.findUserOrders(userPublicId);
  return orders.map(mapUserOrder);
};

module.exports = {
  getPayments,
  checkAdmin,
  saveUserOrder,
  getUserOrders,
};
