import { describe, expect, it } from 'vitest';
import { resolveDependencyPipeline } from './resolveDependencyPipeline.js';

describe('resolveDependencyPipeline', () => {
  it('requires tasks to be an array', () => {
    expect(() => resolveDependencyPipeline(null)).toThrow(TypeError);
  });

  it('sorts a dependency chain before dependent tasks', () => {
    const result = resolveDependencyPipeline([
      { id: 'build', dependencies: ['install'] },
      { id: 'install' }
    ]);
    expect(result.success).toBe(true);
    expect(result.sorted.indexOf('install')).toBeLessThan(result.sorted.indexOf('build'));
  });

  it('includes referenced but undeclared dependency nodes and ignores self loops', () => {
    expect(resolveDependencyPipeline([{ id: 'task', dependencies: ['external', 'task'] }]).sorted)
      .toEqual(['external', 'task']);
  });

  it('reports cycles and iteration-limit failures', () => {
    expect(resolveDependencyPipeline([
      { id: 'a', dependencies: ['b'] }, { id: 'b', dependencies: ['a'] }
    ])).toMatchObject({ success: false, reason: 'CYCLE_DETECTED' });
    expect(resolveDependencyPipeline([{ id: 'a' }], { maxIterations: 0 }))
      .toEqual({ success: false, reason: 'MAX_ITERATIONS_EXCEEDED', sorted: [] });
  });
});
