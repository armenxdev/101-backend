const toNumber = (val) => (val != null ? parseFloat(val) : val);

const mapProduct = (product) => {
  const data = product.toJSON ? product.toJSON() : product;
  const images = (data.images || []).sort((a, b) => a.sortOrder - b.sortOrder);
  const colors = (data.colors || []).map((c) => c.color || c);

  return {
    _id: data.publicId,
    externalId: data.externalId,
    external_id: data.external_id,
    is_ignored: data.is_ignored,
    name: data.name,
    synced: data.synced,
    thumbnail_url: data.thumbnail_url,
    variants: data.variants,
    title: data.title,
    price: toNumber(data.price),
    image: images.map((img) => img.url),
    colors,
    category: data.category,
    isNewProducts: data.isNewProducts,
    isPopular: data.isPopular,
    visible: data.visible,
    order: data.sortOrder,
    description: data.description,
    printfulData: data.printfulData,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

const mapBrandProduct = (product) => {
  const data = product.toJSON ? product.toJSON() : product;
  const images = (data.images || []).sort((a, b) => a.sortOrder - b.sortOrder);
  const colors = (data.colors || []).map((c) => c.color || c);

  return {
    _id: data.publicId,
    title: data.title,
    price: toNumber(data.price),
    image: images.map((img) => img.url),
    colors,
    category: data.category,
    isNewProducts: data.isNewProducts,
    isPopular: data.isPopular,
    visible: data.visible,
    order: data.sortOrder,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

const mapCartItem = (item) => {
  const data = item.toJSON ? item.toJSON() : item;
  const images = (data.images || []).sort((a, b) => a.sortOrder - b.sortOrder);

  return {
    _id: data.publicId,
    productId: data.productExternalId,
    size: data.size,
    quantity: data.quantity,
    title: data.title,
    price: toNumber(data.price),
    image: images.map((img) => img.url),
  };
};

const mapUserProfile = (user) => {
  const data = user.toJSON ? user.toJSON() : user;
  return {
    _id: data.publicId,
    email: data.email,
    username: data.username,
    emailVerified: data.emailVerified,
    role: data.role,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

const mapUserAuth = (user) => ({
  id: user.publicId,
  username: user.username,
  email: user.email,
});

const mapReview = (review) => {
  const data = review.toJSON ? review.toJSON() : review;
  return {
    _id: data.publicId,
    productId: data.productExternalId,
    userId: data.userPublicId || null,
    guestId: data.guestId || null,
    username: data.username,
    rating: data.rating,
    message: data.message,
    date: data.reviewDate,
    createdAt: data.createdAt,
  };
};

const mapOrder = (order) => {
  const data = order.toJSON ? order.toJSON() : order;
  const items = (data.items || []).map((item) => {
    const images = (item.images || []).sort((a, b) => a.sortOrder - b.sortOrder);
    return {
      productId: item.productExternalId,
      quantity: item.quantity,
      size: item.size,
      title: item.title,
      price: toNumber(item.price),
      image: images.map((img) => img.url),
    };
  });

  return {
    _id: data.publicId,
    userId: data.user?.publicId || null,
    items,
    totalPrice: toNumber(data.totalPrice),
    status: data.status,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

const mapPayment = (payment) => {
  const data = payment.toJSON ? payment.toJSON() : payment;
  return {
    _id: data.publicId,
    user: data.user?.publicId || data.userId || null,
    orderID: data.orderID,
    amount: toNumber(data.amount),
    currency: data.currency,
    status: data.status,
    createdAt: data.createdAt,
    details: data.details,
  };
};

const mapUserOrder = (userOrder) => {
  const data = userOrder.toJSON ? userOrder.toJSON() : userOrder;
  return {
    printfulOrder: data.printfulOrder,
  };
};

const mapFavorites = (products) =>
  products.map((p) => p.publicId || p);

module.exports = {
  mapProduct,
  mapBrandProduct,
  mapCartItem,
  mapUserProfile,
  mapUserAuth,
  mapReview,
  mapOrder,
  mapPayment,
  mapUserOrder,
  mapFavorites,
};
