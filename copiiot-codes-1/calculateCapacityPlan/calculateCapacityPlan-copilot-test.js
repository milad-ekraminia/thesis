import { describe, expect, it } from 'vitest';
import { calculateCapacityPlan } from './calculateCapacityPlan.js';

describe('calculateCapacityPlan', () => {
  it('rejects invalid planning windows', () => {
    expect(calculateCapacityPlan([], 5, 5, 2).error).toBe('INVALID_INPUT');
  });
  it('computes peak units and reports over-capacity times', () => {
    expect(calculateCapacityPlan([
      { id: 'a', start: 0, end: 4, units: 2 }, { id: 'b', start: 2, end: 5, units: 2 }
    ], 0, 10, 3)).toMatchObject({ peak: 4, overCapacity: true, conflicts: [{ time: 2, active: 4, excess: 1 }] });
  });
  it('clips bookings to the window and allows adjoining half-open intervals', () => {
    expect(calculateCapacityPlan([
      { start: -2, end: 2, units: 1 }, { start: 2, end: 4, units: 1 }
    ], 0, 4, 1)).toMatchObject({ peak: 1, overCapacity: false, conflicts: [] });
  });
  it('counts malformed bookings and ignores those outside the window', () => {
    expect(calculateCapacityPlan([null, { start: 8, end: 9, units: 1 }], 0, 5, 2))
      .toMatchObject({ peak: 0, invalidCount: 1, overCapacity: false });
  });
});
