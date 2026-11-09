import { describe, expect, it } from 'vitest';
import { buildDependencyLayers } from './buildDependencyLayers.js';

describe('buildDependencyLayers', () => {
  it('rejects invalid collections', () => {
    expect(buildDependencyLayers(null).error).toBe('INVALID_INPUT');
  });
  it('places prerequisite tasks in earlier layers', () => {
    expect(buildDependencyLayers([{ id: 'b', dependencies: ['a'] }, { id: 'a' }]))
      .toMatchObject({ success: true, layers: [['a'], ['b']] });
  });
  it('reports unknown dependencies and cycles', () => {
    expect(buildDependencyLayers([{ id: 'a', dependencies: ['missing'] }]).error).toBe('UNKNOWN_DEPENDENCY');
    expect(buildDependencyLayers([{ id: 'a', dependencies: ['b'] }, { id: 'b', dependencies: ['a'] }]).error)
      .toBe('CYCLE_DETECTED');
  });
  it('counts malformed and duplicate task IDs while ignoring duplicate edges', () => {
    expect(buildDependencyLayers([null, { id: 'a' }, { id: 'a' }])).toMatchObject({
      success: true, layers: [['a']], invalidCount: 2
    });
  });
});
