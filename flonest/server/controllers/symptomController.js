const Symptom = require('../models/Symptom');

// Helper to format consistent success response
const sendSuccessResponse = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

// @desc    Log a new daily symptom entry
// @route   POST /api/symptoms
// @access  Private
exports.createSymptom = async (req, res, next) => {
  try {
    const {
      date,
      cramps,
      headache,
      fatigue,
      moodSwings,
      acne,
      bloating,
      backPain,
      nausea,
      flow,
      painLevel,
      notes
    } = req.body;

    const logDate = date ? new Date(date) : new Date();

    // Check if symptoms log already exists for this exact day (resets hours for comparisons)
    const queryDateStart = new Date(logDate);
    queryDateStart.setHours(0, 0, 0, 0);
    const queryDateEnd = new Date(logDate);
    queryDateEnd.setHours(23, 59, 59, 999);

    const existingLog = await Symptom.findOne({
      user: req.user.id,
      date: { $gte: queryDateStart, $lte: queryDateEnd }
    });

    if (existingLog) {
      return res.status(400).json({
        success: false,
        message: 'A symptoms entry already exists for this date',
        errors: ['There is already a symptoms log recorded on this day. Please update the existing log instead.']
      });
    }

    const symptom = await Symptom.create({
      user: req.user.id,
      date: logDate,
      cramps: cramps || false,
      headache: headache || false,
      fatigue: fatigue || false,
      moodSwings: moodSwings || false,
      acne: acne || false,
      bloating: bloating || false,
      backPain: backPain || false,
      nausea: nausea || false,
      flow: flow || 'none',
      painLevel: painLevel || 0,
      notes: notes || ''
    });

    return sendSuccessResponse(res, 201, 'Symptom logged successfully', { symptom });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all daily symptom logs for user
// @route   GET /api/symptoms
// @access  Private
exports.getSymptoms = async (req, res, next) => {
  try {
    const symptoms = await Symptom.find({ user: req.user.id }).sort({ date: -1 });
    return sendSuccessResponse(res, 200, 'Symptoms logs retrieved successfully', {
      count: symptoms.length,
      symptoms
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single daily symptom log by ID
// @route   GET /api/symptoms/:id
// @access  Private (Ownership handled by authorizeResource)
exports.getSymptomById = async (req, res, next) => {
  try {
    // req.resource is attached by authorizeResource middleware
    return sendSuccessResponse(res, 200, 'Symptom log retrieved successfully', {
      symptom: req.resource
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a daily symptom entry
// @route   PUT /api/symptoms/:id
// @access  Private (Ownership handled by authorizeResource)
exports.updateSymptom = async (req, res, next) => {
  try {
    const {
      date,
      cramps,
      headache,
      fatigue,
      moodSwings,
      acne,
      bloating,
      backPain,
      nausea,
      flow,
      painLevel,
      notes
    } = req.body;

    const symptom = req.resource; // From authorizeResource middleware

    if (date) symptom.date = new Date(date);
    if (cramps !== undefined) symptom.cramps = cramps;
    if (headache !== undefined) symptom.headache = headache;
    if (fatigue !== undefined) symptom.fatigue = fatigue;
    if (moodSwings !== undefined) symptom.moodSwings = moodSwings;
    if (acne !== undefined) symptom.acne = acne;
    if (bloating !== undefined) symptom.bloating = bloating;
    if (backPain !== undefined) symptom.backPain = backPain;
    if (nausea !== undefined) symptom.nausea = nausea;
    if (flow !== undefined) symptom.flow = flow;
    if (painLevel !== undefined) symptom.painLevel = painLevel;
    if (notes !== undefined) symptom.notes = notes;

    await symptom.save();

    return sendSuccessResponse(res, 200, 'Symptom log updated successfully', { symptom });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a daily symptom entry
// @route   DELETE /api/symptoms/:id
// @access  Private (Ownership handled by authorizeResource)
exports.deleteSymptom = async (req, res, next) => {
  try {
    const symptom = req.resource; // From authorizeResource middleware
    await symptom.deleteOne();
    return sendSuccessResponse(res, 200, 'Symptom log removed successfully');
  } catch (error) {
    next(error);
  }
};
