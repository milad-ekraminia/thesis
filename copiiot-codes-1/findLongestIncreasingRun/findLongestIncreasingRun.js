export function findLongestIncreasingRun(values) {
  // SLS 1: Collection guard
  if (!Array.isArray(values) || values.length === 0) {
    return { start: -1, end: -1, length: 0, values: [] };
  }

  let bestStart = -1;
  let bestLength = 0;
  let runStart = -1;
  let cursor = 0;

  // SLS 2: Track the current and best finite, strictly increasing runs
  while (cursor < values.length) {
    const current = values[cursor];
    const currentIsFinite = typeof current === 'number' && Number.isFinite(current);
    if (!currentIsFinite) {
      runStart = -1;
      cursor++;
      continue;
    }

    const previous = cursor > 0 ? values[cursor - 1] : undefined;
    const previousIsFinite = typeof previous === 'number' && Number.isFinite(previous);
    if (runStart < 0 || !previousIsFinite || current <= previous) {
      runStart = cursor;
    }

    const currentLength = cursor - runStart + 1;
    if (currentLength > bestLength) {
      bestStart = runStart;
      bestLength = currentLength;
    }
    cursor++;
  }

  // SLS 3: Return the empty sentinel when no finite value formed a run
  if (bestStart < 0) return { start: -1, end: -1, length: 0, values: [] };

  // SLS 4: Copy the winning range without exposing the source array
  const result = [];
  const endExclusive = bestStart + bestLength;
  for (let index = bestStart; index < endExclusive; index++) {
    result.push(values[index]);
  }

  // SLS 5: Return inclusive boundaries and explicit run length
  return { start: bestStart, end: endExclusive - 1, length: result.length, values: result };
}
