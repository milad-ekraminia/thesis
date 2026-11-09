import { describe, expect, it } from 'vitest';
import { flattenTree } from './flattenTree.js';

describe('flattenTree', () => {
  it('returns an empty list for invalid input', () => {
    expect(flattenTree(null)).toEqual([]);
  });
  it('flattens preorder with parent identifiers and depth', () => {
    expect(flattenTree([{ id: 'a', value: 1, children: [{ id: 'b', value: 2 }] }])).toEqual([
      { id: 'a', value: 1, parentId: null, depth: 0, path: '$[0]' },
      { id: 'b', value: 2, parentId: 'a', depth: 1, path: '$[0].children[0]' }
    ]);
  });
  it('terminates on cycles and skips invalid child references', () => {
    const root = { id: 'root', value: 0, children: [null] };
    root.children.push(root);
    expect(flattenTree([root])).toHaveLength(1);
  });
  it('preserves order across roots and sibling nodes', () => {
    expect(flattenTree([{ id: 1, children: [{ id: 2 }, { id: 3 }] }, { id: 4 }]).map(x => x.id))
      .toEqual([1, 2, 3, 4]);
  });
  it('respects the maximum included depth', () => {
    expect(flattenTree([{ id: 1, children: [{ id: 2 }] }], 0).map(node => node.id)).toEqual([1]);
  });
});
