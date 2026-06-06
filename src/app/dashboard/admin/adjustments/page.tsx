'use client';

import { useState } from 'react';
import { SlidersHorizontal, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import CustomerPicker, { Customer } from '@/components/CustomerPicker';
import styles from '../admin.module.css';

const ACCOUNTS = [
  { value: 'checking', label: 'Checking', key: 'checkingBalance' as const },
  { value: 'savings', label: 'Savings', key: 'savingsBalance' as const },
  { value: 'investment', label: 'Investment', key: 'investmentBalance' as const },
];

const money = (n: number) =>
  '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function AdminAdjustmentsPage() {
  const [selected, setSelected] = useState<Customer | null>(null);
  const [type, setType] = useState<'credit' | 'debit'>('credit');
  const [accountType, setAccountType] = useState('checking');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const pick = (c: Customer) => {
    setSelected(c);
    setMessage(null);
  };

  const submit = async () => {
    if (!selected) return;
    const value = parseFloat(amount);
    if (!value || value <= 0) {
      setMessage({ type: 'err', text: 'Enter a valid amount greater than zero.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/update-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selected._id,
          amount: value,
          type,
          accountType,
          description: description.trim() || `Admin ${type} adjustment`,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const key = ACCOUNTS.find((a) => a.value === accountType)!.key;
        const newBal = data.user?.[key];
        setSelected({ ...selected, [key]: typeof newBal === 'number' ? newBal : selected[key] });
        setAmount('');
        setDescription('');
        setMessage({
          type: 'ok',
          text: `${type === 'credit' ? 'Credited' : 'Debited'} ${money(value)} ${
            type === 'credit' ? 'to' : 'from'
          } ${selected.name}'s ${accountType} account.`,
        });
      } else {
        setMessage({ type: 'err', text: data.error || 'Failed to adjust balance.' });
      }
    } catch {
      setMessage({ type: 'err', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <SlidersHorizontal size={24} /> Balance Adjustments
          </h1>
        </div>

        <p style={{ color: '#64748b', margin: '0 0 20px', fontSize: '14px' }}>
          Credit or debit a customer&apos;s account. Adjustments post immediately and the customer is
          emailed a confirmation.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 1fr) 1.2fr', gap: '24px', alignItems: 'start' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h2 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>Find a customer</h2>
            <CustomerPicker onSelect={pick} selectedId={selected?._id} />
          </div>

          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            {!selected ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                <SlidersHorizontal size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                <p style={{ fontWeight: 600, color: '#475569', margin: 0 }}>Select a customer</p>
                <p style={{ fontSize: '13px', margin: '6px 0 0' }}>Choose someone to credit or debit.</p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>{selected.name}</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>{selected.email}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
                  {ACCOUNTS.map((a) => (
                    <div key={a.value} style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>{a.label}</div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>{money(selected[a.key])}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                  <button
                    type="button"
                    onClick={() => setType('credit')}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: type === 'credit' ? '2px solid #16a34a' : '1px solid #e5e7eb',
                      background: type === 'credit' ? '#f0fdf4' : '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontWeight: 600,
                      color: type === 'credit' ? '#166534' : '#475569',
                    }}
                  >
                    <ArrowUpCircle size={18} /> Credit
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('debit')}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: type === 'debit' ? '2px solid #dc2626' : '1px solid #e5e7eb',
                      background: type === 'debit' ? '#fef2f2' : '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontWeight: 600,
                      color: type === 'debit' ? '#991b1b' : '#475569',
                    }}
                  >
                    <ArrowDownCircle size={18} /> Debit
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Account</label>
                    <select
                      value={accountType}
                      onChange={(e) => setAccountType(e.target.value)}
                      style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box' }}
                    >
                      {ACCOUNTS.map((a) => (
                        <option key={a.value} value={a.value}>{a.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Amount</label>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Description (optional)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Reason for this adjustment"
                  style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '16px' }}
                />

                <button
                  onClick={submit}
                  disabled={saving}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: saving ? '#94a3b8' : type === 'credit' ? '#16a34a' : '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: saving ? 'default' : 'pointer',
                  }}
                >
                  {saving ? 'Processing…' : `${type === 'credit' ? 'Credit' : 'Debit'} account`}
                </button>

                {message && (
                  <div
                    style={{
                      marginTop: '16px',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      fontSize: '13.5px',
                      background: message.type === 'ok' ? '#f0fdf4' : '#fef2f2',
                      color: message.type === 'ok' ? '#166534' : '#991b1b',
                      border: `1px solid ${message.type === 'ok' ? '#bbf7d0' : '#fecaca'}`,
                    }}
                  >
                    {message.text}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
