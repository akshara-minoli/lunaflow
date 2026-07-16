const Period = require('../models/Period');
const User = require('../models/User');
const {
  calculateAverageCycle,
  calculateNextPeriod,
  calculateOvulation,
  calculateFertileWindow,
  calculateRemainingDays
} = require('../utils/calculateCycle');

// Helper to format consistent success response
const sendSuccessResponse = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

// @desc    Get cycle predictions and health milestones
// @route   GET /api/predictions
// @access  Private
exports.getPredictions = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const periods = await Period.find({ user: req.user.id }).sort({ startDate: 1 }); // Oldest to newest

    const defaultCycle = user.averageCycleLength || 28;
    const avgCycle = calculateAverageCycle(periods, defaultCycle);

    if (periods.length === 0) {
      return sendSuccessResponse(res, 200, 'No period logs found to base predictions on', {
        averageCycleLength: defaultCycle,
        nextPeriod: null,
        daysRemaining: null,
        lateEarlyStatus: 'no_data',
        ovulationDate: null,
        fertileWindow: {
          start: null,
          end: null
        }
      });
    }

    const lastPeriod = periods[periods.length - 1];
    const lastStart = lastPeriod.startDate;

    // Calculate forecasts using utility helpers
    const nextPeriod = calculateNextPeriod(lastStart, avgCycle);
    const daysRemaining = calculateRemainingDays(nextPeriod);
    const ovulationDate = calculateOvulation(nextPeriod);
    const fertileWindow = calculateFertileWindow(ovulationDate);

    // Determine late or early status
    let lateEarlyStatus = 'on_time';
    if (daysRemaining < 0) {
      lateEarlyStatus = 'late';
    } else if (daysRemaining === 0) {
      lateEarlyStatus = 'today';
    }

    return sendSuccessResponse(res, 200, 'Predictions calculated successfully', {
      averageCycleLength: avgCycle,
      nextPeriod,
      daysRemaining,
      lateEarlyStatus,
      ovulationDate,
      fertileWindow
    });
  } catch (error) {
    next(error);
  }
};
