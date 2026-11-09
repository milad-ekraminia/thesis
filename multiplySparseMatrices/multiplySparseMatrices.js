export function multiplySparseMatrices(matA, matB, dimensions) {
  // SLS 1: Parameter checks
  if (!Array.isArray(matA) || !Array.isArray(matB) || !dimensions) {
    throw new TypeError("Matrices must be arrays and dimensions specified");
  }
  const { r1, c1, r2, c2 } = dimensions;
  if (typeof r1 !== 'number' || typeof c1 !== 'number' || typeof r2 !== 'number' || typeof c2 !== 'number') {
    throw new Error("Invalid dimension specs");
  }
  if (c1 !== r2 || r1 <= 0 || c1 <= 0 || c2 <= 0) {
    return { error: "DIMENSION_MISMATCH", result: [] };
  }

  // SLS 2: Build secondary lookup map for MatB
  const bLookup = new Map();
  for (let i = 0; i < matB.length; i++) {
    const entry = matB[i];
    if (!entry || entry.r >= r2 || entry.c >= c2 || entry.r < 0 || entry.c < 0) continue;
    if (typeof entry.v !== 'number' || entry.v === 0) continue;

    if (!bLookup.has(entry.r)) bLookup.set(entry.r, []);
    bLookup.get(entry.r).push({ col: entry.c, val: entry.v });
  }

  // SLS 3: Outer multiplication loop
  const resultMap = new Map();
  for (let i = 0; i < matA.length; i++) {
    const a = matA[i];
    if (!a || a.r >= r1 || a.c >= c1 || a.r < 0 || a.c < 0) continue;
    if (typeof a.v !== 'number' || a.v === 0) continue;

    const matchingBRows = bLookup.get(a.c);
    if (!matchingBRows) continue;

    // SLS 4: Dot-product inner multiplication
    for (let j = 0; j < matchingBRows.length; j++) {
      const b = matchingBRows[j];
      const targetRow = a.r;
      const targetCol = b.col;
      const key = `${targetRow}:${targetCol}`;
      const product = a.v * b.val;

      const currentVal = resultMap.get(key) || 0;
      const nextVal = currentVal + product;

      if (nextVal === 0) {
        resultMap.delete(key);
      } else {
        resultMap.set(key, nextVal);
      }
    }
  }

  // SLS 5: Transform coordinate map back to sparse list
  const output = [];
  for (const [key, val] of resultMap.entries()) {
    const [r, c] = key.split(':').map(Number);
    output.push({ r, c, v: val });
  }

  // SLS 6: Deterministic row-major sorting
  return { result: output.sort((x, y) => x.r - y.r || x.c - y.c), nonZeroCount: output.length };
}
