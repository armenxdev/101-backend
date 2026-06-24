const authService = require('../services/authService');
const AppError = require('../utils/AppError');

exports.register = async (req, res) => {
  const result = await authService.register(req.body);
  res.json(result);
};

exports.login = async (req, res) => {
  const result = await authService.login(req.body, res);
  res.json(result);
};

exports.verifyEmail = async (req, res) => {
  const result = await authService.verifyEmail(req.body, res);
  res.json(result);
};

exports.forgotPassword = async (req, res) => {
  const result = await authService.forgotPassword(req.body);
  res.json(result);
};

exports.resetPassword = async (req, res) => {
  const result = await authService.resetPassword(req.body);
  res.json(result);
};

exports.refresh = async (req, res) => {
  try {
    const result = await authService.refresh(req.cookies.refreshToken, res);
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof AppError && err.statusCode === 401) {
      return res.status(401).json({ guest: true });
    }
    throw err;
  }
};

exports.logout = async (req, res) => {
  const result = await authService.logout(req.cookies.refreshToken, res);
  res.json(result);
};

exports.getProfile = async (req, res) => {
  const result = await authService.getProfile(req.userId);
  res.json(result);
};

exports.deleteAccount = async (req, res) => {
  const result = await authService.deleteAccount(req.userId);
  res.json(result);
};
