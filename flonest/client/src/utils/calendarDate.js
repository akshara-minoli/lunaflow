// Clock values use local components. Saved ISO dates are calendar labels:
// preserve their date portion instead of converting timezone.
export const localDateKey = (date = new Date()) =>
  [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
export const calendarDate = value => {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day);
};
export const calendarDaysBetween = (from, to) =>
  (Date.parse(to.slice(0, 10) + 'T00:00:00Z') - Date.parse(from.slice(0, 10) + 'T00:00:00Z')) / 86400000;

// Check at local midnight, after clock/timezone changes, and on tab resume.
export const watchCalendarDate = (onChange, env = {
  now: () => new Date(),
  // Browser timers require Window as their receiver, not the injected env.
  setTimeout: (callback, delay) => window.setTimeout(callback, delay),
  clearTimeout: timer => window.clearTimeout(timer),
  window, document
}) => {
  let previous = localDateKey(env.now());
  let timer;
  const check = () => {
    env.clearTimeout(timer);
    const now = env.now();
    const current = localDateKey(now);
    if (current !== previous) { previous = current; onChange(current); }
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    timer = env.setTimeout(check, Math.min(60000, Math.max(1, midnight - now)));
  };
  check();
  env.window.addEventListener('focus', check);
  env.document.addEventListener('visibilitychange', check);
  return () => {
    env.clearTimeout(timer);
    env.window.removeEventListener('focus', check);
    env.document.removeEventListener('visibilitychange', check);
  };
};
