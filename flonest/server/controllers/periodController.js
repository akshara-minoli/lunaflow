const Period = require('../models/Period');
const { calculatePeriodDuration, getDaysDifference } = require('../utils/calculateCycle');

// Helper to format consistent success response
const sendSuccessResponse = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

// @desc    Create a period log entry
// @route   POST /api/periods
// @access  Private
exports.createPeriod = async (req, res, next) => {
  try {
    const { startDate, endDate, notes } = req.body;
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;

    // Check for overlap with existing logs
    const existingOverlap = await Period.findOne({
      user: req.user.id,
      startDate: { $lte: start },
      $or: [
        { endDate: { $exists: false } },
        { endDate: null },
        { endDate: { $gte: start } }
      ]
    });

    if (existingOverlap) {
      return res.status(400).json({
        success: false,
        message: 'Overlapping period log detected',
        errors: ['There is already an active or overlapping period logged during this start date.']
      });
    }

    // Calculate duration if endDate exists
    const duration = end ? calculatePeriodDuration(start, end) : 0;

    // Calculate cycleLength: difference in days between this startDate and the previous period startDate
    let cycleLength = 0;
    const previousPeriod = await Period.findOne({
      user: req.user.id,
      startDate: { $lt: start }
    }).sort({ startDate: -1 });

    if (previousPeriod) {
      cycleLength = getDaysDifference(previousPeriod.startDate, start);
    }

    const period = await Period.create({
      user: req.user.id,
      startDate: start,
      endDate: end,
      duration,
      cycleLength,
      notes: notes || ''
    });

    // Also update subsequent period cycleLength if this one was inserted in between
    const nextPeriod = await Period.findOne({
      user: req.user.id,
      startDate: { $gt: start }
    }).sort({ startDate: 1 });

    if (nextPeriod) {
      nextPeriod.cycleLength = getDaysDifference(start, nextPeriod.startDate);
      await nextPeriod.save();
    }

    return sendSuccessResponse(res, 201, 'Period logged successfully', { period });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all period logs
// @route   GET /api/periods
// @access  Private
exports.getPeriods = async (req, res, next) => {
  try {
    const periods = await Period.find({ user: req.user.id }).sort({ startDate: -1 });
    return sendSuccessResponse(res, 200, 'Periods retrieved successfully', {
      count: periods.length,
      periods
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single period log by ID
// @route   GET /api/periods/:id
// @access  Private (Ownership handled by authorizeResource)
exports.getPeriodById = async (req, res, next) => {
  try {
    // req.resource is attached by authorizeResource middleware
    return sendSuccessResponse(res, 200, 'Period retrieved successfully', {
      period: req.resource
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a period log entry
// @route   PUT /api/periods/:id
// @access  Private (Ownership handled by authorizeResource)
exports.updatePeriod = async (req, res, next) => {
  try {
    const { startDate, endDate, notes } = req.body;
    const period = req.resource; // From authorizeResource middleware

    if (startDate) period.startDate = new Date(startDate);
    if (endDate !== undefined) period.endDate = endDate ? new Date(endDate) : null;
    if (notes !== undefined) period.notes = notes;

    // Recalculate duration
    if (period.endDate) {
      period.duration = calculatePeriodDuration(period.startDate, period.endDate);
    } else {
      period.duration = 0;
    }

    // Recalculate cycle length based on previous
    const previousPeriod = await Period.findOne({
      user: req.user.id,
      startDate: { $lt: period.startDate },
      _id: { $ne: period._id }
    }).sort({ startDate: -1 });

    if (previousPeriod) {
      period.cycleLength = getDaysDifference(previousPeriod.startDate, period.startDate);
    } else {
      period.cycleLength = 0;
    }

    await period.save();

    // Recalculate subsequent cycle length if there is a next period
    const nextPeriod = await Period.findOne({
      user: req.user.id,
      startDate: { $gt: period.startDate },
      _id: { $ne: period._id }
    }).sort({ startDate: 1 });

    if (nextPeriod) {
      nextPeriod.cycleLength = getDaysDifference(period.startDate, nextPeriod.startDate);
      await nextPeriod.save();
    }

    return sendSuccessResponse(res, 200, 'Period updated successfully', { period });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a period log
// @route   DELETE /api/periods/:id
// @access  Private (Ownership handled by authorizeResource)
exports.deletePeriod = async (req, res, next) => {
  try {
    const period = req.resource; // From authorizeResource middleware
    
    // Find next period log before deleting to update its cycle offset
    const nextPeriod = await Period.findOne({
      user: req.user.id,
      startDate: { $gt: period.startDate },
      _id: { $ne: period._id }
    }).sort({ startDate: 1 });

    await period.deleteOne();

    // Recalculate next period's cycle length based on its new predecessor
    if (nextPeriod) {
      const prevOfNext = await Period.findOne({
        user: req.user.id,
        startDate: { $lt: nextPeriod.startDate }
      }).sort({ startDate: -1 });

      if (prevOfNext) {
        nextPeriod.cycleLength = getDaysDifference(prevOfNext.startDate, nextPeriod.startDate);
      } else {
        nextPeriod.cycleLength = 0;
      }
      await nextPeriod.save();
    }

    return sendSuccessResponse(res, 200, 'Period removed successfully');
  } catch (error) {
    next(error);
  }
};
