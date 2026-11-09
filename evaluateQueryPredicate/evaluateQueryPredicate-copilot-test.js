import { describe, expect, it } from 'vitest';
import { evaluateQueryPredicate } from './evaluateQueryPredicate.js';

describe('evaluateQueryPredicate', () => {
  const record = { name: 'Ada Lovelace', age: 36, role: 'admin', missing: null };
  it('handles invalid records and an empty predicate', () => {
    expect(evaluateQueryPredicate(null, {})).toBe(false);
    expect(evaluateQueryPredicate(record, null)).toBe(true);
  });

  it('evaluates AND, OR, and NOT with empty logical lists', () => {
    expect(evaluateQueryPredicate(record, { AND: [{ field: 'age', op: 'GT', value: 20 }, { field: 'role', op: 'EQ', value: 'admin' }] })).toBe(true);
    expect(evaluateQueryPredicate(record, { OR: [{ field: 'age', op: 'LT', value: 20 }, { field: 'role', op: 'EQ', value: 'admin' }] })).toBe(true);
    expect(evaluateQueryPredicate(record, { NOT: { field: 'role', op: 'EQ', value: 'guest' } })).toBe(true);
    expect(evaluateQueryPredicate(record, { AND: [] })).toBe(false);
    expect(evaluateQueryPredicate(record, { OR: [] })).toBe(false);
  });

  it('supports equality, ordering, membership, and null operators', () => {
    for (const [op, value] of [['EQ', 36], ['NEQ', 0], ['GT', 35], ['LT', 37], ['IN', [36]], ['IS_NULL', null]]) {
      const field = op === 'IS_NULL' ? 'missing' : 'age';
      expect(evaluateQueryPredicate(record, { field, op, value })).toBe(true);
    }
  });

  it('matches LIKE patterns case-insensitively and rejects invalid operators', () => {
    expect(evaluateQueryPredicate(record, { field: 'name', op: 'LIKE', value: 'ada%' })).toBe(true);
    expect(evaluateQueryPredicate(record, { field: 'age', op: 'GT', value: '3' })).toBe(false);
    expect(evaluateQueryPredicate(record, { field: 'age', op: 'wat', value: 1 })).toBe(false);
  });
});
