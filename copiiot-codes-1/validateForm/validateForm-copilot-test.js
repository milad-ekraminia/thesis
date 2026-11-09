import { describe, expect, it } from 'vitest';
import { validateForm } from './validateForm.js';

describe('validateForm', () => {
  it('rejects invalid schema or values containers', () => {
    expect(validateForm(null, {})).toMatchObject({ valid: false });
  });
  it('accepts valid required string and numeric values', () => {
    expect(validateForm([
      { name: 'email', type: 'string', required: true, pattern: '^.+@.+$' },
      { name: 'age', type: 'number', min: 18 }
    ], { email: 'a@b.test', age: 20 })).toEqual({ valid: true, errors: [] });
  });
  it('reports required, type, and bounds errors', () => {
    expect(validateForm([{ name: 'age', type: 'number', required: true, min: 18 }], { age: '12' }).errors)
      .toEqual([{ field: 'age', code: 'TYPE' }]);
    expect(validateForm([{ name: 'name', required: true }], {}).errors)
      .toEqual([{ field: 'name', code: 'REQUIRED' }]);
  });
  it('reports duplicate fields and pattern mismatches', () => {
    expect(validateForm([{ name: 'x', type: 'string', pattern: '^a$' }, { name: 'x' }], { x: 'b' }).errors)
      .toEqual([{ field: 'x', code: 'PATTERN' }, { field: 'x', code: 'DUPLICATE_RULE' }]);
  });
  it('reports malformed rules, numeric bounds, and undeclared values', () => {
    expect(validateForm([
      null, { name: 'age', type: 'number', min: 18, max: 30 }
    ], { age: 12, extra: true }).errors).toEqual([
      { field: null, code: 'INVALID_RULE' },
      { field: 'age', code: 'MIN' },
      { field: 'extra', code: 'UNKNOWN_FIELD' }
    ]);
  });
});
