import { describe, expect, it } from 'vitest';
import { allocateBudget } from './allocateBudget.js';

describe('allocateBudget', () => {
  it('rejects invalid budgets', () => {
    expect(allocateBudget([], -1).error).toBe('INVALID_INPUT');
  });
  it('conserves all cents using proportional largest-remainder allocation', () => {
    const result = allocateBudget([{ id: 'a', weight: 1 }, { id: 'b', weight: 1 }, { id: 'c', weight: 1 }], 10);
    expect(result.allocations).toEqual([{ id: 'a', cents: 4 }, { id: 'b', cents: 3 }, { id: 'c', cents: 3 }]);
    expect(result.allocations.reduce((sum, item) => sum + item.cents, 0)).toBe(10);
  });
  it('skips invalid items and returns the full amount if none are eligible', () => {
    expect(allocateBudget([{ id: 'x', weight: 0 }], 20))
      .toEqual({ allocations: [], unallocated: 20, error: null, invalidCount: 1 });
  });
});
