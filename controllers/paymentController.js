const paymentService = require('../services/paymentService');
const AppError = require('../utils/AppError');

exports.verifyPayment = async (req, res) => {
  try {
    const result = await paymentService.verifyPayment(req.body.orderID);
    res.json(result);
  } catch (err) {
    if (err instanceof AppError && err.statusCode === 400) {
      return res.status(400).json({
        success: false,
        message: err.message,
        order: err.order || null,
      });
    }
    res.status(500).json({ error: 'Error Payment' });
  }
};
