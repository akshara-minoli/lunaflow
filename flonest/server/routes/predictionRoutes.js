const express = require('express');
const { getPredictions } = require('../controllers/predictionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getPredictions);

module.exports = router;
