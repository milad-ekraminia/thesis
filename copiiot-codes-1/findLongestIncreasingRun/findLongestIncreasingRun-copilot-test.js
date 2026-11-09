import { describe, expect, it } from 'vitest';
import { findLongestIncreasingRun } from './findLongestIncreasingRun.js';

describe('findLongestIncreasingRun', () => {
  it('returns a sentinel for non-arrays and empty arrays', () => {
    expect(findLongestIncreasingRun(null)).toEqual({ start: -1, end: -1, length: 0, values: [] });
    expect(findLongestIncreasingRun([]).values).toEqual([]);
  });
  it('finds the longest contiguous strictly increasing run', () => {
    expect(findLongestIncreasingRun([1, 2, 4, 3, 5, 6, 7])).toEqual({
      start: 3, end: 6, length: 4, values: [3, 5, 6, 7]
    });
  });
  it('chooses the earliest run in a tie and treats invalid numbers as breaks', () => {
    expect(findLongestIncreasingRun([1, 2, 0, 1])).toEqual({ start: 0, end: 1, length: 2, values: [1, 2] });
    expect(findLongestIncreasingRun([1, NaN, 2, 3])).toEqual({ start: 2, end: 3, length: 2, values: [2, 3] });
    expect(findLongestIncreasingRun([NaN, Infinity])).toEqual({ start: -1, end: -1, length: 0, values: [] });
  });
});
