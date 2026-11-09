import { describe, expect, it } from 'vitest';
import { compareSnapshots } from './compareSnapshots.js';

describe('compareSnapshots', () => {
  it('returns no changes for identical snapshots', () => {
    expect(compareSnapshots({ a: 1 }, { a: 1 })).toEqual([]);
  });
  it('reports nested changes, additions, and removals in path order', () => {
    expect(compareSnapshots({ a: { x: 1 }, gone: true }, { a: { x: 2 }, added: 3 })).toEqual([
      { path: '$.a.x', before: 1, after: 2 },
      { path: '$.added', before: undefined, after: 3 },
      { path: '$.gone', before: true, after: undefined }
    ]);
  });
  it('compares array indexes and type changes', () => {
    expect(compareSnapshots([1, 2], [1, 3])).toEqual([{ path: '$[1]', before: 2, after: 3 }]);
    expect(compareSnapshots({ a: 1 }, [1])).toHaveLength(1);
  });
  it('terminates when both snapshots contain cycles', () => {
    const left = {}; left.self = left;
    const right = {}; right.self = right;
    expect(compareSnapshots(left, right)).toEqual([]);
  });
});
