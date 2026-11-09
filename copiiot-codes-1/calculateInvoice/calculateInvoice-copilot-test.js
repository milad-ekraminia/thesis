import { describe, expect, it } from 'vitest';
import { calculateInvoice } from './calculateInvoice.js';

describe('calculateInvoice', () => {
  it('returns a zero invoice for invalid collections', () => {
    expect(calculateInvoice(null)).toEqual({ subtotal: 0, discount: 0, tax: 0, total: 0, skipped: 0 });
  });
  it('applies line and customer discounts before tax', () => {
    expect(calculateInvoice([{ price: 100, quantity: 2, discountRate: 0.1 }], 0.1, 0.1))
      .toEqual({ subtotal: 200, discount: 38, tax: 16.2, total: 178.2, skipped: 0 });
  });
  it('uses the clearance minimum discount and default quantity', () => {
    expect(calculateInvoice([{ price: 20, category: 'CLEARANCE' }], 0, 0))
      .toMatchObject({ subtotal: 20, discount: 5, total: 15 });
  });
  it('skips invalid lines and clamps rates', () => {
    expect(calculateInvoice([null, { price: -1 }, { price: 10 }], 2, -1))
      .toEqual({ subtotal: 10, discount: 10, tax: 0, total: 0, skipped: 2 });
  });
});
