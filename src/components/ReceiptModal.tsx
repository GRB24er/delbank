'use client';

import { useState } from 'react';
import { X, Download, Mail, CheckCircle2, Loader2 } from 'lucide-react';
import {
  isCreditTransaction,
  formatMoney,
  formatSignedAmount,
  prettyType,
  prettyStatus,
} from '@/lib/txDisplay';

export interface ReceiptTransaction {
  _id: string;
  type: string;
  amount: number;
  description?: string;
  date: string;
  status: string;
  accountType: string;
  reference?: string;
  channel?: string;
  origin?: string;
  balanceAfter?: number;
  currency?: string;
}

interface ReceiptModalProps {
  transaction: ReceiptTransaction;
  accountHolder?: string;
  onClose: () => void;
}

function receiptNumberFor(tx: ReceiptTransaction): string {
  const year = new Date(tx.date || Date.now()).getFullYear();
  return `RCPT-${year}-${String(tx._id).slice(-8).toUpperCase()}`;
}

const Row = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', padding: '9px 0', borderBottom: '1px solid #f1f5f9' }}>
    <span style={{ fontSize: '12.5px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: 600 }}>{label}</span>
    <span style={{ fontSize: '13.5px', color: '#1e293b', fontWeight: 600, textAlign: 'right', fontFamily: mono ? 'ui-monospace, SFMono-Regular, Menlo, monospace' : 'inherit', wordBreak: 'break-word' }}>{value}</span>
  </div>
);

export default function ReceiptModal({ transaction, accountHolder, onClose }: ReceiptModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [emailing, setEmailing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const currency = transaction.currency || 'USD';
  const isCredit = isCreditTransaction(transaction);
  const signed = formatSignedAmount(transaction, currency);
  const receiptNumber = receiptNumberFor(transaction);
  const dateText = new Date(transaction.date).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' });

  const download = async () => {
    setDownloading(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/transactions/${transaction._id}/receipt`, { cache: 'no-store' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to generate receipt');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Fregetrust_${receiptNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setFeedback({ type: 'err', text: e?.message || 'Download failed' });
    } finally {
      setDownloading(false);
    }
  };

  const email = async () => {
    setEmailing(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/transactions/${transaction._id}/receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setFeedback({ type: 'ok', text: data.message || 'Receipt emailed.' });
      } else {
        throw new Error(data.error || 'Failed to email receipt');
      }
    } catch (e: any) {
      setFeedback({ type: 'err', text: e?.message || 'Email failed' });
    } finally {
      setEmailing(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,23,42,0.55)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '40px 16px',
        zIndex: 1000,
        overflowY: 'auto',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: '16px', maxWidth: '460px', width: '100%', boxShadow: '0 24px 60px rgba(0,0,0,0.3)', overflow: 'hidden' }}
      >
        {/* Header band */}
        <div style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #1e3a8a 100%)', padding: '22px 24px', position: 'relative' }}>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#fff', display: 'flex' }}
          >
            <X size={18} />
          </button>
          <div style={{ color: '#3b82f6', fontWeight: 800, letterSpacing: '0.06em', fontSize: '18px' }}>FREGETRUST</div>
          <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px', marginTop: '2px' }}>Transaction Receipt</div>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Amount */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Amount</div>
            <div style={{ fontSize: '34px', fontWeight: 800, color: isCredit ? '#059669' : '#dc2626', marginTop: '4px' }}>{signed}</div>
            <div style={{ marginTop: '8px' }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  background: prettyStatus(transaction.status) === 'Completed' ? '#dcfce7' : prettyStatus(transaction.status) === 'Failed' || prettyStatus(transaction.status) === 'Rejected' ? '#fee2e2' : '#fef3c7',
                  color: prettyStatus(transaction.status) === 'Completed' ? '#166534' : prettyStatus(transaction.status) === 'Failed' || prettyStatus(transaction.status) === 'Rejected' ? '#991b1b' : '#92400e',
                }}
              >
                {prettyStatus(transaction.status)}
              </span>
            </div>
          </div>

          {/* Details */}
          <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '4px 16px', marginBottom: '20px' }}>
            <Row label="Receipt No." value={receiptNumber} mono />
            {accountHolder && <Row label="Account Holder" value={accountHolder} />}
            <Row label="Account" value={prettyType(transaction.accountType) + ' Account'} />
            <Row label="Reference" value={transaction.reference || '—'} mono />
            <Row label="Type" value={prettyType(transaction.type)} />
            {transaction.description && <Row label="Description" value={transaction.description} />}
            <Row label="Channel" value={transaction.channel ? prettyType(transaction.channel) : 'Online'} />
            {typeof transaction.balanceAfter === 'number' && (
              <Row label="Balance After" value={formatMoney(transaction.balanceAfter, currency)} />
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', padding: '9px 0' }}>
              <span style={{ fontSize: '12.5px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: 600 }}>Date</span>
              <span style={{ fontSize: '13.5px', color: '#1e293b', fontWeight: 600, textAlign: 'right' }}>{dateText}</span>
            </div>
          </div>

          {feedback && (
            <div
              style={{
                marginBottom: '16px',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '13px',
                background: feedback.type === 'ok' ? '#f0fdf4' : '#fef2f2',
                color: feedback.type === 'ok' ? '#166534' : '#991b1b',
                border: `1px solid ${feedback.type === 'ok' ? '#bbf7d0' : '#fecaca'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {feedback.type === 'ok' && <CheckCircle2 size={16} />}
              {feedback.text}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={download}
              disabled={downloading}
              style={{
                flex: 1,
                padding: '13px',
                background: '#0f172a',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: downloading ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {downloading ? <Loader2 size={16} className="spin" /> : <Download size={16} />}
              {downloading ? 'Preparing…' : 'Download PDF'}
            </button>
            <button
              onClick={email}
              disabled={emailing}
              style={{
                flex: 1,
                padding: '13px',
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: emailing ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {emailing ? <Loader2 size={16} className="spin" /> : <Mail size={16} />}
              {emailing ? 'Sending…' : 'Email Receipt'}
            </button>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } .spin { animation: spin 1s linear infinite; }`}</style>
    </div>
  );
}
