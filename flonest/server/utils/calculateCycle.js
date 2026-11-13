// Saved dates are calendar labels at UTC midnight, not timezone-dependent instants.
const dateKey = value => value instanceof Date ? value.toISOString().slice(0, 10) : String(value).slice(0, 10);
const isCalendarDate = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + 'T00:00:00.000Z');
  return !Number.isNaN(date.getTime()) && dateKey(date) === value;
};
const getDaysDifference = (from, to) =>
  (Date.parse(dateKey(to) + 'T00:00:00Z') - Date.parse(dateKey(from) + 'T00:00:00Z')) / 86400000;
const addDays = (value, days) => {
  const result = new Date(dateKey(value) + 'T00:00:00Z');
  result.setUTCDate(result.getUTCDate() + days);
  return result;
};

/**
 * Calculate average cycle length from logged history
 * @param {Array} periods - User's logged periods, sorted by startDate ascending
 * @param {number} defaultLen - Profile default cycle length (e.g. 28)
 */
const calculateAverageCycle = (periods, defaultLen = 28) => {
  if (!periods || periods.length < 2) {
    return defaultLen;
  }

  let totalDiff = 0;
  let count = 0;

  for (let i = 1; i < periods.length; i++) {
    const diff = getDaysDifference(periods[i - 1].startDate, periods[i].startDate);
    // filter out outliers to keep predictions sane
    if (diff >= 15 && diff <= 45) {
      totalDiff += diff;
      count++;
    }
  }

  return count > 0 ? Math.round(totalDiff / count) : defaultLen;
};

/**
 * Calculate duration of a period log in days
 * @param {Date|string} startDate
 * @param {Date|string} endDate
 */
const calculatePeriodDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  return getDaysDifference(startDate, endDate) + 1; // Inclusive duration
};

/**
 * Calculate predicted next period start date
 * @param {Date|string} lastStartDate
 * @param {number} averageCycleLength
 */
const calculateNextPeriod = (lastStartDate, averageCycleLength) => {
  if (!lastStartDate) return null;
  return addDays(lastStartDate, averageCycleLength);
};

/**
 * Calculate predicted ovulation date (typically 14 days before the next period starts)
 * @param {Date} nextPeriodStartDate
 */
const calculateOvulation = (nextPeriodStartDate) => {
  if (!nextPeriodStartDate) return null;
  return addDays(nextPeriodStartDate, -14);
};

/**
 * Calculate fertile window boundaries (5 days before ovulation to 1 day after ovulation)
 * @param {Date} ovulationDate
 */
const calculateFertileWindow = (ovulationDate) => {
  if (!ovulationDate) return null;
  return {
    start: addDays(ovulationDate, -5),
    end: addDays(ovulationDate, 1)
  };
};

/**
 * Calculate remaining days from today until target date
 * @param {Date|string} targetDate
 */
const calculateRemainingDays = (targetDate, today = dateKey(new Date())) =>
  targetDate ? getDaysDifference(today, targetDate) : null;

// Only a recorded period starts a new cycle; never wrap at the predicted length.
const calculateCycleState = (periods, user, today) => {
  const history = periods.filter(p => dateKey(p.startDate) <= today)
    .slice().sort((a, b) => dateKey(a.startDate).localeCompare(dateKey(b.startDate)));
  const averageCycleLength = calculateAverageCycle(history, user.averageCycleLength || 28);
  const empty = {
    asOfDate: today, averageCycleLength, currentCycleDay: null,
    cycleProgress: null, status: null, lastPeriodStart: null,
    nextPeriod: null, daysRemaining: null, lateEarlyStatus: 'no_data',
    ovulationDate: null, fertileWindow: null
  };
  if (!history.length) return empty;
  const last = history[history.length - 1];
  const currentCycleDay = getDaysDifference(last.startDate, today) + 1;
  const nextPeriod = calculateNextPeriod(last.startDate, averageCycleLength);
  const ovulationDate = calculateOvulation(nextPeriod);
  const fertileWindow = calculateFertileWindow(ovulationDate);
  const daysRemaining = calculateRemainingDays(nextPeriod, today);
  const periodLength = last.endDate ? calculatePeriodDuration(last.startDate, last.endDate) : (user.averagePeriodLength || 5);
  const ovulationDay = getDaysDifference(last.startDate, ovulationDate) + 1;
  const status = currentCycleDay <= periodLength ? 'Menstrual Phase'
    : currentCycleDay < ovulationDay ? 'Follicular Phase'
    : currentCycleDay === ovulationDay ? 'Ovulatory Phase' : 'Luteal Phase';
  return {
    ...empty, currentCycleDay, status,
    cycleProgress: Math.min(100, currentCycleDay / averageCycleLength * 100),
    lastPeriodStart: dateKey(last.startDate), nextPeriod: dateKey(nextPeriod),
    daysRemaining, lateEarlyStatus: daysRemaining < 0 ? 'late' : daysRemaining === 0 ? 'today' : 'on_time',
    ovulationDate: dateKey(ovulationDate),
    fertileWindow: { start: dateKey(fertileWindow.start), end: dateKey(fertileWindow.end) }
  };
};
module.exports = {
  calculateAverageCycle, calculatePeriodDuration, calculateNextPeriod,
  calculateOvulation, calculateFertileWindow, calculateRemainingDays,
  getDaysDifference, addDays, dateKey, isCalendarDate, calculateCycleState
};
