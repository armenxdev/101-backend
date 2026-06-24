const productService = require('../services/productService');
const cartService = require('../services/cartService');

exports.addProduct = async (req, res) => {
  const product = await productService.createProduct(req.body, req.files);
  res.status(201).json(product);
};

exports.getProducts = async (req, res) => {
  const products = await productService.getProducts();
  res.json(products);
};

exports.deleteProduct = async (req, res) => {
  const result = await productService.deleteProduct(req.params.id);
  res.json(result);
};

exports.addToFavorites = async (req, res) => {
  const result = await productService.addFavorite(req.userId, req.body.productId);
  res.json(result);
};

exports.removeFromFavorites = async (req, res) => {
  const result = await productService.removeFavorite(req.userId, req.body.productId);
  res.json(result);
};

exports.addToCart = async (req, res) => {
  const result = await cartService.addToCart(req.userId, req.body);
  res.json(result);
};

exports.removeFromCart = async (req, res) => {
  const result = await cartService.removeFromCart(req.userId, req.body);
  res.json(result);
};

exports.getCart = async (req, res) => {
  const cart = await cartService.getCartRaw(req.userId);
  res.status(200).json(cart);
};

exports.getBrandProducts = async (req, res) => {
  const products = await productService.getBrandProducts();
  res.json(products);
};
