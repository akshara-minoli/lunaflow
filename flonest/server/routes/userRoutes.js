const express = require('express');
const { check } = require('express-validator');
const { getProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// Apply auth protection to all user routes
router.use(protect);

router.route('/profile')
  .get(getProfile)
  .put(
    [
      check('name', 'Name cannot be empty if provided').optional().notEmpty().trim(),
      check('averageCycleLength', 'Average cycle length must be between 15 and 45 days')
        .optional()
        .isInt({ min: 15, max: 45 }),
      check('averagePeriodLength', 'Average period duration must be between 2 and 15 days')
        .optional()
        .isInt({ min: 2, max: 15 }),
      check('profileImage', 'Profile image URL must be a string').optional().isString()
    ],
    validateRequest,
    updateProfile
  );

module.exports = router;
