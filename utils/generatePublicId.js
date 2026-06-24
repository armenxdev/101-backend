const crypto = require('crypto');

const generatePublicId = () => crypto.randomBytes(12).toString('hex');

module.exports = generatePublicId;
