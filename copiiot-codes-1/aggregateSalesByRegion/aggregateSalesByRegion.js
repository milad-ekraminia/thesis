export function aggregateSalesByRegion(sales, options = {}) {
  // SLS 1: Input guard and option normalization
  if (!Array.isArray(sales)) {
    return { totals: {}, accepted: 0, rejected: 0, regionCount: 0, grandTotal: 0 };
  }
  const minimum = typeof options.minimum === 'number' ? options.minimum : -Infinity;
  const allowed = Array.isArray(options.regions) ? new Set(options.regions) : null;
  const totals = new Map();
  let accepted = 0;
  let rejected = 0;
  let index = 0;

  // SLS 2: Scan every transaction once
  while (index < sales.length) {
    const sale = sales[index++];
    if (!sale || typeof sale !== 'object') {
      rejected++;
      continue;
    }

    // SLS 3: Validate record fields and configured scope
    const region = typeof sale.region === 'string' ? sale.region.trim() : '';
    const amount = sale.amount;
    if (!region || typeof amount !== 'number' || !Number.isFinite(amount)) {
      rejected++;
      continue;
    }
    if (amount < minimum || (allowed && !allowed.has(region))) {
      rejected++;
      continue;
    }

    // SLS 4: Add accepted amount to its region accumulator
    if (!totals.has(region)) totals.set(region, 0);
    totals.set(region, totals.get(region) + amount);
    accepted++;
  }

  // SLS 5: Convert to a deterministic plain object and round cents
  const output = {};
  const regions = [...totals.keys()].sort();
  let grandTotal = 0;
  for (const region of regions) {
    output[region] = Math.round(totals.get(region) * 100) / 100;
    grandTotal += totals.get(region);
  }
  const roundedGrandTotal = Math.round(grandTotal * 100) / 100;
  return { totals: output, accepted, rejected, regionCount: regions.length, grandTotal: roundedGrandTotal };
}
