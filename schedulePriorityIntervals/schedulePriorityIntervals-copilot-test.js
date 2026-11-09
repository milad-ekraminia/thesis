import { describe, expect, it } from 'vitest';
import { schedulePriorityIntervals } from './schedulePriorityIntervals.js';

describe('schedulePriorityIntervals', () => {
  it('handles invalid input', () => {
    expect(schedulePriorityIntervals(null)).toEqual({ scheduled: [], dropped: [] });
  });

  it('filters invalid and out-of-window intervals and supplies IDs', () => {
    const result = schedulePriorityIntervals([
      { start: 0, end: 2 },
      { start: 2, end: 1 },
      { start: -1, end: 1 }
    ], { start: 0, end: 3 });
    expect(result.scheduled).toMatchObject([{ id: 'idx_0', start: 0, end: 2, priority: 0 }]);
  });

  it('schedules non-overlapping intervals and computes total coverage', () => {
    const result = schedulePriorityIntervals([
      { id: 'a', start: 0, end: 2, priority: 1 },
      { id: 'b', start: 2, end: 5, priority: 1 }
    ]);
    expect(result.scheduled.map(item => item.id)).toEqual(['a', 'b']);
    expect(result.totalCoverage).toBe(5);
  });

  it('drops overlapping intervals when preemption threshold is not met', () => {
    const result = schedulePriorityIntervals([
      { id: 'a', start: 0, end: 2, priority: 2 },
      { id: 'b', start: 1, end: 3, priority: 2 }
    ]);
    expect(result.dropped).toHaveLength(1);
    expect(result.dropped[0].item.id).toBe('b');
    expect(result.dropped[0].reason).toBe('OVERLAP');
  });

  it('allows a sufficiently high-priority overlapping interval to preempt', () => {
    const result = schedulePriorityIntervals([
      { id: 'a', start: 0, end: 2, priority: 1 },
      { id: 'b', start: 1, end: 3, priority: 2 }
    ]);
    expect(result.dropped).toHaveLength(1);
    expect(result.dropped[0].item.id).toBe('a');
    expect(result.dropped[0].reason).toBe('PREEMPTED');
  });
});
