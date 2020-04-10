const jwt = require('jsonwebtoken');

const jwtConfig = require('../config/jwt');

const authenticate = (req, res, next) => {
  const token = req.header('token');

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const user = jwt.verify(token, jwtConfig.secret);
    req.user = user;

    return next();
  } catch (err) {
    return res.status(400).json({ error: 'Invalid token' });
  }
};

module.exports = authenticate;
