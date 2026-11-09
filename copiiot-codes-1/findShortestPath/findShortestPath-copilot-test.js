import { describe, expect, it } from 'vitest';
import { findShortestPath } from './findShortestPath.js';

describe('findShortestPath', () => {
  const graph = { a: [{ to: 'b', weight: 4 }, { to: 'c', weight: 1 }], b: [{ to: 'd', weight: 1 }], c: [{ to: 'b', weight: 1 }], d: [] };
  it('validates endpoints and graph', () => {
    expect(findShortestPath(null, 'a', 'b').error).toBe('INVALID_INPUT');
    expect(findShortestPath(graph, 'x', 'b').error).toBe('UNKNOWN_NODE');
  });
  it('returns the minimum path and distance', () => {
    expect(findShortestPath(graph, 'a', 'd')).toEqual({ path: ['a', 'c', 'b', 'd'], distance: 3, error: null });
  });
  it('handles the same source and destination and unreachable nodes', () => {
    expect(findShortestPath(graph, 'a', 'a')).toEqual({ path: ['a'], distance: 0, error: null });
    expect(findShortestPath({ a: [], b: [] }, 'a', 'b').error).toBe('UNREACHABLE');
  });
  it('ignores invalid edges', () => {
    expect(findShortestPath({ a: [{ to: 'b', weight: -1 }], b: [] }, 'a', 'b').error).toBe('UNREACHABLE');
  });
});
