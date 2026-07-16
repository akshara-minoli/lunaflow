const { validationResult } = require('express-validator');

/**
 * Catches express-validator rules violations and formats responses
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorList = errors.array().map(err => err.msg);
    return res.status(400).json({
      success: false,
      message: 'Validation failed: Invalid inputs',
      errors: errorList
    });
  }
  
  next();
};

module.exports = validateRequest;
