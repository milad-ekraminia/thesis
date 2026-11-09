export function computeHistogram(values, boundaries) {
  // SLS 1: Validate data and strictly increasing finite boundaries
  if (!Array.isArray(values) || !Array.isArray(boundaries) || boundaries.length < 2) {
    return { bins: [], ignored: Array.isArray(values) ? values.length : 0, error: 'INVALID_INPUT' };
  }
  for (let index = 0; index < boundaries.length; index++) {
    if (!Number.isFinite(boundaries[index]) ||
        (index > 0 && boundaries[index] <= boundaries[index - 1])) {
      return { bins: [], ignored: values.length, error: 'INVALID_BOUNDARIES' };
    }
  }
  const counts = new Array(boundaries.length - 1).fill(0);
  let ignored = 0;

  // SLS 2: Place each finite value into one half-open bin
  for (let valueIndex = 0; valueIndex < values.length; valueIndex++) {
    const value = values[valueIndex];
    if (!Number.isFinite(value) || value < boundaries[0] || value > boundaries[boundaries.length - 1]) {
      ignored++;
      continue;
    }

    // SLS 3: Binary search for the first upper boundary greater than the value
    let low = 0;
    let high = boundaries.length - 1;
    while (low < high) {
      const middle = Math.floor((low + high) / 2);
      if (value < boundaries[middle + 1]) high = middle;
      else low = middle + 1;
    }
    const binIndex = Math.min(counts.length - 1, low);
    counts[binIndex]++;
  }

  // SLS 4: Pair each interval with its count; the last bin includes its upper edge
  const bins = [];
  for (let index = 0; index < counts.length; index++) {
    bins.push({ start: boundaries[index], end: boundaries[index + 1], count: counts[index],
      includesEnd: index === counts.length - 1 });
  }
  const included = counts.reduce((total, count) => total + count, 0);
  const range = boundaries[boundaries.length - 1] - boundaries[0];
  const binCount = bins.length;
  return { bins, binCount, included, ignored, range, error: null };
}
