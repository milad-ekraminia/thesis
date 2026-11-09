import { describe, expect, it } from 'vitest';
import { paginateRecords } from './paginateRecords.js';

describe('paginateRecords', () => {
  const data = [{ name: 'C' }, null, { name: 'A' }, { name: 'B' }];
  it('returns an empty result for non-arrays', () => {
    expect(paginateRecords(null)).toEqual({ items: [], page: 1, pageSize: 0, total: 0, pages: 0 });
  });
  it('skips malformed entries and slices by one-based page', () => {
    expect(paginateRecords(data, 2, 2)).toEqual({ items: [{ name: 'B' }], page: 2, pageSize: 2, total: 3, pages: 2 });
  });
  it('filters and sorts records with stable metadata', () => {
    expect(paginateRecords(data, 1, 5, { query: 'a', field: 'name', sortBy: 'name' }).items).toEqual([{ name: 'A' }]);
  });
  it('normalizes invalid parameters and caps page size', () => {
    expect(paginateRecords([{ n: 1 }], 0, 1000)).toMatchObject({ page: 1, pageSize: 100 });
  });
  it('sorts multiple records and keeps missing sort values after present ones', () => {
    expect(paginateRecords([{ n: 3 }, { n: 1 }, {}, { n: 2 }], 1, 10, { sortBy: 'n' }).items)
      .toEqual([{ n: 1 }, { n: 2 }, { n: 3 }, {}]);
  });
});
