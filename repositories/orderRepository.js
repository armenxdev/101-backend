const {
  Order,
  OrderItem,
  OrderItemImage,
  User,
} = require('../models');

const orderIncludes = [
  {
    model: OrderItem,
    as: 'items',
    include: [{ model: OrderItemImage, as: 'images' }],
  },
  { model: User, as: 'user', attributes: ['publicId'] },
];

const create = (data, transaction) => Order.create(data, { transaction });

const findByPublicId = (publicId) =>
  Order.findOne({ where: { publicId }, include: orderIncludes });

const createItems = (items, transaction) =>
  OrderItem.bulkCreate(items, { transaction, returning: true });

const createItemImages = (images, transaction) =>
  OrderItemImage.bulkCreate(images, { transaction });

const findUserByPublicId = (publicId) =>
  User.findOne({ where: { publicId } });

module.exports = {
  create,
  findByPublicId,
  createItems,
  createItemImages,
  findUserByPublicId,
  orderIncludes,
};
