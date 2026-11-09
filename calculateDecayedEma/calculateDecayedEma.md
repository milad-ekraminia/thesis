Method 19: Time-Decayed Exponential Moving Average with Gaps
JavaScript
```js
export function calculateDecayedEma(dataPoints, halfLifeMs, options = {}) {
  // SLS 1: Parameter assertions
  if (!Array.isArray(dataPoints) || dataPoints.length === 0) return [];
  if (typeof halfLifeMs !== 'number' || halfLifeMs <= 0) {
    throw new RangeError("Half-life must be a positive number");
  }

  const results = [];
  const maxGapMs = options.maxGapMs || halfLifeMs * 10;
  let currentEma = null;
  let lastTimestamp = null;
  let i = 0;

  // SLS 2: Traversal loop
  while (i < dataPoints.length) {
    const point = dataPoints[i++];
    if (!point || typeof point.timestamp !== 'number' || typeof point.value !== 'number') {
      continue; // Skip corrupted entries
    }

    // SLS 3: First valid point initialization
    if (currentEma === null) {
      currentEma = point.value;
      lastTimestamp = point.timestamp;
      results.push({ timestamp: point.timestamp, ema: currentEma });
      continue;
    }

    const delta = point.timestamp - lastTimestamp;

    // SLS 4: Time sequencing checks (negative time or excessive gaps)
    if (delta < 0) {
      if (options.rejectUnordered) {
        throw new Error(`Out of order timestamp encountered: ${point.timestamp}`);
      }
      continue; // Ignore backwards timestamp
    }

    if (delta > maxGapMs) {
      // Gap reset trigger
      currentEma = point.value;
    } else {
      // SLS 5: Exponential decay weighting
      const decayFactor = Math.exp((-delta * Math.LN2) / halfLifeMs);
      currentEma = point.value * (1 - decayFactor) + currentEma * decayFactor;
    }

    lastTimestamp = point.timestamp;
    results.push({
      timestamp: point.timestamp,
      ema: Math.round(currentEma * 10000) / 10000,
      interpolated: delta > maxGapMs
    });
  }

  // SLS 6: Return smooth series
  return results;
}
```

Strategic Locational Sections:

- **SLS 1 (Lines 2–6):** Collection presence checks and positive half-life validations.
- **SLS 2 (Lines 14–17):** Item-level type checking and sanitization.
- **SLS 3 (Lines 20–25):** Baseline seeding for the initial point.
- **SLS 4 (Lines 29–38):** Out-of-order timestamp detection and excess gap reset handling.
- **SLS 5 (Lines 40–49):** Continuous decay calculations using `Math.exp`.
- **SLS 6 (Lines 52–53):** Normalized array output.
