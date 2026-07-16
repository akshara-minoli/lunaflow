const express = require('express');
const { check } = require('express-validator');
const {
  createPeriod,
  getPeriods,
  getPeriodById,
  updatePeriod,
  deletePeriod
} = require('../controllers/periodController');
const Period = require('../models/Period');
const { protect, authorizeResource } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// Apply authentication check to all period logs
router.use(protect);

router.route('/')
  .get(getPeriods)
  .post(
    [
      check('startDate', 'Start date is required and must be in ISO8601 format (YYYY-MM-DD)').isISO8601(),
      check('endDate', 'End date must be in ISO8601 format (YYYY-MM-DD)').optional({ nullable: true }).isISO8601(),
      check('notes', 'Notes must be a string').optional().isString()
    ],
    validateRequest,
    createPeriod
  );

router.route('/:id')
  .get(authorizeResource(Period), getPeriodById)
  .put(
    [
      authorizeResource(Period),
      check('startDate', 'Start date must be in ISO8601 format (YYYY-MM-DD)').optional().isISO8601(),
      check('endDate', 'End date must be in ISO8601 format (YYYY-MM-DD)').optional({ nullable: true }).isISO8601(),
      check('notes', 'Notes must be a string').optional().isString()
    ],
    validateRequest,
    updatePeriod
  )
  .delete(authorizeResource(Period), deletePeriod);

module.exports = router;
