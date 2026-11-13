const { test } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');

// Opt-in real MongoDB test. Always use an isolated database, never application data.
test('saved period CRUD immediately changes predictions and calendar records', { skip: !process.env.TEST_MONGO_URI }, async () => {
  process.env.JWT_SECRET = 'cycle-regression-test-secret';
  const database = `flonest_cycle_test_${process.pid}_${Date.now()}`;
  await mongoose.connect(process.env.TEST_MONGO_URI, { dbName: database });
  const server = require('../app').listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}/api`;
  let cookie = '';
  const request = async (path, method = 'GET', body, status = 200) => {
    const response = await fetch(base + path, { method,
      headers: { 'Content-Type': 'application/json', Cookie: cookie },
      body: body ? JSON.stringify(body) : undefined });
    if (response.headers.get('set-cookie')) cookie = response.headers.get('set-cookie').split(';')[0];
    const result = await response.json();
    assert.equal(response.status, status, JSON.stringify(result));
    return result.data;
  };
  const prediction = () => request('/predictions?today=2026-11-13');
  const create = (startDate, endDate = startDate) => request('/periods', 'POST', { startDate, endDate }, 201);
  try {
    await request('/auth/register', 'POST', { name: 'Cycle Test', email: 'cycle@example.com', password: 'Regression-test-123!' }, 201);
    assert.equal((await prediction()).currentCycleDay, null);
    const older = (await create('2026-10-01')).period;
    const latest = (await create('2026-11-01', '2026-11-05')).period;
    let result = await prediction();
    assert.equal(result.currentCycleDay, 13);
    assert.equal(result.periods[0]._id, latest._id);
    await request(`/periods/${latest._id}`, 'PUT', { startDate: '2026-11-10', endDate: '2026-11-12' });
    result = await prediction();
    assert.equal(result.currentCycleDay, 4);
    assert.equal(result.lastPeriodStart, '2026-11-10');
    assert.equal(result.periods[0].startDate.slice(0, 10), '2026-11-10');
    assert.equal((await request('/predictions?today=2026-11-14')).currentCycleDay, 5);
    await request(`/periods/${latest._id}`, 'DELETE');
    result = await prediction();
    assert.equal(result.currentCycleDay, 44);
    assert.equal(result.periods.length, 1);
    await request(`/periods/${older._id}`, 'DELETE');
    result = await prediction();
    assert.equal(result.currentCycleDay, null);
    assert.equal(result.status, null);
    assert.equal(result.nextPeriod, null);
    assert.deepEqual(result.periods, []);
    await request('/predictions?today=2026-02-30', 'GET', undefined, 400);

    // Moving a record across another record must repair both affected gaps.
    const january = (await create('2026-01-01')).period;
    const february = (await create('2026-02-01')).period;
    const march = (await create('2026-03-01')).period;
    await request(`/periods/${february._id}`, 'PUT', { startDate: '2025-12-01', endDate: '2025-12-01' });
    const records = (await request('/periods')).periods;
    assert.equal(records.find(p => p._id === january._id).cycleLength, 31);
    assert.equal(records.find(p => p._id === march._id).cycleLength, 59);
  } finally {
    await new Promise(resolve => server.close(resolve));
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
});
