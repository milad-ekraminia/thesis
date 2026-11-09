export function analyzeLogWindow(entries, windowMs, bucketMs) {
  // SLS 1: Validate collection and positive bucket parameters
  if (!Array.isArray(entries) || !Number.isFinite(windowMs) || windowMs <= 0 ||
      !Number.isFinite(bucketMs) || bucketMs <= 0) {
    return { buckets: [], invalidCount: 0, error: 'INVALID_INPUT' };
  }
  const counts = new Map();
  let invalidCount = 0;
  let minTime = Infinity;
  let maxTime = -Infinity;

  // SLS 2: Validate events and establish the observed time span
  for (let index = 0; index < entries.length; index++) {
    const entry = entries[index];
    if (!entry || !Number.isFinite(entry.timestamp) || typeof entry.level !== 'string') {
      invalidCount++;
      continue;
    }
    minTime = Math.min(minTime, entry.timestamp);
    maxTime = Math.max(maxTime, entry.timestamp);
  }
  if (minTime === Infinity) {
    return {
      buckets: [],
      invalidCount,
      outsideWindowCount: 0,
      windowStart: null,
      windowEnd: null,
      error: null
    };
  }

  // SLS 3: Restrict the analysis to the trailing window ending at the latest event
  const windowEnd = maxTime;
  const windowStart = windowEnd - windowMs;
  let outsideWindowCount = 0;
  const inWindow = [];
  for (const entry of entries) {
    if (!entry || !Number.isFinite(entry.timestamp) || typeof entry.level !== 'string') continue;
    if (entry.timestamp < windowStart || entry.timestamp > windowEnd) {
      outsideWindowCount++;
      continue;
    }
    inWindow.push(entry);
  }

  // SLS 4: Count severity totals in windows anchored at the trailing window start
  for (const entry of inWindow) {
    const bucket = Math.floor((entry.timestamp - windowStart) / bucketMs);
    if (!counts.has(bucket)) counts.set(bucket, {
      start: windowStart + bucket * bucketMs,
      total: 0,
      errors: 0
    });
    const stats = counts.get(bucket);
    stats.total++;
    if (entry.level.toUpperCase() === 'ERROR') stats.errors++;
  }

  // SLS 5: Emit non-empty buckets in chronological order
  const buckets = [];
  const indexes = [...counts.keys()].sort((a, b) => a - b);
  let cursor = 0;
  while (cursor < indexes.length) {
    buckets.push(counts.get(indexes[cursor++]));
  }
  return { buckets, invalidCount, outsideWindowCount, windowStart, windowEnd, error: null };
}
