import { describe, expect, it } from 'vitest';
import { deduplicateRecords } from './deduplicateRecords.js';

describe('deduplicateRecords', () => {
  it('handles invalid records input and absent configuration', () => {
    expect(deduplicateRecords(null, {})).toEqual([]);
    const records = [{ id: 1 }, { id: 1 }];
    expect(deduplicateRecords(records)).toEqual(records);
  });

  it('keeps the first duplicate by default and ignores malformed records', () => {
    expect(deduplicateRecords([{ id: 1, value: 'first' }, null, { id: 1, value: 'last' }], {}))
      .toEqual([{ id: 1, value: 'first' }]);
  });

  it('supports keep-last and shallow merge', () => {
    const records = [{ id: 'a', a: 1 }, { id: 'a', b: 2 }];
    expect(deduplicateRecords(records, { strategy: 'KEEP_LAST' })).toEqual([{ id: 'a', b: 2 }]);
    expect(deduplicateRecords(records, { strategy: 'MERGE_SHALLOW' })).toEqual([{ id: 'a', a: 1, b: 2 }]);
  });

  it('deep-combines arrays and optionally sums numeric fields', () => {
    expect(deduplicateRecords(
      [{ id: 'a', tags: ['a'], count: 2 }, { id: 'a', tags: ['a', 'b'], count: 3 }],
      { strategy: 'MERGE_DEEP_COMBINE', sumNumbers: true }
    )).toEqual([{ id: 'a', tags: ['a', 'b'], count: 5 }]);
  });

  it('retains keyless records only when configured', () => {
    expect(deduplicateRecords([{ name: 'x' }], { allowKeyless: true })).toEqual([{ name: 'x' }]);
    expect(deduplicateRecords([{ name: 'x' }], {})).toEqual([]);
  });
});
