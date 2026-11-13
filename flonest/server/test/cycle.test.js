const { test } = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { calculateCycleState, getDaysDifference, dateKey, addDays, isCalendarDate } = require('../utils/calculateCycle');
const user = { averageCycleLength: 28, averagePeriodLength: 5 };
const state = (start, today) => calculateCycleState([{ startDate: new Date(start) }], user, today);

test('Day 1 is the start date; consecutive, month, year and leap-year boundaries', () => {
  for (const [start, today, expected] of [
    ['2026-11-01', '2026-11-01', 1], ['2026-11-01', '2026-11-02', 2],
    ['2026-01-31', '2026-02-01', 2], ['2025-12-31', '2026-01-01', 2],
    ['2024-02-28', '2024-03-01', 3], ['2026-02-28', '2026-03-01', 2]
  ]) assert.equal(state(start, today).currentCycleDay, expected);
});

test('phase, progress and forecasts share the same cycle anchor', () => {
  const first = state('2026-11-01', '2026-11-01');
  assert.equal(first.status, 'Menstrual Phase');
  assert.ok(Math.abs(first.cycleProgress - 100 / 28) < 1e-10);
  assert.equal(first.nextPeriod, '2026-11-29');
  assert.equal(first.ovulationDate, '2026-11-15');
  assert.deepEqual(first.fertileWindow, { start: '2026-11-10', end: '2026-11-16' });
  assert.equal(state('2026-11-01', '2026-11-06').status, 'Follicular Phase');
  assert.equal(state('2026-11-01', '2026-11-15').status, 'Ovulatory Phase');
  assert.equal(state('2026-11-01', '2026-11-16').status, 'Luteal Phase');
  const late = state('2026-11-01', '2026-12-01');
  assert.equal(late.currentCycleDay, 31);
  assert.equal(late.cycleProgress, 100);
  assert.equal(late.daysRemaining, -2);
});

test('latest started record wins regardless of record order; future records cannot start a cycle', () => {
  const periods = [{ startDate: '2026-11-10' }, { startDate: '2026-10-10' }, { startDate: '2026-12-10' }];
  assert.equal(calculateCycleState(periods, user, '2026-11-13').currentCycleDay, 4);
  for (const records of [[], [{ startDate: '2026-12-10' }]]) {
    const result = calculateCycleState(records, user, '2026-11-13');
    for (const key of ['currentCycleDay', 'cycleProgress', 'status', 'nextPeriod', 'fertileWindow']) assert.equal(result[key], null);
  }
});

test('date validation and arithmetic preserve calendar labels', () => {
  assert.equal(isCalendarDate('2026-02-30'), false);
  assert.equal(isCalendarDate('2024-02-29'), true);
  assert.equal(isCalendarDate('2026-11-13T00:00:00Z'), false);
  assert.equal(getDaysDifference('2026-03-07', '2026-03-09'), 2);
  assert.equal(dateKey(addDays('2026-12-31', 1)), '2027-01-01');
});

for (const zone of ['UTC', 'Asia/Colombo', 'America/New_York', 'Pacific/Honolulu', 'Pacific/Kiritimati']) {
  test(`server calculations are timezone independent, including DST: ${zone}`, () => {
    const script = `const assert = require('node:assert/strict');
      const { getDaysDifference, calculateCycleState } = require('./utils/calculateCycle');
      assert.equal(getDaysDifference('2026-03-07', '2026-03-09'), 2);
      assert.equal(getDaysDifference('2026-10-31', '2026-11-02'), 2);
      assert.equal(calculateCycleState([{startDate:new Date('2026-11-01')}], {}, '2026-11-02').currentCycleDay, 2);`;
    execFileSync(process.execPath, ['-e', script], { cwd: require('node:path').join(__dirname, '..'), env: { ...process.env, TZ: zone } });
  });
}
