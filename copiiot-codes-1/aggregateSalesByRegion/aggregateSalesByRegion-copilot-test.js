import { describe, expect, it } from 'vitest';
import { aggregateSalesByRegion } from './aggregateSalesByRegion.js';

describe('aggregateSalesByRegion', () => {
  it('handles invalid and empty collections', () => {
    expect(aggregateSalesByRegion(null)).toEqual({
      totals: {}, accepted: 0, rejected: 0, regionCount: 0, grandTotal: 0
    });
    expect(aggregateSalesByRegion([])).toEqual({
      totals: {}, accepted: 0, rejected: 0, regionCount: 0, grandTotal: 0
    });
  });
  it('aggregates valid sales, trims regions, rounds cents, and sorts keys', () => {
    expect(aggregateSalesByRegion([
      { region: ' West ', amount: 1.005 }, { region: 'East', amount: 4 }, { region: 'West', amount: 2 }
    ])).toEqual({
      totals: { East: 4, West: 3.01 }, accepted: 3, rejected: 0, regionCount: 2, grandTotal: 7.01
    });
  });
  it('rejects malformed, below-minimum, and disallowed records', () => {
    expect(aggregateSalesByRegion([
      null, { region: '', amount: 2 }, { region: 'A', amount: Infinity }, { region: 'A', amount: 1 },
      { region: 'B', amount: 5 }
    ], { minimum: 2, regions: ['B'] })).toEqual({
      totals: { B: 5 }, accepted: 1, rejected: 4, regionCount: 1, grandTotal: 5
    });
  });
});
