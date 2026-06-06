'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Search, User as UserIcon, X } from 'lucide-react';

export type AccountStatus = 'active' | 'frozen' | 'blocked' | 'closed';

export interface Customer {
  _id: string;
  name: string;
  email: string;
  accountNumber: string;
  routingNumber?: string;
  role: string;
  verified: boolean;
  accountStatus: AccountStatus;
  statusReason?: string;
  checkingBalance: number;
  savingsBalance: number;
  investmentBalance: number;
  createdAt?: string;
  updatedAt?: string;
}

interface CustomerPickerProps {
  onSelect: (customer: Customer) => void;
  selectedId?: string | null;
  placeholder?: string;
  pageSize?: number;
}

const STATUS_PILL: Record<Exclude<AccountStatus, 'active'>, { label: string; bg: string; color: string }> = {
  frozen: { label: 'Frozen', bg: '#dbeafe', color: '#1e40af' },
  blocked: { label: 'Blocked', bg: '#fee2e2', color: '#991b1b' },
  closed: { label: 'Closed', bg: '#e5e7eb', color: '#374151' },
};

function StatusPill({ status }: { status: AccountStatus }) {
  if (status === 'active') return null;
  const s = STATUS_PILL[status];
  return (
    <span
      style={{
        padding: '2px 8px',
        borderRadius: '20px',
        fontSize: '10px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        background: s.bg,
        color: s.color,
      }}
    >
      {s.label}
    </span>
  );
}

const money = (n: number) =>
  '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function CustomerPicker({
  onSelect,
  selectedId = null,
  placeholder = 'Search by name, email, or account number…',
  pageSize = 25,
}: CustomerPickerProps) {
  const [query, setQuery] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Stale-response guard: every request gets a sequence number; only the most
  // recent one is allowed to commit results, so fast typing can't flicker the
  // list with out-of-order responses.
  const requestSeq = useRef(0);

  const fetchPage = useCallback(
    async (q: string, pageToLoad: number, mode: 'replace' | 'append') => {
      const seq = ++requestSeq.current;
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams({
          q,
          page: String(pageToLoad),
          limit: String(pageSize),
        });
        const res = await fetch(`/api/admin/users?${params.toString()}`, { cache: 'no-store' });
        const data = await res.json();
        if (seq !== requestSeq.current) return; // a newer request superseded this one

        if (!res.ok || !data.success) {
          setError(data?.error || 'Failed to load customers');
          if (mode === 'replace') setCustomers([]);
          return;
        }

        setTotal(data.total || 0);
        setHasMore(Boolean(data.hasMore));
        setPage(data.page || pageToLoad);
        setCustomers((prev) => (mode === 'append' ? [...prev, ...data.users] : data.users));
      } catch {
        if (seq !== requestSeq.current) return;
        setError('Failed to load customers');
        if (mode === 'replace') setCustomers([]);
      } finally {
        if (seq === requestSeq.current) setLoading(false);
      }
    },
    [pageSize]
  );

  // Debounced live search. Also runs on mount (empty query) to preload the
  // most recent customers.
  useEffect(() => {
    const t = setTimeout(() => {
      fetchPage(query.trim(), 1, 'replace');
    }, 300);
    return () => clearTimeout(t);
  }, [query, fetchPage]);

  return (
    <div>
      {/* Search input */}
      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <Search
          size={18}
          style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '12px 40px',
            border: '1px solid #e5e7eb',
            borderRadius: '10px',
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#94a3b8',
              display: 'flex',
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Count / status line */}
      <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '8px', minHeight: '18px' }}>
        {error ? (
          <span style={{ color: '#dc2626' }}>{error}</span>
        ) : loading && customers.length === 0 ? (
          'Searching…'
        ) : query.trim() ? (
          <>
            {total} {total === 1 ? 'match' : 'matches'} for “{query.trim()}”
          </>
        ) : (
          <>{total} total customers</>
        )}
      </div>

      {/* Scrollable results list */}
      <div
        style={{
          maxHeight: '320px',
          overflowY: 'auto',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          background: '#fff',
        }}
      >
        {customers.length === 0 && !loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
            No customers found
          </div>
        ) : (
          <>
            {customers.map((c) => {
              const selected = selectedId === c._id;
              return (
                <button
                  key={c._id}
                  type="button"
                  onClick={() => onSelect(c)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    border: 'none',
                    borderBottom: '1px solid #f1f5f9',
                    background: selected ? '#eff6ff' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      flexShrink: 0,
                      background: selected
                        ? 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)'
                        : 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <UserIcon size={18} color="white" />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontWeight: 600,
                          color: '#1e293b',
                          fontSize: '14px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {c.name}
                      </span>
                      <StatusPill status={c.accountStatus} />
                    </div>
                    <div
                      style={{
                        fontSize: '12.5px',
                        color: '#64748b',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {c.email}
                      {c.accountNumber ? ` · ${c.accountNumber}` : ''}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                      {money(c.checkingBalance + c.savingsBalance + c.investmentBalance)}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>total balance</div>
                  </div>
                </button>
              );
            })}

            {hasMore && (
              <button
                type="button"
                onClick={() => fetchPage(query.trim(), page + 1, 'append')}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: 'none',
                  background: '#f8fafc',
                  color: '#2563eb',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: loading ? 'default' : 'pointer',
                }}
              >
                {loading ? 'Loading…' : `Load more (${total - customers.length} remaining)`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
