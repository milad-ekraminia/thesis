import { describe, expect, it } from 'vitest';
import { mergeSortedEventStreams } from './mergeSortedEventStreams.js';

describe('mergeSortedEventStreams', () => {
  it('returns an empty result for invalid top-level input', () => {
    expect(mergeSortedEventStreams(null)).toEqual({ events: [], invalidCount: 0 });
  });
  it('merges sorted streams by timestamp and breaks ties by source order', () => {
    expect(mergeSortedEventStreams([
      [{ timestamp: 1, id: 'a' }, { timestamp: 3, id: 'c' }],
      [{ timestamp: 1, id: 'b' }, { timestamp: 2, id: 'd' }]
    ])).toEqual({ events: [
      { timestamp: 1, id: 'a', sourceIndex: 0 }, { timestamp: 1, id: 'b', sourceIndex: 1 },
      { timestamp: 2, id: 'd', sourceIndex: 1 }, { timestamp: 3, id: 'c', sourceIndex: 0 }
    ], invalidCount: 0, validStreamCount: 2 });
  });
  it('skips malformed events and counts malformed stream values', () => {
    expect(mergeSortedEventStreams([[null, { timestamp: 2 }], 12])).toEqual({
      events: [{ timestamp: 2, sourceIndex: 0 }], invalidCount: 2, validStreamCount: 1
    });
  });
});
