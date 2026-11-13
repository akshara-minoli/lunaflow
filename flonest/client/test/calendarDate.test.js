import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { localDateKey, calendarDate, calendarDaysBetween, watchCalendarDate } from '../src/utils/calendarDate.js';

test('default browser environment preserves the Window receiver for timers', (t) => {
  let scheduled = 0;
  let cleared = 0;
  const browserWindow = {
    setTimeout(callback, delay) {
      if (this !== browserWindow) throw new TypeError('Illegal invocation');
      assert.equal(typeof callback, 'function');
      assert.ok(delay > 0);
      scheduled++;
      return 42;
    },
    clearTimeout() {
      if (this !== browserWindow) throw new TypeError('Illegal invocation');
      cleared++;
    },
    addEventListener() {}, removeEventListener() {}
  };
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  t.after(() => {
    for (const [name, descriptor] of [['window', originalWindow], ['document', originalDocument]]) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  });
  globalThis.window = browserWindow;
  globalThis.document = { addEventListener() {}, removeEventListener() {} };
  // Simulate native browser globals too: the old implementation stores these
  // unbound functions on env and throws when invoked as env.clearTimeout().
  t.mock.method(globalThis, 'setTimeout', browserWindow.setTimeout);
  t.mock.method(globalThis, 'clearTimeout', browserWindow.clearTimeout);
  const stop = watchCalendarDate(() => {});
  assert.equal(scheduled, 1);
  stop();
  assert.equal(cleared, 2);
});

test('saved dates round-trip through local date inputs and calendar highlighting', () => {
  assert.equal(localDateKey(calendarDate('2026-11-13T00:00:00.000Z')), '2026-11-13');
  assert.equal(calendarDaysBetween('2026-01-31', '2026-02-01'), 1);
  assert.equal(calendarDaysBetween('2024-02-28', '2024-03-01'), 2);
});

test('midnight, suspended-tab resume, clock changes and cleanup', () => {
  let now = new Date(2026, 0, 31, 23, 59, 59);
  let callback;
  let delay;
  let cleared = 0;
  const changes = [];
  const listeners = new Map();
  const target = { addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener: name => listeners.delete(name) };
  const stop = watchCalendarDate(date => changes.push(date), {
    now: () => now, setTimeout: (fn, ms) => { callback = fn; delay = ms; return 1; },
    clearTimeout: () => { cleared++; }, window: target, document: target
  });
  assert.equal(delay, 1000);
  now = new Date(2026, 1, 1);
  callback();
  assert.deepEqual(changes, ['2026-02-01']);
  callback();
  assert.equal(changes.length, 1);
  now = new Date(2026, 1, 3, 9);
  listeners.get('visibilitychange')();
  assert.equal(changes[1], '2026-02-03');
  now = new Date(2026, 1, 2, 23);
  listeners.get('focus')();
  assert.equal(changes[2], '2026-02-02');
  stop();
  assert.equal(listeners.size, 0);
  assert.ok(cleared > 0);
});

for (const [zone, expected] of [['UTC', '2026-11-13'], ['Asia/Colombo', '2026-11-14'], ['America/New_York', '2026-11-13'], ['Pacific/Kiritimati', '2026-11-14']]) {
  test(`local today differs from UTC correctly: ${zone}`, () => {
    const script = `import assert from 'node:assert/strict';
      import { localDateKey, calendarDate, calendarDaysBetween } from './src/utils/calendarDate.js';
      assert.equal(localDateKey(new Date('2026-11-13T23:30:00Z')), '${expected}');
      assert.equal(localDateKey(calendarDate('2026-11-13T00:00:00Z')), '2026-11-13');
      assert.equal(calendarDaysBetween('2026-03-07', '2026-03-09'), 2);
      assert.equal(calendarDaysBetween('2026-10-31', '2026-11-02'), 2);`;
    execFileSync(process.execPath, ['--input-type=module', '-e', script], { cwd: new URL('..', import.meta.url), env: { ...process.env, TZ: zone } });
  });
}
