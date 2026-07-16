const express = require('express');
const { check } = require('express-validator');
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post(
  '/register',
  [
    check('name', 'Name is required').notEmpty().trim(),
    check('email', 'Please provide a valid email').isEmail().normalizeEmail(),
    check('password', 'Password must be at least 8 characters long').isLength({ min: 8 })
  ],
  validateRequest,
  register
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').notEmpty()
  ],
  validateRequest,
  login
);

// Support both GET and POST for logout flexibility
router.route('/logout')
  .get(logout)
  .post(logout);

router.get('/me', protect, getMe);

router.post(
  '/forgot-password',
  [
    check('email', 'Please include a valid email').isEmail()
  ],
  validateRequest,
  forgotPassword
);

router.post(
  '/reset-password/:token',
  [
    check('password', 'Password must be at least 8 characters long').isLength({ min: 8 })
  ],
  validateRequest,
  resetPassword
);

module.exports = router;
