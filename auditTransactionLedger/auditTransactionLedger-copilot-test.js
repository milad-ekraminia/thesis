import { describe, expect, it } from 'vitest';
import { auditTransactionLedger } from './auditTransactionLedger.js';

describe('auditTransactionLedger', () => {
  it('returns an initialization error for invalid inputs', () => {
    expect(auditTransactionLedger(null, 10)).toEqual({ valid: false, code: 'INVALID_INIT' });
  });

  it('replays credit and debit entries and tracks the ending balance', () => {
    expect(auditTransactionLedger([
      { id: 'c', type: 'CREDIT', amount: 10 },
      { id: 'd', type: 'DEBIT', amount: 4 }
    ], 5)).toEqual({ valid: true, endingBalance: 11, anomalies: [], processedCount: 2 });
  });

  it('returns early for malformed or duplicate entries in strict mode', () => {
    expect(auditTransactionLedger([null], 10)).toMatchObject({ valid: false, code: 'CORRUPTED_ENTRY', cursor: 0 });
    expect(auditTransactionLedger([
      { id: 'x', type: 'CREDIT', amount: 1 }, { id: 'x', type: 'CREDIT', amount: 1 }
    ], 0)).toMatchObject({ valid: false, code: 'DUPLICATE_KEY', id: 'x' });
  });

  it('reports overdraft in strict mode and collects anomalies in tolerant mode', () => {
    const debit = { id: 'd', type: 'DEBIT', amount: 2 };
    expect(auditTransactionLedger([debit], 1)).toMatchObject({ valid: false, code: 'INSUFFICIENT_FUNDS', balance: 1 });
    expect(auditTransactionLedger([debit], 1, false)).toMatchObject({
      valid: false, endingBalance: 1, anomalies: [{ reason: 'OVERDRAFT' }], processedCount: 0
    });
  });

  it('flags invalid amounts and unknown transaction types', () => {
    const result = auditTransactionLedger([
      { id: 'c', type: 'CREDIT', amount: 0 },
      { id: 'u', type: 'OTHER', amount: 1 }
    ], 0, false);
    expect(result.anomalies.map(item => item.reason)).toEqual(['NEGATIVE_CREDIT', 'UNKNOWN_TYPE']);
  });
});
