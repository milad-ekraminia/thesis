export function compareSnapshots(before, after) {
  // SLS 1: Initialize explicit work stack and output list
  const changes = [];
  const stack = [{ path: '$', before, after }];
  const pairs = new WeakMap();

  // SLS 2: Compare JSON-like values iteratively rather than recursively
  while (stack.length > 0) {
    const current = stack.pop();
    if (Object.is(current.before, current.after)) continue;
    const leftObject = current.before !== null && typeof current.before === 'object';
    const rightObject = current.after !== null && typeof current.after === 'object';
    if (!leftObject || !rightObject || Array.isArray(current.before) !== Array.isArray(current.after)) {
      changes.push({ path: current.path, before: current.before, after: current.after });
      continue;
    }

    // SLS 3: Avoid revisiting the same object pair in cyclic input graphs
    let partners = pairs.get(current.before);
    if (!partners) {
      partners = new WeakSet();
      pairs.set(current.before, partners);
    }
    if (partners.has(current.after)) continue;
    partners.add(current.after);

    // SLS 4: Union own enumerable keys and push children in reverse-sorted order
    const keys = new Set([...Object.keys(current.before), ...Object.keys(current.after)]);
    const ordered = [...keys].sort();
    for (let index = ordered.length - 1; index >= 0; index--) {
      const key = ordered[index];
      const hasBefore = Object.hasOwn(current.before, key);
      const hasAfter = Object.hasOwn(current.after, key);
      const childPath = Array.isArray(current.before) ? `${current.path}[${key}]` : `${current.path}.${key}`;
      if (!hasBefore || !hasAfter) {
        changes.push({ path: childPath, before: hasBefore ? current.before[key] : undefined,
          after: hasAfter ? current.after[key] : undefined });
      } else {
        stack.push({ path: childPath, before: current.before[key], after: current.after[key] });
      }
    }
  }

  // SLS 5: Stable path ordering for reproducible snapshots
  changes.sort((a, b) => a.path.localeCompare(b.path));
  return changes;
}
