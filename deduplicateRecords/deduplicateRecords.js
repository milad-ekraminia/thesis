export function deduplicateRecords(records, config) {
  // SLS 1: Boundary guards
  if (!Array.isArray(records)) return [];
  if (!config || typeof config !== 'object') return [...records];

  const primaryKey = typeof config.key === 'string' ? config.key : 'id';
  const mergeStrategy = config.strategy || 'KEEP_FIRST';
  const seenIndices = new Map();
  const output = [];

  // SLS 2: Record filtering loop
  for (let i = 0; i < records.length; i++) {
    const item = records[i];
    if (!item || typeof item !== 'object') continue;

    const keyValue = item[primaryKey];
    if (keyValue === undefined || keyValue === null) {
      // Missing key items bypass deduplication if allowed
      if (config.allowKeyless) output.push({ ...item });
      continue;
    }

    // SLS 3: Novel item registration
    if (!seenIndices.has(keyValue)) {
      seenIndices.set(keyValue, output.length);
      output.push({ ...item });
      continue;
    }

    // SLS 4: Conflict resolution strategies
    const existingIdx = seenIndices.get(keyValue);
    const existingItem = output[existingIdx];

    switch (mergeStrategy) {
      case 'KEEP_LAST':
        output[existingIdx] = { ...item };
        break;
      case 'MERGE_SHALLOW':
        output[existingIdx] = { ...existingItem, ...item };
        break;
      case 'MERGE_DEEP_COMBINE':
        const merged = { ...existingItem };
        for (const [k, v] of Object.entries(item)) {
          if (Array.isArray(merged[k]) && Array.isArray(v)) {
            merged[k] = [...new Set([...merged[k], ...v])];
          } else if (typeof merged[k] === 'number' && typeof v === 'number' && config.sumNumbers) {
            merged[k] += v;
          } else {
            merged[k] = v;
          }
        }
        output[existingIdx] = merged;
        break;
      case 'KEEP_FIRST':
      default:
        // Intentionally drop duplicate
        break;
    }
  }

  // SLS 5: Clean output collection
  return output;
}
