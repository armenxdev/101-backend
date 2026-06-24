const { Op } = require('sequelize');
const {
  Product,
  ProductImage,
  ProductColor,
  Favorite,
} = require('../models');

const productIncludes = [
  { model: ProductImage, as: 'images' },
  { model: ProductColor, as: 'colors' },
];

const findAll = () =>
  Product.findAll({ include: productIncludes, order: [['createdAt', 'DESC']] });

const findByExternalId = (externalId) =>
  Product.findOne({ where: { externalId }, include: productIncludes });

const findByPublicId = (publicId) =>
  Product.findOne({ where: { publicId }, include: productIncludes });

const findById = (id) =>
  Product.findByPk(id, { include: productIncludes });

const create = (data, transaction) =>
  Product.create(data, { transaction });

const destroy = (product) => product.destroy();

const externalIdExists = async (externalId) => {
  const count = await Product.count({ where: { externalId } });
  return count > 0;
};

const createImages = (images, transaction) =>
  ProductImage.bulkCreate(images, { transaction });

const createColors = (colors, transaction) =>
  ProductColor.bulkCreate(colors, { transaction });

const deleteImagesByProductId = (productId, transaction) =>
  ProductImage.destroy({ where: { productId }, transaction });

const getFavoriteProducts = async (userId) => {
  const favorites = await Favorite.findAll({
    where: { userId },
    include: [{ model: Product, as: 'product' }],
  });
  return favorites.map((f) => f.product).filter(Boolean);
};

const addFavorite = (userId, productId) =>
  Favorite.findOrCreate({ where: { userId, productId } });

const removeFavorite = (userId, productId) =>
  Favorite.destroy({ where: { userId, productId } });

const findFavoriteProduct = async (userId, productIdentifier) => {
  const product = await Product.findOne({
    where: {
      [Op.or]: [
        { publicId: productIdentifier },
        { externalId: productIdentifier },
      ],
    },
  });
  if (!product) return null;
  const favorite = await Favorite.findOne({ where: { userId, productId: product.id } });
  return { product, favorite };
};

module.exports = {
  findAll,
  findByExternalId,
  findByPublicId,
  findById,
  create,
  destroy,
  externalIdExists,
  createImages,
  createColors,
  deleteImagesByProductId,
  getFavoriteProducts,
  addFavorite,
  removeFavorite,
  findFavoriteProduct,
  productIncludes,
};
