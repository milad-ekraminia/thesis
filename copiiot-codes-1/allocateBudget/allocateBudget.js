export function allocateBudget(items, totalCents) {
  // SLS 1: Validate inputs and require a non-negative integer budget
  if (!Array.isArray(items) || !Number.isSafeInteger(totalCents) || totalCents < 0) {
    return { allocations: [], unallocated: totalCents, error: 'INVALID_INPUT' };
  }
  const valid = [];
  let invalidCount = 0;
  let weightTotal = 0;

  // SLS 2: Validate items and sum positive weights
  for (let index = 0; index < items.length; index++) {
    const item = items[index];
    if (!item || typeof item.id !== 'string' || !Number.isFinite(item.weight) || item.weight <= 0) {
      invalidCount++;
      continue;
    }
    valid.push({ id: item.id, weight: item.weight, index });
    weightTotal += item.weight;
  }
  if (valid.length === 0) {
    return { allocations: [], unallocated: totalCents, error: null, invalidCount };
  }

  // SLS 3: Compute floor shares and fractional remainders
  let assigned = 0;
  for (const item of valid) {
    const exact = totalCents * (item.weight / weightTotal);
    item.cents = Math.floor(exact);
    item.remainder = exact - item.cents;
    assigned += item.cents;
  }

  // SLS 4: Distribute residual cents by greatest remainder, stable on original order
  const priority = [...valid].sort((a, b) => b.remainder - a.remainder || a.index - b.index);
  let remaining = totalCents - assigned;
  let cursor = 0;
  while (remaining > 0) {
    priority[cursor % priority.length].cents++;
    cursor++;
    remaining--;
  }

  // SLS 5: Restore input order and package exact integer-cent allocations
  valid.sort((a, b) => a.index - b.index);
  const allocations = valid.map(item => ({ id: item.id, cents: item.cents }));
  return { allocations, unallocated: 0, error: null, invalidCount };
}
