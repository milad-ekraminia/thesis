import { describe, expect, it } from 'vitest';
import { multiplySparseMatrices } from './multiplySparseMatrices.js';

describe('multiplySparseMatrices', () => {
  const dims = { r1: 2, c1: 2, r2: 2, c2: 2 };
  it('rejects invalid arguments and dimension specifications', () => {
    expect(() => multiplySparseMatrices(null, [], dims)).toThrow(TypeError);
    expect(() => multiplySparseMatrices([], [], {})).toThrow('Invalid dimension specs');
    expect(multiplySparseMatrices([], [], { ...dims, c1: 3 })).toEqual({ error: 'DIMENSION_MISMATCH', result: [] });
  });

  it('multiplies sparse matrices and returns deterministic row-major entries', () => {
    const result = multiplySparseMatrices(
      [{ r: 0, c: 1, v: 2 }, { r: 0, c: 0, v: 3 }],
      [{ r: 1, c: 0, v: 4 }, { r: 0, c: 1, v: 5 }],
      dims
    );
    expect(result).toEqual({ result: [{ r: 0, c: 0, v: 8 }, { r: 0, c: 1, v: 15 }], nonZeroCount: 2 });
  });

  it('ignores zero and out-of-range entries', () => {
    expect(multiplySparseMatrices(
      [{ r: 5, c: 0, v: 2 }, { r: 0, c: 0, v: 0 }],
      [{ r: 0, c: 0, v: 1 }],
      dims
    )).toEqual({ result: [], nonZeroCount: 0 });
  });

  it('removes coordinates whose accumulated products cancel', () => {
    expect(multiplySparseMatrices(
      [{ r: 0, c: 0, v: 1 }, { r: 0, c: 1, v: 1 }],
      [{ r: 0, c: 0, v: 2 }, { r: 1, c: 0, v: -2 }],
      dims
    )).toEqual({ result: [], nonZeroCount: 0 });
  });
});
