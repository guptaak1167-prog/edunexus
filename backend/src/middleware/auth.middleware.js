const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Check JWT secret configuration
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured');

      return res.status(500).json({
        message: 'Server authentication is not configured',
      });
    }

    // Read JWT from browser cookie first
    let token = req.cookies?.token;

    // Also support Authorization: Bearer <token>
    if (!token) {
      const authHeader = req.headers.authorization;

      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        message: 'Authentication required',
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.admin = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token',
    });
  }
};

module.exports = authMiddleware;
