import { describe, expect, it } from 'vitest';
import { calculateNetPayable } from './calculateNetPayable.js';

describe('calculateNetPayable', () => {
  it('returns a zero summary for no usable items', () => {
    expect(calculateNetPayable([], 'GOLD', {})).toEqual({ gross: 0, discount: 0, tax: 0, net: 0 });
  });

  it('applies item and tier discounts followed by tax', () => {
    expect(calculateNetPayable([{ price: 100, quantity: 3, category: 'PROMO' }], 'GOLD', { standardRate: 0.1 }))
      .toEqual({ gross: 300, discount: 96, tax: 20.4, net: 224.4 });
  });

  it('skips invalid items and uses default quantity and tax configuration', () => {
    expect(calculateNetPayable([null, { price: -1 }, { price: 10 }], 'UNKNOWN', null))
      .toEqual({ gross: 10, discount: 0, tax: 0, net: 10 });
  });

  it('uses the luxury rate fallback for totals above the threshold', () => {
    expect(calculateNetPayable([{ price: 1200 }], 'UNKNOWN', { standardRate: 0.1 }).tax).toBe(180);
  });

  it('uses an explicit luxury rate and exempts totals below 50', () => {
    expect(calculateNetPayable([{ price: 1200 }], 'UNKNOWN', { standardRate: 0.1, luxuryRate: 0.2 }).tax).toBe(240);
    expect(calculateNetPayable([{ price: 49 }], 'UNKNOWN', { standardRate: 0.1 }).tax).toBe(0);
  });
});
