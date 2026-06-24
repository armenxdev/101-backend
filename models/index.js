const User = require('./User');
const Product = require('./Product');
const ProductImage = require('./ProductImage');
const ProductColor = require('./ProductColor');
const BrandProduct = require('./BrandProduct');
const BrandProductImage = require('./BrandProductImage');
const BrandProductColor = require('./BrandProductColor');
const Favorite = require('./Favorite');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const CartItemImage = require('./CartItemImage');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const OrderItemImage = require('./OrderItemImage');
const Payment = require('./Payment');
const Review = require('./Review');
const RefreshToken = require('./RefreshToken');
const TempUser = require('./TempUser');
const UserOrder = require('./UserOrder');
const generatePublicId = require('../utils/generatePublicId');

const modelsWithPublicId = [User, Product, BrandProduct, CartItem, Order, Payment, Review, UserOrder];
modelsWithPublicId.forEach((Model) => {
  Model.beforeValidate((instance) => {
    if (!instance.publicId) {
      instance.publicId = generatePublicId();
    }
  });
});

// User associations
User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens', onDelete: 'CASCADE' });
RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasOne(Cart, { foreignKey: 'userId', as: 'cart', onDelete: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.belongsToMany(Product, { through: Favorite, foreignKey: 'userId', otherKey: 'productId', as: 'favoriteProducts' });
Product.belongsToMany(User, { through: Favorite, foreignKey: 'productId', otherKey: 'userId', as: 'favoritedBy' });
Favorite.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Favorite.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

User.hasMany(Order, { foreignKey: 'userId', as: 'orders', onDelete: 'SET NULL' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Payment, { foreignKey: 'userId', as: 'payments', onDelete: 'SET NULL' });
Payment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Review, { foreignKey: 'userId', as: 'reviews', onDelete: 'SET NULL' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(UserOrder, { foreignKey: 'userId', as: 'printfulOrders', onDelete: 'CASCADE' });
UserOrder.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Product associations
Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images', onDelete: 'CASCADE' });
ProductImage.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Product.hasMany(ProductColor, { foreignKey: 'productId', as: 'colors', onDelete: 'CASCADE' });
ProductColor.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Product.hasMany(Review, { foreignKey: 'productId', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Product.hasMany(CartItem, { foreignKey: 'productId', as: 'cartItems' });
CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Brand product associations
BrandProduct.hasMany(BrandProductImage, { foreignKey: 'brandProductId', as: 'images', onDelete: 'CASCADE' });
BrandProductImage.belongsTo(BrandProduct, { foreignKey: 'brandProductId', as: 'brandProduct' });

BrandProduct.hasMany(BrandProductColor, { foreignKey: 'brandProductId', as: 'colors', onDelete: 'CASCADE' });
BrandProductColor.belongsTo(BrandProduct, { foreignKey: 'brandProductId', as: 'brandProduct' });

// Cart associations
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });

CartItem.hasMany(CartItemImage, { foreignKey: 'cartItemId', as: 'images', onDelete: 'CASCADE' });
CartItemImage.belongsTo(CartItem, { foreignKey: 'cartItemId', as: 'cartItem' });

// Order associations
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

OrderItem.hasMany(OrderItemImage, { foreignKey: 'orderItemId', as: 'images', onDelete: 'CASCADE' });
OrderItemImage.belongsTo(OrderItem, { foreignKey: 'orderItemId', as: 'orderItem' });

module.exports = {
  User,
  Product,
  ProductImage,
  ProductColor,
  BrandProduct,
  BrandProductImage,
  BrandProductColor,
  Favorite,
  Cart,
  CartItem,
  CartItemImage,
  Order,
  OrderItem,
  OrderItemImage,
  Payment,
  Review,
  RefreshToken,
  TempUser,
  UserOrder,
};
