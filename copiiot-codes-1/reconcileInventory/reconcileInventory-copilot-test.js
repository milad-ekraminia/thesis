import { describe, expect, it } from 'vitest';
import { reconcileInventory } from './reconcileInventory.js';

describe('reconcileInventory', () => {
  it('rejects invalid snapshots', () => {
    expect(reconcileInventory([], null)).toEqual({ changes: [], invalidCount: 0, valid: false });
  });
  it('reports changed, added, and removed SKUs in sorted order', () => {
    expect(reconcileInventory([{ sku: 'b', quantity: 2 }, { sku: 'a', quantity: 1 }], [
      { sku: 'b', quantity: 3 }, { sku: 'c', quantity: 4 }
    ])).toEqual({ changes: [
      { sku: 'a', before: 1, after: 0, delta: -1 },
      { sku: 'b', before: 2, after: 3, delta: 1 },
      { sku: 'c', before: 0, after: 4, delta: 4 }
    ], invalidCount: 0, valid: true });
  });
  it('combines duplicate SKUs and counts invalid rows', () => {
    expect(reconcileInventory([{ sku: 'x', quantity: 2 }, { sku: 'x', quantity: 3 }, null], [
      { sku: 'x', quantity: 5 }
    ])).toEqual({ changes: [], invalidCount: 1, valid: false });
  });
});
