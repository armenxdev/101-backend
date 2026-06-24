const userService = require('../services/userService');
const cartService = require('../services/cartService');

exports.getCart = async (req, res) => {
  const cart = await cartService.getCartRaw(req.userId);
  res.json(cart);
};

exports.getPayments = async (req, res) => {
  const payments = await userService.getPayments(req.userId);
  res.json(payments);
};

exports.checkId = async (req, res) => {
  const result = await userService.checkAdmin(req.userId, req.userRole);
  if (result) {
    return res.json(result);
  }
  return res.status(204).send();
};

exports.saveUserOrder = async (req, res) => {
  const result = await userService.saveUserOrder(req.userId, req.body.printfulOrder);
  res.json(result);
};

exports.getUserOrders = async (req, res) => {
  const orders = await userService.getUserOrders(req.userId);
  res.json(orders);
};
