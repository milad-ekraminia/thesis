import { describe, expect, it } from 'vitest';
import { evaluateSemVerRequirement } from './evaluateSemVerRequirement.js';

describe('evaluateSemVerRequirement', () => {
  it('rejects non-string and malformed versions', () => {
    expect(evaluateSemVerRequirement(null, '^1.0.0')).toBe(false);
    expect(evaluateSemVerRequirement('not-a-version', '>=1.0.0')).toBe(false);
  });

  it('compares exact versions and greater-than boundaries', () => {
    expect(evaluateSemVerRequirement('v1.2.3', '1.2.3')).toBe(true);
    expect(evaluateSemVerRequirement('1.2.4', '>1.2.3')).toBe(true);
    expect(evaluateSemVerRequirement('1.2.3', '>1.2.3')).toBe(false);
    expect(evaluateSemVerRequirement('1.2.3', '<=1.2.3')).toBe(true);
  });

  it('supports caret, zero-major restrictions, and OR clauses', () => {
    expect(evaluateSemVerRequirement('1.9.0', '^1.2.0')).toBe(true);
    expect(evaluateSemVerRequirement('2.0.0', '^1.2.0')).toBe(false);
    expect(evaluateSemVerRequirement('0.2.9', '^0.2.1')).toBe(true);
    expect(evaluateSemVerRequirement('0.3.0', '^0.2.1')).toBe(false);
    expect(evaluateSemVerRequirement('3.0.0', '<1.0.0 || >=3.0.0')).toBe(true);
  });
});
