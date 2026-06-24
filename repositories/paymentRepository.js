const { Payment, User } = require('../models');

const findByOrderID = (orderID) =>
  Payment.findOne({ where: { orderID } });

const create = (data) => Payment.create(data);

const findByUserPublicId = async (userPublicId) => {
  const user = await User.findOne({ where: { publicId: userPublicId } });
  if (!user) return [];
  return Payment.findAll({
    where: { userId: user.id },
    order: [['createdAt', 'DESC']],
  });
};

module.exports = {
  findByOrderID,
  create,
  findByUserPublicId,
};
