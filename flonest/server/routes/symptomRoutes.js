const express = require('express');
const { check } = require('express-validator');
const {
  createSymptom,
  getSymptoms,
  getSymptomById,
  updateSymptom,
  deleteSymptom
} = require('../controllers/symptomController');
const Symptom = require('../models/Symptom');
const { protect, authorizeResource } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// Apply authentication check to all symptom routes
router.use(protect);

router.route('/')
  .get(getSymptoms)
  .post(
    [
      check('date', 'Date must be a valid ISO8601 date string').optional().isISO8601(),
      check('cramps', 'Cramps field must be a boolean').optional().isBoolean(),
      check('headache', 'Headache field must be a boolean').optional().isBoolean(),
      check('fatigue', 'Fatigue field must be a boolean').optional().isBoolean(),
      check('moodSwings', 'Mood swings field must be a boolean').optional().isBoolean(),
      check('acne', 'Acne field must be a boolean').optional().isBoolean(),
      check('bloating', 'Bloating field must be a boolean').optional().isBoolean(),
      check('backPain', 'Back pain field must be a boolean').optional().isBoolean(),
      check('nausea', 'Nausea field must be a boolean').optional().isBoolean(),
      check('flow', 'Flow level must be: none, light, medium, heavy').optional().isIn(['none', 'light', 'medium', 'heavy']),
      check('painLevel', 'Pain scale index must be a number between 0 and 10').optional().isInt({ min: 0, max: 10 }),
      check('notes', 'Notes must be a string value').optional().isString()
    ],
    validateRequest,
    createSymptom
  );

router.route('/:id')
  .get(authorizeResource(Symptom), getSymptomById)
  .put(
    [
      authorizeResource(Symptom),
      check('date', 'Date must be a valid ISO8601 date string').optional().isISO8601(),
      check('cramps', 'Cramps field must be a boolean').optional().isBoolean(),
      check('headache', 'Headache field must be a boolean').optional().isBoolean(),
      check('fatigue', 'Fatigue field must be a boolean').optional().isBoolean(),
      check('moodSwings', 'Mood swings field must be a boolean').optional().isBoolean(),
      check('acne', 'Acne field must be a boolean').optional().isBoolean(),
      check('bloating', 'Bloating field must be a boolean').optional().isBoolean(),
      check('backPain', 'Back pain field must be a boolean').optional().isBoolean(),
      check('nausea', 'Nausea field must be a boolean').optional().isBoolean(),
      check('flow', 'Flow level must be: none, light, medium, heavy').optional().isIn(['none', 'light', 'medium', 'heavy']),
      check('painLevel', 'Pain scale index must be a number between 0 and 10').optional().isInt({ min: 0, max: 10 }),
      check('notes', 'Notes must be a string value').optional().isString()
    ],
    validateRequest,
    updateSymptom
  )
  .delete(authorizeResource(Symptom), deleteSymptom);

module.exports = router;
