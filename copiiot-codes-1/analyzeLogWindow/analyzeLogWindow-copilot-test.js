import { describe, expect, it } from 'vitest';
import { analyzeLogWindow } from './analyzeLogWindow.js';

describe('analyzeLogWindow', () => {
  it('validates time-window configuration', () => {
    expect(analyzeLogWindow([], 0, 10)).toMatchObject({ error: 'INVALID_INPUT' });
  });
  it('groups valid events into chronological buckets and counts errors', () => {
    expect(analyzeLogWindow([
      { timestamp: 100, level: 'INFO' }, { timestamp: 110, level: 'error' }, { timestamp: 125, level: 'ERROR' }
    ], 60, 30)).toEqual({ buckets: [
      { start: 95, total: 2, errors: 1 }, { start: 125, total: 1, errors: 1 }
    ], invalidCount: 0, outsideWindowCount: 0, windowStart: 65, windowEnd: 125, error: null });
  });
  it('counts malformed entries and returns an empty result when no entries are valid', () => {
    expect(analyzeLogWindow([null], 10, 5)).toEqual({
      buckets: [], invalidCount: 1, outsideWindowCount: 0, windowStart: null, windowEnd: null, error: null
    });
  });
});
