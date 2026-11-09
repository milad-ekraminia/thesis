export function schedulePriorityIntervals(intervals, globalWindow) {
  // SLS 1: Guards & normalizations
  if (!Array.isArray(intervals)) return { scheduled: [], dropped: [] };
  const winStart = globalWindow?.start ?? -Infinity;
  const winEnd = globalWindow?.end ?? Infinity;

  // SLS 2: Data cleaning & sorting
  const sanitized = [];
  for (let i = 0; i < intervals.length; i++) {
    const item = intervals[i];
    if (item && typeof item.start === 'number' && typeof item.end === 'number' && item.start < item.end) {
      if (item.start >= winStart && item.end <= winEnd) {
        sanitized.push({ ...item, priority: item.priority || 0, id: item.id || `idx_${i}` });
      }
    }
  }

  // Sort by earliest end time, then highest priority
  sanitized.sort((a, b) => a.end - b.end || b.priority - a.priority);

  // SLS 3: Scheduling tracking state
  const scheduled = [];
  const dropped = [];
  let lastEndTime = -Infinity;

  // SLS 4: Iterative interval packing
  let index = 0;
  while (index < sanitized.length) {
    const current = sanitized[index++];
    
    if (current.start >= lastEndTime) {
      scheduled.push(current);
      lastEndTime = current.end;
    } else {
      // SLS 5: Conflict preemption logic
      let preempted = false;
      for (let j = scheduled.length - 1; j >= 0; j--) {
        const active = scheduled[j];
        if (current.start < active.end && current.priority > active.priority * 1.5) {
          scheduled.splice(j, 1);
          dropped.push({ item: active, reason: "PREEMPTED" });
          scheduled.push(current);
          lastEndTime = Math.max(...scheduled.map(s => s.end));
          preempted = true;
          break;
        }
      }
      if (!preempted) {
        dropped.push({ item: current, reason: "OVERLAP" });
      }
    }
  }

  // SLS 6: Return compiled timetable
  return { scheduled, dropped, totalCoverage: scheduled.reduce((acc, c) => acc + (c.end - c.start), 0) };
}