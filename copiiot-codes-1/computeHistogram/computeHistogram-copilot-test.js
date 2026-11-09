import { describe, expect, it } from 'vitest';
import { computeHistogram } from './computeHistogram.js';

describe('computeHistogram', () => {
  it('validates input and boundary order', () => {
    expect(computeHistogram([], [1]).error).toBe('INVALID_INPUT');
    expect(computeHistogram([1], [0, 2, 1]).error).toBe('INVALID_BOUNDARIES');
  });
  it('counts values in half-open bins and includes the final endpoint', () => {
    expect(computeHistogram([0, 1, 2, 3], [0, 2, 3])).toEqual({
      bins: [
        { start: 0, end: 2, count: 2, includesEnd: false },
        { start: 2, end: 3, count: 2, includesEnd: true }
      ], binCount: 2, included: 4, ignored: 0, range: 3, error: null
    });
  });
  it('counts non-finite and out-of-range values as ignored', () => {
    expect(computeHistogram([NaN, -1, 1, 5], [0, 2, 4]).ignored).toBe(3);
  });
});
