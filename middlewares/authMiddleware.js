const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const auth = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: 'No token, access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role || 'user';
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.userRole || !roles.includes(req.userRole)) {
    return next(new AppError('Forbidden', 403, 'FORBIDDEN'));
  }
  next();
};

module.exports = auth;
module.exports.authorize = authorize;
