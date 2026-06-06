'use client';

import { useState } from 'react';
import { ShieldAlert, Snowflake, Ban, Lock, CheckCircle2 } from 'lucide-react';
import CustomerPicker, { Customer, AccountStatus } from '@/components/CustomerPicker';
import styles from '../admin.module.css';

const STATUS_META: Record<
  AccountStatus,
  { label: string; bg: string; color: string }
> = {
  active: { label: 'Active', bg: '#dcfce7', color: '#166534' },
  frozen: { label: 'Frozen', bg: '#dbeafe', color: '#1e40af' },
  blocked: { label: 'Blocked', bg: '#fee2e2', color: '#991b1b' },
  closed: { label: 'Closed', bg: '#e5e7eb', color: '#374151' },
};

const RESTRICT_ACTIONS: {
  status: Exclude<AccountStatus, 'active'>;
  label: string;
  Icon: typeof Snowflake;
  hint: string;
}[] = [
  { status: 'frozen', label: 'Freeze', Icon: Snowflake, hint: 'Temporary hold — easily reversible' },
  { status: 'blocked', label: 'Block', Icon: Ban, hint: 'Ban the account from signing in' },
  { status: 'closed', label: 'Close', Icon: Lock, hint: 'Mark the account as permanently closed' },
];

export default function AdminRestrictionsPage() {
  const [selected, setSelected] = useState<Customer | null>(null);
  const [targetStatus, setTargetStatus] = useState<Exclude<AccountStatus, 'active'>>('frozen');
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const pick = (c: Customer) => {
    setSelected(c);
    setReason(c.accountStatus !== 'active' ? c.statusReason || '' : '');
    setTargetStatus('frozen');
    setMessage(null);
  };

  const applyStatus = async (status: AccountStatus) => {
    if (!selected) return;
    if (status !== 'active' && !reason.trim()) {
      setMessage({ type: 'err', text: 'Please provide a reason the customer will see.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/users/${selected._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reason: reason.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSelected({
          ...selected,
          accountStatus: data.user.accountStatus,
          statusReason: data.user.statusReason,
        });
        if (status === 'active') setReason('');
        setMessage({
          type: 'ok',
          text:
            status === 'active'
              ? `Access restored for ${selected.name}. They can sign in again.`
              : `${selected.name}'s account is now ${status}. They can no longer sign in.`,
        });
      } else {
        setMessage({ type: 'err', text: data.error || 'Failed to update account status.' });
      }
    } catch {
      setMessage({ type: 'err', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const currentMeta = selected ? STATUS_META[selected.accountStatus] : STATUS_META.active;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={24} /> Account Restrictions
          </h1>
        </div>

        <p style={{ color: '#64748b', margin: '0 0 20px', fontSize: '14px' }}>
          Freeze, block, or close a customer&apos;s account. While restricted, the customer cannot
          sign in and will see the reason you provide here.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 1fr) 1.2fr', gap: '24px', alignItems: 'start' }}>
          {/* Customer search */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h2 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>Find a customer</h2>
            <CustomerPicker onSelect={pick} selectedId={selected?._id} />
          </div>

          {/* Action panel */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            {!selected ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                <ShieldAlert size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                <p style={{ fontWeight: 600, color: '#475569', margin: 0 }}>Select a customer</p>
                <p style={{ fontSize: '13px', margin: '6px 0 0' }}>Choose someone from the list to manage their access.</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>{selected.name}</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>{selected.email}</div>
                    {selected.accountNumber && (
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Account {selected.accountNumber}</div>
                    )}
                  </div>
                  <span
                    style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      background: currentMeta.bg,
                      color: currentMeta.color,
                    }}
                  >
                    {currentMeta.label}
                  </span>
                </div>

                {selected.accountStatus !== 'active' && selected.statusReason && (
                  <div style={{ background: '#fef2f2', borderLeft: '4px solid #dc2626', borderRadius: '8px', padding: '12px 14px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#991b1b', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Current reason
                    </div>
                    <div style={{ fontSize: '13.5px', color: '#7f1d1d' }}>{selected.statusReason}</div>
                  </div>
                )}

                {selected.accountStatus !== 'active' ? (
                  /* Already restricted — offer restore + the option to update */
                  <button
                    onClick={() => applyStatus('active')}
                    disabled={saving}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: '#16a34a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '14px',
                      cursor: saving ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      marginBottom: '24px',
                    }}
                  >
                    <CheckCircle2 size={18} /> {saving ? 'Working…' : 'Restore Access'}
                  </button>
                ) : null}

                {/* Restrict controls */}
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '10px' }}>
                  {selected.accountStatus === 'active' ? 'Restrict this account' : 'Change restriction'}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
                  {RESTRICT_ACTIONS.map(({ status, label, Icon, hint }) => {
                    const active = targetStatus === status;
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setTargetStatus(status)}
                        title={hint}
                        style={{
                          padding: '14px 8px',
                          borderRadius: '10px',
                          border: active ? '2px solid #2563eb' : '1px solid #e5e7eb',
                          background: active ? '#eff6ff' : '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Icon size={20} color={active ? '#2563eb' : '#64748b'} />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: active ? '#1e40af' : '#475569' }}>{label}</span>
                      </button>
                    );
                  })}
                </div>

                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                  Reason shown to the customer
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  placeholder="e.g. Suspicious activity detected. Please contact support to verify your identity."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '14px',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    marginBottom: '16px',
                    fontFamily: 'inherit',
                  }}
                />

                <button
                  onClick={() => applyStatus(targetStatus)}
                  disabled={saving}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: saving ? '#94a3b8' : '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: saving ? 'default' : 'pointer',
                  }}
                >
                  {saving ? 'Applying…' : `Apply: ${STATUS_META[targetStatus].label}`}
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
