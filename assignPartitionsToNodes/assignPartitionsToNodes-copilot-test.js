import { describe, expect, it } from 'vitest';
import { assignPartitionsToNodes } from './assignPartitionsToNodes.js';

describe('assignPartitionsToNodes', () => {
  it('returns unassigned keys when the node list is empty or invalid', () => {
    expect(assignPartitionsToNodes(['a'], [])).toEqual({ mapping: {}, unassigned: ['a'] });
  });

  it('assigns string keys deterministically to valid nodes', () => {
    const first = assignPartitionsToNodes(['alpha', 'beta', 'gamma'], ['node-a', 'node-b'], 3);
    const second = assignPartitionsToNodes(['alpha', 'beta', 'gamma'], ['node-a', 'node-b'], 3);
    expect(first).toEqual(second);
    expect(first.totalAssigned).toBe(3);
  });

  it('tracks non-string keys as unassigned and ignores invalid physical nodes', () => {
    const result = assignPartitionsToNodes(['valid', 42], [' ', null, 'node'], 1);
    expect(result.unassigned).toEqual([42]);
    expect(result.totalAssigned).toBe(1);
  });

  it('uses at least one virtual node and caps the replication factor', () => {
    expect(assignPartitionsToNodes(['a'], ['node'], 0).totalAssigned).toBe(1);
    expect(assignPartitionsToNodes(['a'], ['node'], 100).totalAssigned).toBe(1);
  });
});
