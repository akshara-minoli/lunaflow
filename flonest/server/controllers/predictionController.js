const Period = require('../models/Period');
const User = require('../models/User');
const { calculateCycleState, isCalendarDate, dateKey } = require('../utils/calculateCycle');

exports.getPredictions = async (req, res, next) => {
  try {
    // The browser supplies its local calendar date; the server may be in UTC.
    const today = req.query.today ?? dateKey(new Date());
    if (!isCalendarDate(today)) {
      return res.status(400).json({ success: false, message: 'today must be a valid YYYY-MM-DD calendar date' });
    }
    const user = await User.findById(req.user.id);
    const periods = await Period.find({ user: req.user.id }).sort({ startDate: -1 });
    const predictions = calculateCycleState(periods, user, today);
    res.set('Cache-Control', 'no-store');
    return res.status(200).json({
      success: true, message: 'Cycle state calculated from saved period logs',
      // Return the exact records used for predictions to keep the calendar in sync.
      data: { ...predictions, periods }
    });
  } catch (error) { next(error); }
};
