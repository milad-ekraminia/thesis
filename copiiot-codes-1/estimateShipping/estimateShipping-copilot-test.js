import { describe, expect, it } from 'vitest';
import { estimateShipping } from './estimateShipping.js';

describe('estimateShipping', () => {
  const box = { weight: 2, length: 10, width: 10, height: 10 };
  it('returns an empty quote result for invalid top-level inputs', () => {
    expect(estimateShipping(null, [], {})).toEqual({ quotes: [], rejectedPackages: 0 });
  });
  it('calculates actual-weight quotes and sorts by price', () => {
    expect(estimateShipping([box], [
      { name: 'B', baseRate: 8, perKgRate: 1 },
      { name: 'A', baseRate: 5, perKgRate: 1 }
    ], { country: 'US' }).quotes.map(q => q.service)).toEqual(['A', 'B']);
  });
  it('uses volumetric weight, country eligibility, and remote surcharges', () => {
    const result = estimateShipping([{ ...box, length: 100 }], [
      { name: 'remote', baseRate: 1, divisor: 100, remoteSurcharge: 4, countries: ['US'] },
      { name: 'blocked', baseRate: 1, countries: ['CA'] }
    ], { country: 'US', remote: true });
    expect(result.quotes[0]).toMatchObject({ service: 'remote', billableWeight: 100, cost: 5 });
  });
  it('counts malformed packages and skips services over their weight limit', () => {
    expect(estimateShipping([null, box], [{ name: 'small', baseRate: 1, maxWeight: 1 }], { country: 'US' }))
      .toEqual({ quotes: [], rejectedPackages: 1 });
  });
});
