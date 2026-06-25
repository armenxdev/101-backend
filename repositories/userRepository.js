const { User, RefreshToken, TempUser } = require('../models');

const findByPublicId = (publicId) =>
  User.findOne({ where: { publicId } });

const findByEmail = (email) =>
  User.findOne({ where: { email } });

const findByUsername = (username) =>
  User.findOne({ where: { username } });

const findByIdentifier = async (identifier) => {
  try {
    return await User.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { email: identifier },
          { username: identifier },
        ],
      },
    });
  } catch (error) {
    console.log("=============== MYSQL ERROR ===============");
    console.error(error.original ? error.original.message : error.message);
    console.log("===========================================");
    throw error;
  }
};

const createUser = (data) => User.create(data);

const updateUser = (user, data) => user.update(data);

const deleteByPublicId = (publicId) =>
  User.destroy({ where: { publicId } });

const deleteByEmail = (email) =>
  User.destroy({ where: { email } });

const createRefreshToken = (data) => RefreshToken.create(data);

const findRefreshToken = (token) =>
  RefreshToken.findOne({ where: { token } });

const deleteRefreshToken = (token) =>
  RefreshToken.destroy({ where: { token } });

const deleteRefreshTokensByUserId = (userId) =>
  RefreshToken.destroy({ where: { userId } });

const upsertTempUser = async (email, data) => {
  const existing = await TempUser.findOne({ where: { email } });
  if (existing) {
    return existing.update(data);
  }
  return TempUser.create({ email, ...data });
};

const findTempUserByEmailAndCode = (email, verificationCode) =>
  TempUser.findOne({ where: { email, verificationCode } });

const deleteTempUserByEmail = (email) =>
  TempUser.destroy({ where: { email } });

module.exports = {
  findByPublicId,
  findByEmail,
  findByUsername,
  findByIdentifier,
  createUser,
  updateUser,
  deleteByPublicId,
  deleteByEmail,
  createRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
  deleteRefreshTokensByUserId,
  upsertTempUser,
  findTempUserByEmailAndCode,
  deleteTempUserByEmail,
};
