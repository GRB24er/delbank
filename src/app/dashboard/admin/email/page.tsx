'use client';

import { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import CustomerPicker, { Customer } from '@/components/CustomerPicker';
import styles from '../admin.module.css';

export default function AdminEmailPage() {
  const [selected, setSelected] = useState<Customer | null>(null);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const pick = (c: Customer) => {
    setSelected(c);
    setMessage(null);
  };

  const send = async () => {
    if (!selected) return;
    if (!subject.trim() || !body.trim()) {
      setMessage({ type: 'err', text: 'Subject and message are both required.' });
      return;
    }
    setSending(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selected._id, subject: subject.trim(), message: body.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubject('');
        setBody('');
        setMessage({ type: 'ok', text: `Email sent to ${selected.email}.` });
      } else {
        setMessage({ type: 'err', text: data.error || 'Failed to send email.' });
      }
    } catch {
      setMessage({ type: 'err', text: 'Network error. Please try again.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Mail size={24} /> Send Email
          </h1>
        </div>

        <p style={{ color: '#64748b', margin: '0 0 20px', fontSize: '14px' }}>
          Send a direct, branded email to any customer.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 1fr) 1.2fr', gap: '24px', alignItems: 'start' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h2 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>Find a customer</h2>
            <CustomerPicker onSelect={pick} selectedId={selected?._id} />
          </div>

          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            {!selected ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                <Mail size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                <p style={{ fontWeight: 600, color: '#475569', margin: 0 }}>Select a customer</p>
                <p style={{ fontSize: '13px', margin: '6px 0 0' }}>Choose a recipient from the list.</p>
              </div>
            ) : (
              <>
                <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px 14px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>To</div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>{selected.name}</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>{selected.email}</div>
                </div>

                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject line"
                  style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '16px' }}
                />

                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Message</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={8}
                  placeholder="Write your message…"
                  style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box', marginBottom: '16px', fontFamily: 'inherit' }}
                />

                <button
                  onClick={send}
                  disabled={sending}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: sending ? '#94a3b8' : '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: sending ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <Send size={18} /> {sending ? 'Sending…' : 'Send email'}
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
