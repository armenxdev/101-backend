const orderService = require('../services/orderService');
const AppError = require('../utils/AppError');

exports.createOrder = async (req, res) => {
  try {
    const result = await orderService.createOrder(req.body);
    res.json(result);
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        message: 'Error creating order',
        error: err.message,
      });
    }
    res.status(500).json({ message: 'Error creating order', error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    res.json(order);
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        message: 'Error fetching order',
        error: err.message,
      });
    }
    res.status(500).json({ message: 'Error fetching order', error: err.message });
  }
};
