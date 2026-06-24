const crypto = require('crypto');

const hashOtp = (code) =>
  crypto.createHash('sha256').update(String(code)).digest('hex');

const hashToken = (token) =>
  crypto.createHash('sha256').update(String(token)).digest('hex');

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

module.exports = {
  hashOtp,
  hashToken,
  generateOtp,
};
