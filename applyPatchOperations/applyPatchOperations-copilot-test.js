import { describe, expect, it } from 'vitest';
import { applyPatchOperations } from './applyPatchOperations.js';

describe('applyPatchOperations', () => {
  it('validates the base and returns unchanged target for non-array patches', () => {
    expect(() => applyPatchOperations(null, [])).toThrow('Base target must be an object');
    const base = { a: 1 };
    expect(applyPatchOperations(base, null)).toEqual({ target: base, applied: 0, failed: 0 });
  });

  it('applies add and replace operations to a cloned target', () => {
    const base = { user: { name: 'Ada' } };
    const result = applyPatchOperations(base, [
      { op: 'replace', path: '/user/name', value: 'Grace' },
      { op: 'add', path: '/active', value: true }
    ]);
    expect(result).toEqual({ target: { user: { name: 'Grace' }, active: true }, applied: 2, failed: 0 });
    expect(base.user.name).toBe('Ada');
  });

  it('removes object keys and array entries', () => {
    expect(applyPatchOperations({ a: 1, list: ['x', 'y'] }, [
      { op: 'remove', path: '/a' }, { op: 'remove', path: '/list/0' }
    ])).toEqual({ target: { list: ['y'] }, applied: 2, failed: 0 });
  });

  it('counts malformed, unknown, and missing-path patches in tolerant mode', () => {
    expect(applyPatchOperations({}, [null, { op: 'test', path: '/x' }, { op: 'add', path: '/a/b', value: 1 }]))
      .toEqual({ target: {}, applied: 0, failed: 3 });
  });

  it('supports automatic path creation and strict errors', () => {
    expect(applyPatchOperations({}, [{ op: 'add', path: '/a/b', value: 1 }], { autoCreatePaths: true }).target)
      .toEqual({ a: { b: 1 } });
    expect(() => applyPatchOperations({}, [null], { strict: true })).toThrow(/Malformed patch/);
    expect(() => applyPatchOperations({}, [{ op: 'remove', path: '/missing/x' }], { strict: true })).toThrow(/Path not found/);
  });
});
