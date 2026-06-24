const { sequelize } = require('../config/database');
const productRepository = require('../repositories/productRepository');
const cartRepository = require('../repositories/cartRepository');
const { uploadFiles, deleteMany } = require('../utils/cloudinary');
const AppError = require('../utils/AppError');
const { mapProduct, mapBrandProduct, mapFavorites } = require('../utils/responseMappers');
const brandProductRepository = require('../repositories/brandProductRepository');

const parseBool = (val) => {
  if (typeof val === 'boolean') return val;
  if (val === 'true') return true;
  if (val === 'false') return false;
  return val;
};

const parseColors = (colors) => {
  if (!colors) return [];
  if (Array.isArray(colors)) return colors;
  try {
    const parsed = JSON.parse(colors);
    return Array.isArray(parsed) ? parsed : [colors];
  } catch {
    return [colors];
  }
};

const generateUniqueExternalId = async () => {
  let externalId;
  let exists = true;
  while (exists) {
    externalId = Math.floor(1000000 + Math.random() * 9000000).toString();
    exists = await productRepository.externalIdExists(externalId);
  }
  return externalId;
};

const createProduct = async (body, files) => {
  const externalId = await generateUniqueExternalId();
  const colors = parseColors(body.colors);

  const transaction = await sequelize.transaction();
  try {
    const product = await productRepository.create({
      externalId,
      title: body.title,
      price: body.price,
      category: body.category || null,
      isNewProducts: parseBool(body.isNewProducts) ?? false,
      isPopular: parseBool(body.isPopular) ?? false,
      visible: parseBool(body.visible) ?? true,
      description: body.description || null,
    }, transaction);

    if (files && files.length > 0) {
      const uploads = await uploadFiles(files, `products/${externalId}`);
      await productRepository.createImages(
        uploads.map((u, i) => ({
          productId: product.id,
          url: u.url,
          cloudinaryPublicId: u.publicId,
          sortOrder: i,
        })),
        transaction
      );
    }

    if (colors.length > 0) {
      await productRepository.createColors(
        colors.map((color) => ({ productId: product.id, color })),
        transaction
      );
    }

    await transaction.commit();

    const saved = await productRepository.findById(product.id);
    return mapProduct(saved);
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

const getProducts = async () => {
  const products = await productRepository.findAll();
  return products.map(mapProduct);
};

const deleteProduct = async (externalId) => {
  const product = await productRepository.findByExternalId(externalId);
  if (!product) throw new AppError('Product not found', 404);

  const images = product.images || [];
  const cloudinaryAssets = images
    .filter((img) => img.cloudinaryPublicId)
    .map((img) => ({ publicId: img.cloudinaryPublicId, resourceType: 'image' }));

  if (cloudinaryAssets.length > 0) {
    await deleteMany(cloudinaryAssets);
  }

  const transaction = await sequelize.transaction();
  try {
    await cartRepository.removeItemsByExternalId(externalId, transaction);
    await productRepository.destroy(product);
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }

  return { message: 'Product deleted successfully' };
};

const addFavorite = async (userPublicId, productIdentifier) => {
  const user = await cartRepository.findUserByPublicId(userPublicId);
  if (!user) throw new AppError('User not found', 404);

  const product = await productRepository.findByPublicId(productIdentifier)
    || await productRepository.findByExternalId(productIdentifier);
  if (!product) throw new AppError('Product not found', 404);

  await productRepository.addFavorite(user.id, product.id);
  const favorites = await productRepository.getFavoriteProducts(user.id);
  return { favorites: mapFavorites(favorites) };
};

const removeFavorite = async (userPublicId, productIdentifier) => {
  const user = await cartRepository.findUserByPublicId(userPublicId);
  if (!user) throw new AppError('User not found', 404);

  const product = await productRepository.findByPublicId(productIdentifier)
    || await productRepository.findByExternalId(productIdentifier);
  if (!product) throw new AppError('Product not found', 404);

  await productRepository.removeFavorite(user.id, product.id);
  const favorites = await productRepository.getFavoriteProducts(user.id);
  return { favorites: mapFavorites(favorites) };
};

const getBrandProducts = async () => {
  const products = await brandProductRepository.findAllBrandProducts();
  return products.map(mapBrandProduct);
};

module.exports = {
  createProduct,
  getProducts,
  deleteProduct,
  addFavorite,
  removeFavorite,
  getBrandProducts,
};
