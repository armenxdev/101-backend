const paymentService = require('../services/paymentService');
const AppError = require('../utils/AppError');

const verifyPayment = async (orderID) => {
  const { verifyOrder } = require('../utils/paypal');
  const order = await verifyOrder(orderID);

  if (order.status !== 'COMPLETED') {
    const err = new AppError('Order not completed', 400);
    err.order = order;
    throw err;
  }

  const paymentRepository = require('../repositories/paymentRepository');
  const { mapPayment } = require('../utils/responseMappers');

  const existingPayment = await paymentRepository.findByOrderID(orderID);
  if (existingPayment) {
    return {
      success: true,
      message: 'Payment already recorded',
      payment: mapPayment(existingPayment),
    };
  }

  const payment = await paymentRepository.create({
    orderID,
    amount: parseFloat(order.purchase_units[0].amount.value),
    currency: order.purchase_units[0].amount.currency_code,
    status: order.status,
    details: order,
  });

  return { success: true, payment: mapPayment(payment) };
};

module.exports = {
  verifyPayment,
};
