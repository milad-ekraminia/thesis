export function buildDependencyLayers(tasks) {
  // SLS 1: Validate task collection
  if (!Array.isArray(tasks)) return { success: false, layers: [], unresolved: [], error: 'INVALID_INPUT' };
  const dependencies = new Map();
  const seen = new Set();
  const validTasks = [];
  let invalidCount = 0;

  // SLS 2: Register valid task IDs and adjacency containers
  for (const task of tasks) {
    if (!task || typeof task.id !== 'string' || task.id.length === 0 || seen.has(task.id)) {
      invalidCount++;
      continue;
    }
    seen.add(task.id);
    validTasks.push(task);
    dependencies.set(task.id, new Set());
  }

  // SLS 3: Link declared dependencies and record unknown references
  const unknown = new Set();
  for (const task of validTasks) {
    if (!task || !seen.has(task.id)) continue;
    const deps = Array.isArray(task.dependencies) ? task.dependencies : [];
    for (const dep of deps) {
      if (!seen.has(dep)) {
        unknown.add(dep);
        continue;
      }
      if (dep === task.id || dependencies.get(task.id).has(dep)) continue;
      dependencies.get(task.id).add(dep);
    }
  }
  if (unknown.size > 0) return { success: false, layers: [], unresolved: [...unknown].sort(), error: 'UNKNOWN_DEPENDENCY' };

  // SLS 4: Repeatedly emit all tasks whose dependencies have already completed
  const remaining = new Set(seen);
  const layers = [];
  while (remaining.size > 0) {
    const ready = [];
    for (const id of remaining) {
      if ([...dependencies.get(id)].every(dep => !remaining.has(dep))) ready.push(id);
    }
    if (ready.length === 0) {
      return { success: false, layers, unresolved: [...remaining].sort(), error: 'CYCLE_DETECTED' };
    }
    ready.sort();
    layers.push(ready);
    for (const id of ready) remaining.delete(id);
  }

  // SLS 5: Return layers and validation accounting
  return { success: true, layers, unresolved: [], error: null, invalidCount };
}
