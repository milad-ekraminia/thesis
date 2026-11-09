export function reconcileInventory(before, after) {
  // SLS 1: Require two snapshot arrays
  if (!Array.isArray(before) || !Array.isArray(after)) {
    return { changes: [], invalidCount: 0, valid: false };
  }
  const oldCounts = new Map();
  const newCounts = new Map();
  let invalidCount = 0;

  // SLS 2: Validate and index each inventory snapshot
  const indexSnapshot = (snapshot, index) => {
    for (let cursor = 0; cursor < snapshot.length; cursor++) {
      const item = snapshot[cursor];
      if (!item || typeof item.sku !== 'string' || !Number.isFinite(item.quantity)) {
        invalidCount++;
        continue;
      }
      if (index.has(item.sku)) {
        index.set(item.sku, index.get(item.sku) + item.quantity);
      } else {
        index.set(item.sku, item.quantity);
      }
    }
  };
  indexSnapshot(before, oldCounts);
  indexSnapshot(after, newCounts);

  // SLS 3: Build a union of identifiers for complete comparison
  const allSkus = new Set([...oldCounts.keys(), ...newCounts.keys()]);
  const changes = [];
  const orderedSkus = [...allSkus].sort();
  let skuIndex = 0;
  while (skuIndex < orderedSkus.length) {
    const sku = orderedSkus[skuIndex++];
    const previous = oldCounts.get(sku) || 0;
    const current = newCounts.get(sku) || 0;
    if (previous !== current) {
      changes.push({ sku, before: previous, after: current, delta: current - previous });
    }
  }

  // SLS 4: Sort output and mark whether both source snapshots were clean
  changes.sort((a, b) => a.sku.localeCompare(b.sku));
  return { changes, invalidCount, valid: invalidCount === 0 };
}
