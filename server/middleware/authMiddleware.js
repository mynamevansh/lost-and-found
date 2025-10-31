const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTime) {
        return res.status(401).json({ 
          success: false,
          message: 'Token expired, please login again' 
        });
      }
      
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ 
          success: false,
          message: 'User not found, token invalid' 
        });
      }
      
      next();
    } catch (error) {
      console.error('🔒 Auth Error:', error.message);
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized, token failed' 
      });
    }
  } else {
    return res.status(401).json({ 
      success: false,
      message: 'Not authorized, no token provided' 
    });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      success: false,
      message: 'Access denied. Admin only.' 
    });
  }
};

const checkOwnerOrAdmin = (req, res, next, itemUserId) => {
  if (
    req.user._id.toString() === itemUserId.toString() || 
    req.user.role === 'admin' ||
    req.user.email === 'vanshranawat48@gmail.com'
  ) {
    next();
  } else {
    res.status(403).json({ 
      success: false,
      message: 'Not authorized to perform this action' 
    });
  }
};

module.exports = { protect, adminOnly, checkOwnerOrAdmin };
