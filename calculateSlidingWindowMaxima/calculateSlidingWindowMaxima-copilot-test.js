import { describe, expect, it } from 'vitest';
import { calculateSlidingWindowMaxima } from './calculateSlidingWindowMaxima.js';

describe('calculateSlidingWindowMaxima', () => {
  it('handles invalid and empty input', () => {
    expect(calculateSlidingWindowMaxima(null, 2)).toEqual([]);
    expect(calculateSlidingWindowMaxima([1], 0)).toEqual([]);
  });

  it('computes maxima for each fixed window', () => {
    expect(calculateSlidingWindowMaxima([1, 3, 2, 5], 2)).toEqual([3, 3, 5]);
  });

  it('clamps a too-large window to the input length', () => {
    expect(calculateSlidingWindowMaxima([1, 4, 2], 8)).toEqual([4]);
  });

  it('applies thresholding and maps below-threshold maxima to zero', () => {
    expect(calculateSlidingWindowMaxima([1, 3, 2, 5], 2, 3)).toEqual([0, 0, 5]);
  });

  it('resets across invalid values and finds maxima in later valid runs', () => {
    expect(calculateSlidingWindowMaxima([1, 2, NaN, 4, 3], 2)).toEqual([2, 4]);
  });
});
