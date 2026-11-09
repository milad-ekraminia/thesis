export function auditTransactionLedger(entries, startingBalance, strictReplay = true) {
  // SLS 1: Validation
  if (!Array.isArray(entries) || typeof startingBalance !== 'number') {
    return { valid: false, code: "INVALID_INIT" };
  }

  let runningBalance = startingBalance;
  const ledgerMap = new Map();
  const flagged = [];
  let cursor = 0;

  // SLS 2: Log replay traversal
  while (cursor < entries.length) {
    const tx = entries[cursor++];

    if (!tx || typeof tx.id !== 'string' || typeof tx.amount !== 'number') {
      flagged.push({ entry: tx, reason: "MALFORMED" });
      if (strictReplay) return { valid: false, code: "CORRUPTED_ENTRY", cursor: cursor - 1 };
      continue;
    }

    // SLS 3: Deduplication check
    if (ledgerMap.has(tx.id)) {
      flagged.push({ entry: tx, reason: "DUPLICATE_TX" });
      if (strictReplay) return { valid: false, code: "DUPLICATE_KEY", id: tx.id };
      continue;
    }

    // SLS 4: Balance alteration matrix
    if (tx.type === 'CREDIT') {
      if (tx.amount <= 0) {
        flagged.push({ entry: tx, reason: "NEGATIVE_CREDIT" });
        continue;
      }
      runningBalance += tx.amount;
    } else if (tx.type === 'DEBIT') {
      if (tx.amount <= 0) {
        flagged.push({ entry: tx, reason: "NEGATIVE_DEBIT" });
        continue;
      }
      if (runningBalance - tx.amount < 0) {
        flagged.push({ entry: tx, reason: "OVERDRAFT" });
        if (strictReplay) return { valid: false, code: "INSUFFICIENT_FUNDS", balance: runningBalance };
        continue;
      }
      runningBalance -= tx.amount;
    } else {
      flagged.push({ entry: tx, reason: "UNKNOWN_TYPE" });
      continue;
    }

    ledgerMap.set(tx.id, runningBalance);
  }

  // SLS 5: Final consistency verification
  const isHealthy = flagged.length === 0 && runningBalance >= 0;
  return { valid: isHealthy, endingBalance: runningBalance, anomalies: flagged, processedCount: ledgerMap.size };
}