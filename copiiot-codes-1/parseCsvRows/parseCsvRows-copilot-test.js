import { describe, expect, it } from 'vitest';
import { parseCsvRows } from './parseCsvRows.js';

describe('parseCsvRows', () => {
  it('rejects unsupported arguments', () => {
    expect(parseCsvRows(null)).toEqual({ rows: [], columnCounts: [], error: 'INVALID_INPUT' });
    expect(parseCsvRows('a;b', ';;')).toEqual({ rows: [], columnCounts: [], error: 'INVALID_INPUT' });
  });
  it('parses plain fields and CRLF rows', () => {
    expect(parseCsvRows('a,b\r\nc,d')).toEqual({ rows: [['a', 'b'], ['c', 'd']], columnCounts: [2, 2], error: null });
  });
  it('preserves separators and escaped quotes inside quoted fields', () => {
    expect(parseCsvRows('"a,b","say ""hi"""')).toEqual({
      rows: [['a,b', 'say "hi"']], columnCounts: [2], error: null
    });
  });
  it('reports unfinished quoted fields and retains completed rows', () => {
    expect(parseCsvRows('ok,yes\n"unfinished')).toEqual({
      rows: [['ok', 'yes'], ['unfinished']], columnCounts: [2, 1], error: 'UNTERMINATED_QUOTE'
    });
  });
});
