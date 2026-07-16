const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes - Authentication Middleware
 */
const protect = async (req, res, next) => {
  let token;

  // Read token from cookies or authorization header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. No token provided.',
      errors: ['No authorization token found']
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretflonestkey1234!');

    // Find user and attach to request
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Authorization failed.',
        errors: ['User session does not exist']
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Token verification failed.',
      errors: ['Session invalid or expired']
    });
  }
};

/**
 * Prevent users from accessing another user's data - Authorization Middleware
 * @param {Mongoose.Model} model - The database model to check (e.g. Period, Symptom)
 */
const authorizeResource = (model) => async (req, res, next) => {
  try {
    const resource = await model.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
        errors: ['The requested log item was not found']
      });
    }

    // Determine user field (some schemas call it user, others userId)
    const resourceUserId = resource.user 
      ? resource.user.toString() 
      : resource.userId 
      ? resource.userId.toString() 
      : null;

    if (!resourceUserId || resourceUserId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access another user\'s data',
        errors: ['Access denied to this resource']
      });
    }

    // Attach verified resource to request body for controller convenience
    req.resource = resource;
    next();
  } catch (error) {
    next(error); // Passes to error handler middleware
  }
};

module.exports = { protect, authorizeResource };
