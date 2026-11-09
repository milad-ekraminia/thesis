import { describe, expect, it } from 'vitest';
import { evaluateResourceBurst } from './evaluateResourceBurst.js';

describe('evaluateResourceBurst', () => {
  it('rejects invalid request and limit structures', () => {
    expect(() => evaluateResourceBurst(null, {}, 100)).toThrow(TypeError);
    expect(() => evaluateResourceBurst([], null, 100)).toThrow(TypeError);
  });

  it('returns a rejected list for an invalid time window', () => {
    expect(evaluateResourceBurst([{ id: 'a' }, { id: '' }], {}, 0))
      .toEqual({ accepted: [], rejected: ['a'], error: 'INVALID_WINDOW' });
  });

  it('accepts requests within bucket capacity and rejects excess costs', () => {
    expect(evaluateResourceBurst([
      { id: 'a', type: 'read', cost: 2, timestamp: 1000 },
      { id: 'b', type: 'read', cost: 2, timestamp: 1000 }
    ], { read: 3 }, 1000)).toEqual({
      accepted: ['a'], rejected: ['b'], remainingBalances: { read: 1 }
    });
  });

  it('rejects malformed, unknown-type, and non-positive-cost requests', () => {
    const result = evaluateResourceBurst([
      null,
      { id: 'unknown', type: 'other', cost: 1, timestamp: 10 },
      { id: 'zero', type: 'read', cost: 0, timestamp: 10 }
    ], { read: 2 }, 1000);
    expect(result.accepted).toEqual([]);
    expect(result.rejected).toEqual([null, 'unknown', 'zero']);
  });

  it('refills tokens according to elapsed time', () => {
    const result = evaluateResourceBurst([
      { id: 'first', type: 'read', cost: 2, timestamp: 1000 },
      { id: 'next', type: 'read', cost: 2, timestamp: 2000 }
    ], { read: 2 }, 1000);
    expect(result.accepted).toEqual(['first', 'next']);
    expect(result.remainingBalances.read).toBe(0);
  });
});
