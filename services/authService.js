const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const { getRedis } = require('../config/redis');
const AppError = require('../utils/AppError');
const { hashOtp, generateOtp } = require('../utils/cryptoUtils');
const sendEmail = require('../utils/sendEmail');
const { setAuthCookies, clearAuthCookies, setAccessTokenCookie } = require('../utils/cookieUtils');
const { mapUserAuth, mapUserProfile } = require('../utils/responseMappers');

const OTP_TTL = 600;
const REGISTER_OTP_PREFIX = 'otp:register:';
const RESET_OTP_PREFIX = 'otp:reset:';
const SESSION_PREFIX = 'session:';

const signAccessToken = (user) =>
  jwt.sign({ id: user.publicId, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30m' });

const signRefreshToken = (user) =>
  jwt.sign({ id: user.publicId, role: user.role }, process.env.REFRESH_SECRET, { expiresIn: '30d' });

const cacheSession = async (user) => {
  const redis = getRedis();
  if (!redis) return;
  await redis.setex(
    `${SESSION_PREFIX}${user.publicId}`,
    1800,
    JSON.stringify({ id: user.publicId, username: user.username, email: user.email, role: user.role })
  );
};

const storeRegisterOtp = async (email, payload) => {
  const redis = getRedis();
  if (redis) {
    await redis.setex(`${REGISTER_OTP_PREFIX}${email}`, OTP_TTL, JSON.stringify(payload));
    return;
  }
  await userRepository.upsertTempUser(email, {
    username: payload.username,
    password: payload.password,
    verificationCode: payload.hashedCode,
    codeExpire: new Date(Date.now() + OTP_TTL * 1000),
  });
};

const getRegisterOtp = async (email) => {
  const redis = getRedis();
  if (redis) {
    const data = await redis.get(`${REGISTER_OTP_PREFIX}${email}`);
    return data ? JSON.parse(data) : null;
  }
  const tempUser = await userRepository.findTempUserByEmailAndCode(email, null);
  return tempUser;
};

const verifyRegisterOtp = async (email, code) => {
  const hashedCode = hashOtp(code);
  const redis = getRedis();

  if (redis) {
    const data = await redis.get(`${REGISTER_OTP_PREFIX}${email}`);
    if (!data) throw new AppError('Invalid or expired code', 400);
    const payload = JSON.parse(data);
    if (payload.hashedCode !== hashedCode) throw new AppError('Invalid or expired code', 400);
    await redis.del(`${REGISTER_OTP_PREFIX}${email}`);
    return payload;
  }

  const tempUser = await userRepository.findTempUserByEmailAndCode(email, hashedCode);
  if (!tempUser || tempUser.codeExpire < new Date()) {
    throw new AppError('Invalid or expired code', 400);
  }
  await userRepository.deleteTempUserByEmail(email);
  return {
    username: tempUser.username,
    email: tempUser.email,
    password: tempUser.password,
  };
};

const storeResetOtp = async (email, hashedCode) => {
  const redis = getRedis();
  if (redis) {
    await redis.setex(`${RESET_OTP_PREFIX}${email}`, OTP_TTL, hashedCode);
    return;
  }
};

const getResetOtp = async (email) => {
  const redis = getRedis();
  if (redis) {
    return redis.get(`${RESET_OTP_PREFIX}${email}`);
  }
  return null;
};

const deleteResetOtp = async (email) => {
  const redis = getRedis();
  if (redis) {
    await redis.del(`${RESET_OTP_PREFIX}${email}`);
  }
};

const register = async ({ username, email, password }) => {
  let resolvedUsername = username;
  if (!resolvedUsername || resolvedUsername.trim() === '') {
    resolvedUsername = email.split('@')[0];
  }

  const userExists = await userRepository.findByEmail(email);
  if (userExists) throw new AppError('User already exists', 400);

  const usernameTaken = await userRepository.findByUsername(resolvedUsername);
  if (usernameTaken) throw new AppError('Username already taken', 400);

  const hashedPassword = await bcrypt.hash(password, 12);
  const rawCode = generateOtp();
  const hashedCode = hashOtp(rawCode);

  await storeRegisterOtp(email, {
    username: resolvedUsername,
    password: hashedPassword,
    hashedCode,
  });

  await sendEmail({
    to: email,
    subject: 'Verify your email',
    text: `Your verification code\` <br/> <strong style='padding:7px 15px;border:1px solid white;border-radius:5px;background-color:black;color:white;font-weight:500;font-size:25px;'>${rawCode}</strong> <br/> (valid 10 minutes)`,
  });

  return { message: 'Verification code sent', email };
};

const login = async ({ identifier, password }, res) => {
  const user = await userRepository.findByIdentifier(identifier);
  if (!user) throw new AppError('User not found', 400);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError('Incorrect password', 400);

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  await userRepository.createRefreshToken({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  setAuthCookies(res, accessToken, refreshToken);
  await cacheSession(user);

  return { user: mapUserAuth(user) };
};

const verifyEmail = async ({ email, code }, res) => {
  const payload = await verifyRegisterOtp(email, code);

  const user = await userRepository.createUser({
    username: payload.username,
    email: email,
    password: payload.password,
    emailVerified: true,
  });

  const accessToken = signAccessToken(user);
  setAccessTokenCookie(res, accessToken);
  await cacheSession(user);

  return {
    message: 'Email verified successfully',
    user: mapUserAuth(user),
  };
};

const forgotPassword = async ({ email }) => {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new AppError('User with this email not found', 404);

  const resetCode = generateOtp();
  const hashedCode = hashOtp(resetCode);

  await userRepository.updateUser(user, {
    resetPasswordToken: hashedCode,
    resetPasswordExpire: new Date(Date.now() + 10 * 60 * 1000),
  });
  await storeResetOtp(email, hashedCode);

  await sendEmail({
    to: user.email,
    subject: 'Password Reset Code',
    text: `Your code\` <br/> <strong style='padding:7px 15px;border:1px solid white;border-radius:5px;background-color:black;color:white;font-weight:500;font-size:25px;'>${resetCode}</strong><br/> (valid for 10 minutes).`,
  });

  return { message: 'Reset code has been sent to your email' };
};

const resetPassword = async ({ code, password }) => {
  const hashedCode = hashOtp(code);
  const { User } = require('../models');
  const { Op } = require('sequelize');

  const user = await User.findOne({
    where: {
      resetPasswordToken: hashedCode,
      resetPasswordExpire: { [Op.gt]: new Date() },
    },
  });

  if (!user) throw new AppError('Invalid or expired code', 400);

  const hashedPassword = await bcrypt.hash(password, 12);
  await userRepository.updateUser(user, {
    password: hashedPassword,
    resetPasswordToken: null,
    resetPasswordExpire: null,
  });
  await deleteResetOtp(user.email);

  return { message: 'Password has been successfully changed' };
};

const refresh = async (refreshToken, res) => {
  if (!refreshToken) {
    return { guest: true };
  }

  const savedToken = await userRepository.findRefreshToken(refreshToken);
  if (!savedToken) throw new AppError('Invalid refresh token', 401);

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await userRepository.findByPublicId(decoded.id);
    if (!user) throw new AppError('Invalid refresh token', 401);

    const newAccessToken = signAccessToken(user);
    setAccessTokenCookie(res, newAccessToken);
    await cacheSession(user);

    return { accessToken: newAccessToken, guest: false };
  } catch {
    await userRepository.deleteRefreshToken(refreshToken);
    throw new AppError('Invalid refresh token', 401);
  }
};

const logout = async (refreshToken, res) => {
  if (refreshToken) {
    await userRepository.deleteRefreshToken(refreshToken);
  }
  clearAuthCookies(res);
  return { message: 'Logged out successfully' };
};

const getProfile = async (publicId) => {
  const user = await userRepository.findByPublicId(publicId);
  if (!user) throw new AppError('User not found', 404);
  return { user: mapUserProfile(user) };
};

const deleteAccount = async (publicId) => {
  const user = await userRepository.findByPublicId(publicId);
  if (!user) throw new AppError('User not found', 404);
  await userRepository.deleteByPublicId(publicId);
  return { message: 'User deleted successfully' };
};

module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refresh,
  logout,
  getProfile,
  deleteAccount,
};
