export function calculateCapacityPlan(bookings, windowStart, windowEnd, capacity) {
  // SLS 1: Validate booking collection and planning window
  if (!Array.isArray(bookings) || !Number.isFinite(windowStart) ||
      !Number.isFinite(windowEnd) || windowStart >= windowEnd ||
      !Number.isFinite(capacity) || capacity < 0) {
    return { peak: 0, overCapacity: false, conflicts: [], error: 'INVALID_INPUT' };
  }
  const events = [];
  let invalidCount = 0;

  // SLS 2: Clip valid intervals to the requested planning window
  for (let index = 0; index < bookings.length; index++) {
    const booking = bookings[index];
    if (!booking || !Number.isFinite(booking.start) || !Number.isFinite(booking.end) ||
        !Number.isFinite(booking.units) || booking.start >= booking.end || booking.units <= 0) {
      invalidCount++;
      continue;
    }
    const start = Math.max(windowStart, booking.start);
    const end = Math.min(windowEnd, booking.end);
    if (start >= end) continue;
    events.push({ time: start, delta: booking.units, id: booking.id ?? `booking_${index}` });
    events.push({ time: end, delta: -booking.units, id: booking.id ?? `booking_${index}` });
  }

  // SLS 3: Sort end events before start events at equal time for half-open intervals
  events.sort((a, b) => a.time - b.time || a.delta - b.delta || String(a.id).localeCompare(String(b.id)));
  let active = 0;
  let peak = 0;
  const conflicts = [];
  let cursor = 0;

  // SLS 4: Sweep events and record times where simultaneous usage exceeds capacity
  while (cursor < events.length) {
    const time = events[cursor].time;
    while (cursor < events.length && events[cursor].time === time) {
      active += events[cursor].delta;
      cursor++;
    }
    peak = Math.max(peak, active);
    if (active > capacity) conflicts.push({ time, active, excess: active - capacity });
  }

  // SLS 5: Summarize peak usage and malformed input count
  return { peak, overCapacity: peak > capacity, conflicts, invalidCount, error: null };
}
