// src/lib/txDisplay.ts
// Pure, dependency-free helpers for presenting a transaction's direction and
// amount. Safe to import from both client components and server routes (no
// jsPDF / Node-only imports here).

export interface TxLike {
  type: string;
  amount: number;
  origin?: string | null;
  reference?: string | null;
}

const DEBIT_TYPES = [
  'transfer-out',
  'withdraw',
  'withdrawal',
  'payment',
  'fee',
  'charge',
  'purchase',
  'external_transfer',
  'wire_transfer',
  'international_transfer',
  'adjustment-debit',
];

const DEBIT_ORIGINS = ['external_transfer', 'wire_transfer', 'international_transfer'];

/**
 * Whether a transaction credits (money in) or debits (money out) the account.
 * Mirrors the logic used across the transactions UI so receipts stay consistent.
 */
export function isCreditTransaction(tx: TxLike): boolean {
  const type = tx.type || '';
  const ref = tx.reference || '';

  // Internal transfers carry their direction in the reference suffix.
  if (type === 'transfer-out' || (tx.origin === 'internal_transfer' && ref.includes('-OUT'))) return false;
  if (type === 'transfer-in' || (tx.origin === 'internal_transfer' && ref.includes('-IN'))) return true;

  const isDebit = DEBIT_TYPES.includes(type) || (tx.origin ? DEBIT_ORIGINS.includes(tx.origin) : false);
  return !isDebit;
}

export function formatMoney(n: number, currency = 'USD'): string {
  const abs = Math.abs(Number(n) || 0);
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(abs);
  } catch {
    return '$' + abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}

export function formatSignedAmount(tx: TxLike, currency = 'USD'): string {
  return (isCreditTransaction(tx) ? '+' : '-') + formatMoney(tx.amount, currency);
}

/** Title-case a transaction type for display, e.g. "transfer-out" -> "Transfer Out". */
export function prettyType(type: string): string {
  return (type || '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function prettyStatus(status: string): string {
  const s = (status || '').toLowerCase();
  if (s === 'approved' || s === 'completed') return 'Completed';
  if (s === 'pending_verification') return 'Pending Verification';
  if (s === 'rejected' || s === 'failed') return s === 'failed' ? 'Failed' : 'Rejected';
  if (s === 'processing') return 'Processing';
  if (s === 'pending') return 'Pending';
  return prettyType(status);
}
