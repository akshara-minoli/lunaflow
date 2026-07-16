/**
 * Helper to calculate date difference in days (inclusive of fractions)
 */
const getDaysDifference = (d1, d2) => {
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  // Reset times to midnight for precise date calculations
  date1.setHours(0, 0, 0, 0);
  date2.setHours(0, 0, 0, 0);
  
  const diffTime = date2.getTime() - date1.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Helper to add days to a date
 */
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
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
const calculateRemainingDays = (targetDate) => {
  if (!targetDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return getDaysDifference(today, targetDate);
};

module.exports = {
  calculateAverageCycle,
  calculatePeriodDuration,
  calculateNextPeriod,
  calculateOvulation,
  calculateFertileWindow,
  calculateRemainingDays,
  getDaysDifference,
  addDays
};
