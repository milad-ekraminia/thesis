import { describe, expect, it } from 'vitest';
import { planRetries } from './planRetries.js';

describe('planRetries', () => {
  it('rejects invalid parameters', () => {
    expect(planRetries(0, 10, 100)).toEqual([]);
    expect(planRetries(2, -1, 100)).toEqual([]);
  });
  it('is deterministic for the same seed and produces one delay per attempt', () => {
    expect(planRetries(4, 100, 1000, 42)).toEqual(planRetries(4, 100, 1000, 42));
    expect(planRetries(4, 100, 1000, 42)).toHaveLength(4);
  });
  it('caps delays and attempt count', () => {
    const delays = planRetries(30, 1000, 1200, 5);
    expect(delays).toHaveLength(20);
    expect(delays.every(value => value >= 0 && value <= 1200)).toBe(true);
  });
  it('handles zero-delay configuration', () => {
    expect(planRetries(2, 0, 100, 1)).toEqual([0, 0]);
  });
  it('supports zero jitter and clamps jitter outside the supported fraction', () => {
    expect(planRetries(3, 10, 100, 2, 0)).toEqual([10, 20, 40]);
    const clampedJitterDelay = planRetries(1, 10, 100, 2, 4)[0];
    expect(clampedJitterDelay).toBeGreaterThanOrEqual(0);
    expect(clampedJitterDelay).toBeLessThanOrEqual(20);
  });
});
