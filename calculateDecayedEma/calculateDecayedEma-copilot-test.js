import { describe, expect, it } from 'vitest';
import { calculateDecayedEma } from './calculateDecayedEma.js';

describe('calculateDecayedEma', () => {
  it('returns an empty result for absent or empty data', () => {
    expect(calculateDecayedEma(null, 1000)).toEqual([]);
    expect(calculateDecayedEma([], 1000)).toEqual([]);
  });

  it('requires a positive half-life when data is present', () => {
    expect(() => calculateDecayedEma([{ timestamp: 0, value: 1 }], 0)).toThrow(RangeError);
  });

  it('seeds the first point and blends subsequent values by half-life', () => {
    expect(calculateDecayedEma([
      { timestamp: 0, value: 10 },
      { timestamp: 1000, value: 20 }
    ], 1000)).toEqual([
      { timestamp: 0, ema: 10 },
      { timestamp: 1000, ema: 15, interpolated: false }
    ]);
  });

  it('skips invalid and unordered points unless rejection is requested', () => {
    const points = [
      { timestamp: 10, value: 2 },
      null,
      { timestamp: 9, value: 9 },
      { timestamp: 11, value: 4 }
    ];
    expect(calculateDecayedEma(points, 100).map(point => point.timestamp)).toEqual([10, 11]);
    expect(() => calculateDecayedEma(points, 100, { rejectUnordered: true })).toThrow(/Out of order/);
  });

  it('resets after a gap larger than maxGapMs', () => {
    expect(calculateDecayedEma([
      { timestamp: 0, value: 1 },
      { timestamp: 11, value: 7 }
    ], 10, { maxGapMs: 10 })[1]).toEqual({ timestamp: 11, ema: 7, interpolated: true });
  });
});
