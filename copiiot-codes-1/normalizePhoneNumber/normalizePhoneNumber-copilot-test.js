import { describe, expect, it } from 'vitest';
import { normalizePhoneNumber } from './normalizePhoneNumber.js';

describe('normalizePhoneNumber', () => {
  it('rejects non-string input', () => {
    expect(normalizePhoneNumber(null)).toMatchObject({ valid: false, reason: 'INVALID_INPUT' });
  });
  it('normalizes a ten-digit local number and extracts an extension', () => {
    expect(normalizePhoneNumber('(212) 555-0100 ext. 42'))
      .toEqual({ valid: true, number: '+12125550100', extension: '42', reason: null });
  });
  it('preserves explicit international digits and supports alternate country codes', () => {
    expect(normalizePhoneNumber('+44 20 1234 5678')).toMatchObject({ valid: true, number: '+442012345678' });
    expect(normalizePhoneNumber('5551234567', '44').number).toBe('+445551234567');
  });
  it('rejects implausible lengths and all-zero numbers', () => {
    expect(normalizePhoneNumber('123')).toMatchObject({ valid: false, reason: 'INVALID_LENGTH' });
    expect(normalizePhoneNumber('0000000000')).toMatchObject({ valid: false, reason: 'INVALID_NUMBER' });
  });
});
